import { MessageSquareText, Phone } from 'lucide-react';
import Badge from './Badge';
import ActionButton from './ActionButton';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

function normalizePhoneNumber(contact) {
  const digits = String(contact || '').replace(/\D/g, '');

  if (digits.length === 10) {
    return `91${digits}`;
  }

  return digits;
}

function createReminderMessage(entry) {
  return `Hello ${entry.owner || entry.shopName}, this is a payment reminder from Archana Traders Nashik for invoice ${entry.invoice}. Amount due: ${entry.amountDue}. Due date: ${entry.dueDate}. Please arrange payment at the earliest.`;
}

function CreditCard({ entry }) {
  const { markCreditAsPaid, saving } = useAppContext();
  const [error, setError] = useState('');
  const statusBorder = entry.status === 'Overdue' ? 'border-l-rust' : entry.status === 'Due soon' ? 'border-l-amber' : 'border-l-green';
  const progressColor = entry.status === 'Overdue' ? 'bg-rust' : entry.status === 'Due soon' ? 'bg-amber' : 'bg-green';
  const amountColor = entry.status === 'Safe' ? 'text-green' : 'text-rust';
  const phoneNumber = normalizePhoneNumber(entry.contact);
  const whatsappLink = phoneNumber ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(createReminderMessage(entry))}` : '';
  const phoneLink = phoneNumber ? `tel:+${phoneNumber}` : '';

  const handleMarkPaid = async () => {
    setError('');

    try {
      await markCreditAsPaid(entry.invoice);
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  return (
    <article className={`card-shell relative border-l-4 ${statusBorder} p-5`}>
      <div className="absolute right-5 top-5">
        <Badge status={entry.status}>{entry.daysLabel}</Badge>
      </div>
      <h3 className="pr-28 font-heading text-xl font-bold tracking-tight">{entry.shopName}</h3>
      <p className="mt-1 text-sm text-muted">{entry.owner} | {entry.city}</p>
      <div className="mt-5">
        <div className={`font-heading text-3xl font-extrabold tracking-tight ${amountColor}`}>{entry.amountDue}</div>
        <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">Invoice {entry.invoice}</div>
      </div>
      <div className="mt-5 flex justify-between gap-4 text-xs uppercase tracking-[0.18em] text-muted">
        <span>Issued: {entry.issuedDate}</span>
        <span>Due: {entry.dueDate}</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-warm">
        <div className={`h-full rounded-full ${progressColor}`} style={{ width: `${entry.progress}%` }} />
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {phoneLink ? (
          <a href={phoneLink} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-white px-3 py-2 text-xs font-medium text-ink transition duration-200 hover:bg-warm">
            <Phone className="h-4 w-4" />
            Call
          </a>
        ) : (
          <ActionButton tone="outline" className="px-3 py-2 text-xs" disabled>
            <Phone className="h-4 w-4" />
            Call
          </ActionButton>
        )}
        {whatsappLink ? (
          <a href={whatsappLink} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-white px-3 py-2 text-xs font-medium text-ink transition duration-200 hover:bg-warm">
            <MessageSquareText className="h-4 w-4" />
            Send reminder
          </a>
        ) : (
          <ActionButton tone="outline" className="px-3 py-2 text-xs" disabled>
            <MessageSquareText className="h-4 w-4" />
            Send reminder
          </ActionButton>
        )}
        <ActionButton className="ml-auto px-3 py-2 text-xs" onClick={handleMarkPaid} disabled={saving}>
          {saving ? 'Updating...' : 'Mark paid'}
        </ActionButton>
      </div>
      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
    </article>
  );
}

export default CreditCard;
