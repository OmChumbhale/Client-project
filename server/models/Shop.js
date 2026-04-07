import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema(
  {
    shopName: { type: String, required: true, unique: true, trim: true },
    owner: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true },
    creditLimit: { type: String, required: true, trim: true },
    status: { type: String, required: true, trim: true },
    since: { type: String, required: true, trim: true },
    address: { type: String, default: '' },
  },
  { timestamps: true },
);

export default mongoose.models.Shop || mongoose.model('Shop', shopSchema);
