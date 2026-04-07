import express from 'express';
import CreditEntry from '../models/CreditEntry.js';
import Notification from '../models/Notification.js';
import NotificationRule from '../models/NotificationRule.js';
import Purchase from '../models/Purchase.js';
import Shop from '../models/Shop.js';
import StockItem from '../models/StockItem.js';
import { createAuthToken, requireAuth, verifyCredentials } from '../utils/auth.js';
import {
  createFallbackPurchase,
  createFallbackShop,
  createFallbackStock,
  getFallbackBootstrapPayload,
  markFallbackCreditAsPaid,
} from '../utils/fallbackStore.js';
import { computeStats, computeStockStatus, createCreditMeta } from '../utils/transformers.js';

const router = express.Router();
const isDatabaseAvailable = () => process.env.DATA_MODE !== 'memory';

function attachCreditContacts(creditEntries, retailShops) {
  const contactByShop = new Map(retailShops.map((shop) => [shop.shopName, shop.contact || '']));
  return creditEntries.map((entry) => ({
    ...entry,
    contact: entry.contact || contactByShop.get(entry.shopName) || '',
  }));
}

router.post('/auth/login', (request, response) => {
  const { username = '', password = '' } = request.body || {};

  if (!verifyCredentials(username, password)) {
    response.status(401).json({ message: 'Invalid admin username or password' });
    return;
  }

  response.json({
    token: createAuthToken(username),
    user: { username },
  });
});

router.get('/auth/session', requireAuth, (request, response) => {
  response.json({
    user: request.user,
  });
});

router.use(requireAuth);

async function buildBootstrapPayload() {
  if (!isDatabaseAvailable()) {
    return getFallbackBootstrapPayload();
  }

  const [purchaseRecords, stockItems, retailShops, creditEntries, notifications, notificationRules] = await Promise.all([
    Purchase.find().sort({ date: -1, createdAt: -1 }).lean(),
    StockItem.find().sort({ createdAt: -1 }).lean(),
    Shop.find().sort({ shopName: 1 }).lean(),
    CreditEntry.find().sort({ dueDate: 1 }).lean(),
    Notification.find().sort({ createdAt: -1 }).lean(),
    NotificationRule.find().sort({ createdAt: 1 }).lean(),
  ]);

  return {
    stats: computeStats({ purchaseRecords, stockItems, retailShops }),
    purchaseRecords,
    stockItems,
    retailShops,
    creditEntries: attachCreditContacts(creditEntries, retailShops),
    notifications,
    notificationRules: notificationRules.filter((rule) => rule.enabled).map((rule) => rule.name),
  };
}

router.get('/bootstrap', async (_request, response, next) => {
  try {
    const payload = await buildBootstrapPayload();
    response.json(payload);
  } catch (error) {
    next(error);
  }
});

router.post('/purchases', async (request, response, next) => {
  try {
    const payload = request.body;
    const purchaseItems = Array.isArray(payload.purchaseItems) ? payload.purchaseItems : [];

    if (!isDatabaseAvailable()) {
      response.status(201).json(createFallbackPurchase(payload));
      return;
    }

    if (!purchaseItems.length) {
      response.status(400).json({ message: 'Add at least one item to the purchase' });
      return;
    }

    const shop = await Shop.findOne({ shopName: payload.shopName }).lean();
    const requestedBySku = new Map();

    for (const item of purchaseItems) {
      const quantity = Number(item.quantity || 0);

      if (!item.stockSku) {
        response.status(400).json({ message: 'Please select an item from stock' });
        return;
      }

      if (quantity <= 0) {
        response.status(400).json({ message: 'Purchase quantity must be greater than zero' });
        return;
      }

      requestedBySku.set(item.stockSku, (requestedBySku.get(item.stockSku) || 0) + quantity);
    }

    const purchaseLabels = [];

    for (const [sku, quantity] of requestedBySku.entries()) {
      const stockItem = await StockItem.findOne({ sku });

      if (!stockItem) {
        response.status(404).json({ message: 'Selected stock item was not found' });
        return;
      }

      if (stockItem.quantity < quantity) {
        response.status(400).json({ message: `Only ${stockItem.quantity} pairs are available in stock for ${stockItem.name}` });
        return;
      }

      stockItem.quantity -= quantity;
      stockItem.status = computeStockStatus(stockItem.quantity, stockItem.minStock);
      await stockItem.save();
      purchaseLabels.push(`${quantity} pairs ${stockItem.name}`);
    }

    const purchase = await Purchase.create({
      invoice: payload.invoice,
      shopName: payload.shopName,
      owner: shop?.owner || '',
      city: shop?.city || '',
      items: purchaseLabels.join(', '),
      amount: `Rs ${new Intl.NumberFormat('en-IN').format(Number(payload.amount || 0))}`,
      date: payload.date,
      dueDate: payload.dueDate || '',
      status: payload.paymentStatus,
      statusDetail: payload.paymentStatus,
      contact: shop?.contact || '',
      notes: payload.notes || '',
    });

    if (payload.paymentStatus !== 'Paid') {
      const creditMeta = createCreditMeta({
        status: payload.paymentStatus,
        dueDate: payload.dueDate,
      });

      await CreditEntry.create({
        shopName: payload.shopName,
        owner: shop?.owner || '',
        city: shop?.city || '',
        contact: shop?.contact || '',
        amountDue: purchase.amount,
        dueDate: payload.dueDate || payload.date,
        issuedDate: payload.date,
        invoice: payload.invoice,
        status: creditMeta.status,
        progress: creditMeta.progress,
        daysLabel: creditMeta.daysLabel,
      });
    }

    response.status(201).json(purchase);
  } catch (error) {
    next(error);
  }
});

router.post('/stocks', async (request, response, next) => {
  try {
    const payload = request.body;

    if (!isDatabaseAvailable()) {
      response.status(201).json(createFallbackStock(payload));
      return;
    }

    const quantity = Number(payload.quantity || 0);
    const stock = await StockItem.create({
      name: payload.productName,
      sku: payload.sku,
      category: payload.category,
      size: payload.size,
      quantity,
      minStock: 40,
      status: computeStockStatus(quantity, 40),
      notes: payload.notes || '',
    });

    response.status(201).json(stock);
  } catch (error) {
    next(error);
  }
});

router.post('/shops', async (request, response, next) => {
  try {
    const payload = request.body;

    if (!isDatabaseAvailable()) {
      response.status(201).json(createFallbackShop(payload));
      return;
    }

    const shop = await Shop.create({
      shopName: payload.shopName,
      owner: payload.owner,
      city: payload.city,
      contact: payload.contact,
      creditLimit: `Rs ${new Intl.NumberFormat('en-IN').format(Number(payload.creditLimit || 0))}`,
      status: 'Active',
      since: new Date(payload.joinDate).toLocaleString('en-US', { month: 'short', year: 'numeric' }),
      address: payload.address || '',
    });

    response.status(201).json(shop);
  } catch (error) {
    next(error);
  }
});

async function handleMarkCreditAsPaid(request, response, next) {
  try {
    const invoice = decodeURIComponent(request.params.invoice);

    if (!isDatabaseAvailable()) {
      response.json(markFallbackCreditAsPaid(invoice));
      return;
    }

    const purchase = await Purchase.findOneAndUpdate(
      { invoice },
      { status: 'Paid', statusDetail: 'Paid' },
      { new: true },
    );

    if (!purchase) {
      response.status(404).json({ message: 'Purchase record not found for this invoice' });
      return;
    }

    await CreditEntry.deleteOne({ invoice });
    response.json(purchase);
  } catch (error) {
    next(error);
  }
}

router.patch('/credits/:invoice/pay', handleMarkCreditAsPaid);
router.post('/credits/:invoice/pay', handleMarkCreditAsPaid);

export default router;
