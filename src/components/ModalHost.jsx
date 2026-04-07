import { useMemo, useState } from 'react';
import Modal from './Modal';
import ActionButton from './ActionButton';
import { useAppContext } from '../context/AppContext';

function getTodayDateInputValue() {
  const now = new Date();
  const timezoneOffsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - timezoneOffsetMs).toISOString().slice(0, 10);
}

const today = getTodayDateInputValue();
const createPurchaseItem = () => ({
  stockSku: '',
  quantity: '',
});

const modalConfigs = {
  purchase: {
    title: 'Add Purchase',
    submitLabel: 'Save record',
    fields: [
      { name: 'invoice', label: 'Invoice number', type: 'text', required: true },
      { name: 'shopName', label: 'Shop name', type: 'text', required: true },
      { name: 'amount', label: 'Amount', type: 'number', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true, defaultValue: today },
      { name: 'dueDate', label: 'Due date', type: 'date', required: false },
      { name: 'paymentStatus', label: 'Payment status', type: 'select', required: true, options: ['Paid', 'Credit', 'Overdue'] },
      { name: 'notes', label: 'Notes', type: 'textarea', required: false, full: true },
    ],
  },
  stock: {
    title: 'Add Stock',
    submitLabel: 'Add stock',
    fields: [
      { name: 'productName', label: 'Product name', type: 'text', required: true },
      { name: 'sku', label: 'SKU', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', required: true, options: ["Men's", "Women's", 'Kids', 'Sports'] },
      { name: 'size', label: 'Size', type: 'text', required: true },
      { name: 'quantity', label: 'Quantity', type: 'number', required: true },
      { name: 'date', label: 'Date added', type: 'date', required: true, defaultValue: today },
      { name: 'notes', label: 'Notes', type: 'textarea', required: false, full: true },
    ],
  },
  customer: {
    title: 'Add Customer',
    submitLabel: 'Add customer',
    fields: [
      { name: 'shopName', label: 'Shop name', type: 'text', required: true },
      { name: 'owner', label: 'Owner name', type: 'text', required: true },
      { name: 'city', label: 'City', type: 'text', required: true },
      { name: 'contact', label: 'Contact', type: 'tel', required: true },
      { name: 'creditLimit', label: 'Credit limit', type: 'number', required: true },
      { name: 'joinDate', label: 'Join date', type: 'date', required: true, defaultValue: today },
      { name: 'address', label: 'Address', type: 'textarea', required: false, full: true },
    ],
  },
};

function buildInitialValues(fields) {
  return fields.reduce((accumulator, field) => {
    accumulator[field.name] = field.defaultValue ?? '';
    return accumulator;
  }, {});
}

function PurchaseItemsField({ items, onChange, stockItems, errors }) {
  const stockOptions = useMemo(
    () => [...stockItems]
      .filter((item) => item.quantity > 0)
      .sort((left, right) => left.name.localeCompare(right.name)),
    [stockItems],
  );

  const updateItem = (index, key, value) => {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)));
  };

  const addItem = () => onChange([...items, createPurchaseItem()]);
  const removeItem = (index) => {
    if (items.length === 1) {
      onChange([createPurchaseItem()]);
      return;
    }

    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="md:col-span-2">
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="field-label">Items</label>
        <ActionButton tone="outline" className="px-3 py-2 text-xs" onClick={addItem}>
          Add item
        </ActionButton>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => {
          const selectedStock = stockItems.find((stockItem) => stockItem.sku === item.stockSku);

          return (
            <div key={`${index}-${item.stockSku}`} className="rounded-2xl border border-border bg-warm/40 p-3">
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_160px_auto] md:items-start">
                <div>
                  <select
                    value={item.stockSku}
                    onChange={(event) => updateItem(index, 'stockSku', event.target.value)}
                    className="field-input"
                  >
                    <option value="">Select item from stock</option>
                    {stockOptions.map((option) => (
                      <option key={option.sku} value={option.sku}>
                        {option.name} - Size {option.size} - {option.quantity} pairs available
                      </option>
                    ))}
                  </select>
                  {selectedStock ? <p className="mt-1 text-xs text-muted">Available stock: {selectedStock.quantity} pairs</p> : null}
                  {errors[`purchaseItems.${index}.stockSku`] ? <p className="mt-1 text-xs text-danger">{errors[`purchaseItems.${index}.stockSku`]}</p> : null}
                </div>
                <div>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) => updateItem(index, 'quantity', event.target.value)}
                    className="field-input"
                    placeholder="Quantity"
                  />
                  {errors[`purchaseItems.${index}.quantity`] ? <p className="mt-1 text-xs text-danger">{errors[`purchaseItems.${index}.quantity`]}</p> : null}
                </div>
                <ActionButton tone="outline" className="px-3 py-2 text-xs" onClick={() => removeItem(index)}>
                  Remove
                </ActionButton>
              </div>
            </div>
          );
        })}
      </div>
      {errors.purchaseItems ? <p className="mt-2 text-xs text-danger">{errors.purchaseItems}</p> : null}
    </div>
  );
}

function ModalForm({ config, onSubmit, retailShops, stockItems }) {
  const initialValues = useMemo(() => buildInitialValues(config.fields), [config.fields]);
  const [values, setValues] = useState(initialValues);
  const [purchaseItems, setPurchaseItems] = useState([createPurchaseItem()]);
  const [errors, setErrors] = useState({});
  const shopOptions = useMemo(
    () => retailShops.map((shop) => shop.shopName).sort((left, right) => left.localeCompare(right)),
    [retailShops],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    config.fields.forEach((field) => {
      if (field.required && !String(values[field.name]).trim()) {
        nextErrors[field.name] = `${field.label} is required.`;
      }
    });

    if (config.title === 'Add Purchase') {
      if (!purchaseItems.length) {
        nextErrors.purchaseItems = 'Add at least one item.';
      }

      const requestedBySku = new Map();

      purchaseItems.forEach((item, index) => {
        if (!String(item.stockSku).trim()) {
          nextErrors[`purchaseItems.${index}.stockSku`] = 'Item is required.';
        }

        const quantity = Number(item.quantity || 0);
        if (quantity <= 0) {
          nextErrors[`purchaseItems.${index}.quantity`] = 'Quantity must be greater than zero.';
          return;
        }

        const currentTotal = requestedBySku.get(item.stockSku) || 0;
        requestedBySku.set(item.stockSku, currentTotal + quantity);
      });

      purchaseItems.forEach((item, index) => {
        if (!item.stockSku) {
          return;
        }

        const selectedStock = stockItems.find((stockItem) => stockItem.sku === item.stockSku);
        const requested = requestedBySku.get(item.stockSku) || 0;

        if (!selectedStock) {
          nextErrors[`purchaseItems.${index}.stockSku`] = 'Selected item was not found.';
          return;
        }

        if (requested > selectedStock.quantity) {
          nextErrors[`purchaseItems.${index}.quantity`] = `Only ${selectedStock.quantity} pairs are available.`;
        }
      });
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      try {
        const payload = config.title === 'Add Purchase'
          ? {
              ...values,
              purchaseItems: purchaseItems.map((item) => ({
                stockSku: item.stockSku,
                quantity: Number(item.quantity || 0),
              })),
            }
          : values;

        await onSubmit(payload);
        setValues(initialValues);
        setPurchaseItems([createPurchaseItem()]);
      } catch (submitError) {
        setErrors((prev) => ({
          ...prev,
          form: submitError.message,
        }));
      }
    }
  };

  return (
    <form id={`${config.title}-form`} onSubmit={submit}>
      <div className="grid gap-4 md:grid-cols-2">
        {config.title === 'Add Purchase' ? (
          <PurchaseItemsField items={purchaseItems} onChange={setPurchaseItems} stockItems={stockItems} errors={errors} />
        ) : null}
        {config.fields.map((field) => (
          <div key={field.name} className={field.full ? 'md:col-span-2' : ''}>
            <label className="field-label">{field.label}</label>
            {field.name === 'shopName' && config.title === 'Add Purchase' ? (
              <select name={field.name} value={values[field.name]} onChange={handleChange} className="field-input mt-2">
                <option value="">Select shop name</option>
                {shopOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            ) : field.type === 'select' ? (
              <select name={field.name} value={values[field.name]} onChange={handleChange} className="field-input mt-2">
                <option value="">Select {field.label.toLowerCase()}</option>
                {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea name={field.name} value={values[field.name]} onChange={handleChange} className="field-input mt-2 min-h-24" placeholder={`Enter ${field.label.toLowerCase()}`} />
            ) : (
              <input name={field.name} type={field.type} min={field.min} value={values[field.name]} onChange={handleChange} className="field-input mt-2" placeholder={`Enter ${field.label.toLowerCase()}`} />
            )}
            {errors[field.name] ? <p className="mt-1 text-xs text-danger">{errors[field.name]}</p> : null}
          </div>
        ))}
      </div>
      {errors.form ? <p className="mt-4 text-sm text-danger">{errors.form}</p> : null}
    </form>
  );
}

function ModalHost() {
  const { modalState, closeModal, createPurchase, createStock, createCustomer, saving, data } = useAppContext();
  const { retailShops, stockItems } = data;

  const submitHandlers = {
    purchase: createPurchase,
    stock: createStock,
    customer: createCustomer,
  };

  return Object.entries(modalConfigs).map(([key, config]) => (
    <Modal
      key={key}
      open={modalState[key]}
      onClose={() => closeModal(key)}
      title={config.title}
      footer={
        <>
          <ActionButton tone="outline" onClick={() => closeModal(key)} disabled={saving}>
            Cancel
          </ActionButton>
          <ActionButton form={`${config.title}-form`} type="submit" disabled={saving}>
            {saving ? 'Saving...' : config.submitLabel}
          </ActionButton>
        </>
      }
    >
      <ModalForm config={config} onSubmit={submitHandlers[key]} retailShops={retailShops} stockItems={stockItems} />
    </Modal>
  ));
}

export default ModalHost;
