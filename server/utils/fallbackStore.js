import {
  creditEntries as initialCreditEntries,
  notificationRules as initialNotificationRules,
  notifications as initialNotifications,
  purchaseRecords as initialPurchaseRecords,
  retailShops as initialRetailShops,
  stockItems as initialStockItems,
} from '../../src/data/dashboardData.js';
import { computeStats, computeStockStatus, createCreditMeta, formatCurrency } from './transformers.js';

function cloneRecords(records) {
  return records.map((record) => ({ ...record }));
}

const fallbackStore = {
  purchaseRecords: cloneRecords(initialPurchaseRecords),
  stockItems: cloneRecords(initialStockItems),
  retailShops: cloneRecords(initialRetailShops),
  creditEntries: cloneRecords(initialCreditEntries),
  notifications: cloneRecords(initialNotifications),
  notificationRules: initialNotificationRules.map((name) => ({ name, enabled: true })),
};

function attachFallbackCreditContacts(creditEntries) {
  const contactByShop = new Map(fallbackStore.retailShops.map((shop) => [shop.shopName, shop.contact || '']));
  return creditEntries.map((entry) => ({
    ...entry,
    contact: entry.contact || contactByShop.get(entry.shopName) || '',
  }));
}

export function getFallbackBootstrapPayload() {
  return {
    stats: computeStats({
      purchaseRecords: fallbackStore.purchaseRecords,
      stockItems: fallbackStore.stockItems,
      retailShops: fallbackStore.retailShops,
    }),
    purchaseRecords: [...fallbackStore.purchaseRecords].sort((left, right) => right.date.localeCompare(left.date)),
    stockItems: [...fallbackStore.stockItems],
    retailShops: [...fallbackStore.retailShops].sort((left, right) => left.shopName.localeCompare(right.shopName)),
    creditEntries: attachFallbackCreditContacts([...fallbackStore.creditEntries]).sort((left, right) => left.dueDate.localeCompare(right.dueDate)),
    notifications: [...fallbackStore.notifications],
    notificationRules: fallbackStore.notificationRules.filter((rule) => rule.enabled).map((rule) => rule.name),
  };
}

export function createFallbackPurchase(payload) {
  const shop = fallbackStore.retailShops.find((entry) => entry.shopName === payload.shopName);
  const purchaseItems = Array.isArray(payload.purchaseItems) ? payload.purchaseItems : [];

  if (!purchaseItems.length) {
    throw new Error('Add at least one item to the purchase');
  }

  const requestedBySku = new Map();
  purchaseItems.forEach((item) => {
    const quantity = Number(item.quantity || 0);

    if (!item.stockSku) {
      throw new Error('Please select an item from stock');
    }

    if (quantity <= 0) {
      throw new Error('Purchase quantity must be greater than zero');
    }

    requestedBySku.set(item.stockSku, (requestedBySku.get(item.stockSku) || 0) + quantity);
  });

  const purchaseLabels = [];

  for (const [sku, quantity] of requestedBySku.entries()) {
    const stockItem = fallbackStore.stockItems.find((entry) => entry.sku === sku);

    if (!stockItem) {
      throw new Error('Selected stock item was not found');
    }

    if (stockItem.quantity < quantity) {
      throw new Error(`Only ${stockItem.quantity} pairs are available in stock for ${stockItem.name}`);
    }

    stockItem.quantity -= quantity;
    stockItem.status = computeStockStatus(stockItem.quantity, stockItem.minStock);
    purchaseLabels.push(`${quantity} pairs ${stockItem.name}`);
  }

  const purchase = {
    invoice: payload.invoice,
    shopName: payload.shopName,
    owner: shop?.owner || '',
    city: shop?.city || '',
    items: purchaseLabels.join(', '),
    amount: formatCurrency(Number(payload.amount || 0)),
    date: payload.date,
    dueDate: payload.dueDate || '',
    status: payload.paymentStatus,
    statusDetail: payload.paymentStatus,
    contact: shop?.contact || '',
    notes: payload.notes || '',
  };

  fallbackStore.purchaseRecords.unshift(purchase);

  if (payload.paymentStatus !== 'Paid') {
    const creditMeta = createCreditMeta({
      status: payload.paymentStatus,
      dueDate: payload.dueDate,
    });

    fallbackStore.creditEntries.unshift({
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

  return purchase;
}

export function createFallbackStock(payload) {
  const quantity = Number(payload.quantity || 0);
  const stock = {
    name: payload.productName,
    sku: payload.sku,
    category: payload.category,
    size: payload.size,
    quantity,
    minStock: 40,
    status: computeStockStatus(quantity, 40),
    notes: payload.notes || '',
  };

  fallbackStore.stockItems.unshift(stock);
  return stock;
}

export function createFallbackShop(payload) {
  const shop = {
    shopName: payload.shopName,
    owner: payload.owner,
    city: payload.city,
    contact: payload.contact,
    creditLimit: formatCurrency(Number(payload.creditLimit || 0)),
    status: 'Active',
    since: new Date(payload.joinDate).toLocaleString('en-US', { month: 'short', year: 'numeric' }),
    address: payload.address || '',
  };

  fallbackStore.retailShops.push(shop);
  fallbackStore.retailShops.sort((left, right) => left.shopName.localeCompare(right.shopName));
  return shop;
}

export function markFallbackCreditAsPaid(invoice) {
  const purchase = fallbackStore.purchaseRecords.find((entry) => entry.invoice === invoice);

  if (!purchase) {
    throw new Error('Purchase record not found for this invoice');
  }

  purchase.status = 'Paid';
  purchase.statusDetail = 'Paid';
  fallbackStore.creditEntries = fallbackStore.creditEntries.filter((entry) => entry.invoice !== invoice);

  return purchase;
}
