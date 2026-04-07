import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
