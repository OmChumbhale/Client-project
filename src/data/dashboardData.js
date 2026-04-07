export const stats = [
  { label: "Today's Sales", value: 'Rs 48,200', subtext: 'Up 12% from yesterday', tone: 'amber' },
  { label: 'Total Stock Items', value: '1,840', subtext: 'Across 12 categories', tone: 'green' },
  { label: 'Outstanding Credit', value: 'Rs 2,14,000', subtext: 'From 18 retail shops', tone: 'rust' },
  { label: 'Retail Shops', value: '34', subtext: '6 new this month', tone: 'ink' },
];

export const purchaseRecords = [
  { invoice: 'INV-0241', shopName: 'Krishna Footwear', owner: 'Suresh Krishna', city: 'Nashik', items: "24 pairs Men's Formal", amount: 'Rs 12,400', date: '2026-04-01', status: 'Paid', statusDetail: 'Paid', contact: '98765 43210' },
  { invoice: 'INV-0240', shopName: 'Shiv Shoe Store', owner: 'Mahesh Sharma', city: 'Nashik', items: '35 pairs Ladies Sandal', amount: 'Rs 8,750', date: '2026-03-30', status: 'Credit', statusDetail: 'Credit (30d)', contact: '87654 32109' },
  { invoice: 'INV-0239', shopName: 'Lakshmi Traders', owner: 'Priya Lakshmi', city: 'Pune', items: '80 pairs Sports Shoes', amount: 'Rs 22,000', date: '2026-03-28', status: 'Paid', statusDetail: 'Paid', contact: '76543 21098' },
  { invoice: 'INV-0238', shopName: 'Om Footwear', owner: 'Rahul Joshi', city: 'Aurangabad', items: '15 pairs Kids Shoes', amount: 'Rs 5,300', date: '2026-03-24', status: 'Overdue', statusDetail: 'Overdue', contact: '65432 10987' },
  { invoice: 'INV-0237', shopName: 'Ganesh Shoe Mart', owner: 'Ganesh Patil', city: 'Mumbai', items: '60 pairs Casual Loafers', amount: 'Rs 18,600', date: '2026-03-20', status: 'Paid', statusDetail: 'Paid', contact: '54321 09876' },
  { invoice: 'INV-0236', shopName: 'Patel Footwear', owner: 'Rajan Patel', city: 'Nashik', items: '42 pairs Formal Pumps', amount: 'Rs 14,200', date: '2026-03-18', status: 'Credit', statusDetail: 'Credit (45d)', contact: '43210 98765' },
];

export const stockItems = [
  { name: "Men's Formal Shoes", sku: 'MF-BLK-08', category: "Men's", size: '8', quantity: 12, minStock: 50, status: 'Critical' },
  { name: 'Ladies Sandals', sku: 'LS-BRN-05', category: "Women's", size: '5', quantity: 24, minStock: 50, status: 'Low' },
  { name: 'Sports Shoes', sku: 'SP-WHT-09', category: 'Sports', size: '9', quantity: 8, minStock: 60, status: 'Critical' },
  { name: 'Kids School Shoes', sku: 'KS-BLK-03', category: 'Kids', size: '3', quantity: 180, minStock: 40, status: 'In Stock' },
  { name: 'Casual Loafers', sku: 'CL-BRN-07', category: "Men's", size: '7', quantity: 240, minStock: 50, status: 'In Stock' },
  { name: "Women's Heels", sku: 'WH-RED-06', category: "Women's", size: '6', quantity: 28, minStock: 40, status: 'Low' },
];

export const retailShops = [
  { shopName: 'Krishna Footwear', owner: 'Suresh Krishna', city: 'Nashik', contact: '98765 43210', creditLimit: 'Rs 50,000', status: 'Active', since: 'Jan 2020' },
  { shopName: 'Shiv Shoe Store', owner: 'Mahesh Sharma', city: 'Nashik', contact: '87654 32109', creditLimit: 'Rs 30,000', status: 'Active', since: 'Mar 2021' },
  { shopName: 'Lakshmi Traders', owner: 'Priya Lakshmi', city: 'Pune', contact: '76543 21098', creditLimit: 'Rs 75,000', status: 'Active', since: 'Aug 2019' },
  { shopName: 'Om Footwear', owner: 'Rahul Joshi', city: 'Aurangabad', contact: '65432 10987', creditLimit: 'Rs 25,000', status: 'On Hold', since: 'Jun 2022' },
  { shopName: 'Ganesh Shoe Mart', owner: 'Ganesh Patil', city: 'Mumbai', contact: '54321 09876', creditLimit: 'Rs 60,000', status: 'Active', since: 'Feb 2020' },
  { shopName: 'Patel Footwear', owner: 'Rajan Patel', city: 'Nashik', contact: '43210 98765', creditLimit: 'Rs 20,000', status: 'Active', since: 'Nov 2023' },
];

export const creditEntries = [
  { shopName: 'Om Footwear', owner: 'Rahul Joshi', city: 'Aurangabad', amountDue: 'Rs 5,300', dueDate: '2026-03-27', issuedDate: '2026-02-24', invoice: 'INV-0238', status: 'Overdue', progress: 100, daysLabel: 'Overdue 5 days' },
  { shopName: 'Shiv Shoe Store', owner: 'Mahesh Sharma', city: 'Nashik', amountDue: 'Rs 8,750', dueDate: '2026-04-04', issuedDate: '2026-03-05', invoice: 'INV-0240', status: 'Due soon', progress: 87, daysLabel: 'Due in 3 days' },
  { shopName: 'Patel Footwear', owner: 'Rajan Patel', city: 'Nashik', amountDue: 'Rs 14,200', dueDate: '2026-04-07', issuedDate: '2026-03-08', invoice: 'INV-0236', status: 'Due soon', progress: 78, daysLabel: 'Due in 6 days' },
  { shopName: 'Ganesh Shoe Mart', owner: 'Ganesh Patil', city: 'Mumbai', amountDue: 'Rs 22,500', dueDate: '2026-04-19', issuedDate: '2026-03-18', invoice: 'INV-0232', status: 'Safe', progress: 45, daysLabel: 'Due in 18 days' },
];

export const notifications = [
  { title: 'Payment overdue - Om Footwear', description: 'SMS sent to Rahul Joshi for Rs 5,300 overdue by 5 days.', type: 'overdue', time: 'Today, 9:00 AM' },
  { title: 'Credit reminder - Shiv Shoe Store', description: 'Reminder sent 3 days before due date for invoice INV-0240.', type: 'credit', time: 'Today, 8:20 AM' },
  { title: 'Low stock alert - Sports Shoes', description: 'Stock level dropped to 8 pairs. Reorder trigger is active.', type: 'stock', time: 'Yesterday, 6:45 PM' },
  { title: 'Due date alert - Patel Footwear', description: 'WhatsApp reminder scheduled for a payment due in 6 days.', type: 'credit', time: 'Yesterday, 2:15 PM' },
];

export const notificationRules = ['7 days before due', '3 days before due', 'On due date', 'Overdue alerts', 'Low stock alerts'];

export const initialData = {
  stats,
  purchaseRecords,
  stockItems,
  retailShops,
  creditEntries,
  notifications,
  notificationRules,
};
