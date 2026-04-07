import mongoose from 'mongoose';

const creditEntrySchema = new mongoose.Schema(
  {
    shopName: { type: String, required: true, trim: true },
    owner: { type: String, default: '' },
    city: { type: String, default: '' },
    contact: { type: String, default: '' },
    amountDue: { type: String, required: true, trim: true },
    dueDate: { type: String, required: true },
    issuedDate: { type: String, required: true },
    invoice: { type: String, required: true, trim: true },
    status: { type: String, required: true, trim: true },
    progress: { type: Number, required: true, default: 0 },
    daysLabel: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export default mongoose.models.CreditEntry || mongoose.model('CreditEntry', creditEntrySchema);
