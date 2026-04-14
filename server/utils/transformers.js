export function parseCurrency(value) {
  return Number(String(value).replace(/[^\d.]/g, '')) || 0;
}

export function formatCurrency(amount) {
  return `Rs ${new Intl.NumberFormat('en-IN').format(amount)}`;
}

function getDatePartsInIndia(dateLike) {
  const date = new Date(dateLike);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const parts = formatter.formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    year: values.year,
    month: values.month,
    day: values.day,
  };
}

function formatDateKey(dateLike) {
  const parts = getDatePartsInIndia(dateLike);

  if (!parts) {
    return '';
  }

  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function computeStockStatus(quantity, minStock = 40) {
  if (quantity < 15) {
    return 'Critical';
  }

  if (quantity < minStock) {
    return 'Low';
  }

  return 'In Stock';
}

export function createCreditMeta({ status, dueDate }) {
  if (status === 'Overdue') {
    return { progress: 100, daysLabel: 'Overdue', status: 'Overdue' };
  }

  if (status === 'Credit') {
    if (!dueDate) {
      return { progress: 60, daysLabel: 'Due soon', status: 'Due soon' };
    }

    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { progress: 100, daysLabel: `Overdue ${Math.abs(diffDays)} days`, status: 'Overdue' };
    }

    if (diffDays <= 7) {
      return { progress: 85, daysLabel: `Due in ${diffDays} days`, status: 'Due soon' };
    }

    return { progress: 45, daysLabel: `Due in ${diffDays} days`, status: 'Safe' };
  }

  return { progress: 0, daysLabel: 'Safe', status: 'Safe' };
}

export function computeStats({ purchaseRecords, stockItems, retailShops }) {
  const todayKey = formatDateKey(new Date());
  const todaysSales = purchaseRecords
    .filter((record) => formatDateKey(record.date) === todayKey)
    .reduce((sum, record) => sum + parseCurrency(record.amount), 0);

  const totalStockItems = stockItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const outstandingCredit = purchaseRecords
    .filter((record) => record.status !== 'Paid')
    .reduce((sum, record) => sum + parseCurrency(record.amount), 0);

  return [
    {
      label: "Today's Sales",
      value: formatCurrency(todaysSales),
      subtext: 'Live total for today',
      tone: 'amber',
    },
    {
      label: 'Total Stock Items',
      value: new Intl.NumberFormat('en-IN').format(totalStockItems),
      subtext: 'Across active inventory',
      tone: 'green',
    },
    {
      label: 'Outstanding Credit',
      value: formatCurrency(outstandingCredit),
      subtext: 'Across unpaid purchases',
      tone: 'rust',
    },
    {
      label: 'Retail Shops',
      value: String(retailShops.length),
      subtext: 'Registered wholesale customers',
      tone: 'ink',
    },
  ];
}
