import { AlertTriangle, BellRing, Boxes } from 'lucide-react';

const styles = {
  overdue: { icon: AlertTriangle, className: 'bg-danger-light text-danger' },
  credit: { icon: BellRing, className: 'bg-amber-pale text-amber' },
  stock: { icon: Boxes, className: 'bg-green-light text-green' },
};

function NotificationItem({ notification }) {
  const style = styles[notification.type];
  const Icon = style.icon;

  return (
    <div className="flex items-start gap-4 rounded-[28px] border border-border bg-white p-5 shadow-soft transition hover:-translate-y-0.5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${style.className}`}><Icon className="h-5 w-5" /></div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-ink">{notification.title}</div>
        <div className="mt-1 text-sm text-muted">{notification.description}</div>
      </div>
      <div className="whitespace-nowrap text-xs uppercase tracking-[0.18em] text-muted">{notification.time}</div>
    </div>
  );
}

export default NotificationItem;
