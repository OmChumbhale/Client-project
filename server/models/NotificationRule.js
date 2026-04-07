import mongoose from 'mongoose';

const notificationRuleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.NotificationRule || mongoose.model('NotificationRule', notificationRuleSchema);
