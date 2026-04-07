import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema(
  {
    invoice: { type: String, required: true, unique: true, trim: true },
    shopName: { type: String, required: true, trim: true },
    owner: { type: String, default: '' },
    city: { type: String, default: '' },
    items: { type: String, required: true, trim: true },
    amount: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    dueDate: { type: String, default: '' },
    status: { type: String, required: true, enum: ['Paid', 'Credit', 'Overdue'] },
    statusDetail: { type: String, required: true, trim: true },
    contact: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true },
);

export default mongoose.models.Purchase || mongoose.model('Purchase', purchaseSchema);
