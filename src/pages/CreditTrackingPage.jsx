import { Plus } from 'lucide-react';
import { useMemo } from 'react';
import SectionHeader from '../components/SectionHeader';
import AlertBanner from '../components/AlertBanner';
import ActionButton from '../components/ActionButton';
import CreditCard from '../components/CreditCard';
import { useAppContext } from '../context/AppContext';

function CreditTrackingPage() {
  const { openModal, data } = useAppContext();
  const { creditEntries, retailShops } = data;
  const creditEntriesWithContacts = useMemo(() => {
    const contactByShop = new Map(retailShops.map((shop) => [shop.shopName, shop.contact || '']));
    return creditEntries.map((entry) => ({
      ...entry,
      contact: entry.contact || contactByShop.get(entry.shopName) || '',
    }));
  }, [creditEntries, retailShops]);

  return (
    <div>
      <SectionHeader title="Credit Tracking" description="Stay ahead of payment deadlines with a clean view of overdue, at-risk, and healthy accounts." action={<ActionButton onClick={() => openModal('purchase')}><Plus className="h-4 w-4" />Record Payment</ActionButton>} />
      <AlertBanner tone="danger"><span className="font-semibold">Om Footwear</span> is overdue by 5 days and already triggered an automatic reminder.</AlertBanner>
      <AlertBanner><span className="font-semibold">3 shops</span> have payments due in the next 7 days.</AlertBanner>
      <div className="grid gap-5 xl:grid-cols-2">{creditEntriesWithContacts.map((entry) => <CreditCard key={entry.invoice} entry={entry} />)}</div>
    </div>
  );
}

export default CreditTrackingPage;
