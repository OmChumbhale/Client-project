import { creditEntries, notificationRules, notifications, purchaseRecords, retailShops, stockItems } from '../../src/data/dashboardData.js';
import CreditEntry from '../models/CreditEntry.js';
import Notification from '../models/Notification.js';
import NotificationRule from '../models/NotificationRule.js';
import Purchase from '../models/Purchase.js';
import Shop from '../models/Shop.js';
import StockItem from '../models/StockItem.js';

export async function seedDatabase() {
  const existingPurchases = await Purchase.countDocuments();

  if (existingPurchases > 0) {
    return;
  }

  await Shop.insertMany(retailShops);
  await Purchase.insertMany(
    purchaseRecords.map((record) => ({
      ...record,
      dueDate:
        record.invoice === 'INV-0240'
          ? '2026-04-04'
          : record.invoice === 'INV-0236'
            ? '2026-04-07'
            : record.invoice === 'INV-0238'
              ? '2026-03-27'
              : '',
      notes: '',
    })),
  );
  await StockItem.insertMany(stockItems);
  await CreditEntry.insertMany(creditEntries);
  await Notification.insertMany(notifications);
  await NotificationRule.insertMany(notificationRules.map((rule) => ({ name: rule, enabled: true })));
}
