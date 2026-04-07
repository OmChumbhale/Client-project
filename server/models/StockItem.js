import mongoose from 'mongoose';

const stockItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, trim: true },
    size: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true },
    minStock: { type: Number, required: true, default: 40 },
    status: { type: String, required: true, trim: true },
    notes: { type: String, default: '' },
  },
  { timestamps: true },
);

export default mongoose.models.StockItem || mongoose.model('StockItem', stockItemSchema);
