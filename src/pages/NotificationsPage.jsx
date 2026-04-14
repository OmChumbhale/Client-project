import { BellPlus } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import ActionButton from '../components/ActionButton';
import AlertBanner from '../components/AlertBanner';
import NotificationItem from '../components/NotificationItem';
import { useAppContext } from '../context/AppContext';

function NotificationsPage() {
  const { data } = useAppContext();
  const { notificationRules, notifications } = data;

  return (
    <div>
      <SectionHeader title="Notifications" description="Keep overdue collections and stock reminders humming with a rule-based notification system." action={<ActionButton><BellPlus className="h-4 w-4" />Configure Rules</ActionButton>} />
      <AlertBanner tone="success">Auto-notifications are active. The system sent <span className="font-semibold">5 messages</span> in the last 24 hours.</AlertBanner>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">{notifications.map((notification) => <NotificationItem key={`${notification.title}-${notification.time}`} notification={notification} />)}</div>
        <aside className="card-shell rounded-[28px] p-6">
          <div className="font-heading text-xl font-bold tracking-tight">Notification Rules</div>
          <p className="mt-2 text-sm text-muted">Automations currently enabled for Archana Traders Nashik credit and stock monitoring.</p>
          <div className="mt-5 space-y-3">{notificationRules.map((rule) => <div key={rule} className="flex items-center justify-between rounded-2xl bg-warm/70 px-4 py-3"><span className="text-sm font-medium text-ink">{rule}</span><span className="h-2.5 w-2.5 rounded-full bg-green" /></div>)}</div>
        </aside>
      </div>
    </div>
  );
}

export default NotificationsPage;
