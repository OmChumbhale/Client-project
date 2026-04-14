import { useMemo, useState } from 'react';
import { Download, Plus, Search } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import Toolbar from '../components/Toolbar';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import ActionButton from '../components/ActionButton';
import { useAppContext } from '../context/AppContext';

function PurchaseRecordsPage() {
  const { openModal, data } = useAppContext();
  const { purchaseRecords } = data;
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All Status');
  const [dateRange, setDateRange] = useState('All Dates');

  const filteredRows = useMemo(() => purchaseRecords.filter((record) => {
    const matchesSearch = record.shopName.toLowerCase().includes(search.toLowerCase()) || record.invoice.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === 'All Status' || record.status === status;
    const matchesDate = dateRange === 'All Dates' || (dateRange === 'This Week' && record.date >= '2026-03-25') || (dateRange === 'This Month' && record.date.startsWith('2026-03')) || (dateRange === 'Today' && record.date === '2026-04-01');
    return matchesSearch && matchesStatus && matchesDate;
  }), [dateRange, search, status]);

  const columns = [
    { key: 'invoice', header: 'Invoice number', render: (row) => <span className="font-semibold">#{row.invoice}</span> },
    { key: 'shopName', header: 'Shop name' },
    { key: 'items', header: 'Items' },
    { key: 'amount', header: 'Amount', render: (row) => <span className="font-semibold">{row.amount}</span> },
    { key: 'date', header: 'Date' },
    { key: 'statusDetail', header: 'Payment status', render: (row) => <Badge status={row.status}>{row.statusDetail}</Badge> },
    { key: 'action', header: 'Action', render: () => <ActionButton tone="outline" className="px-3 py-2 text-xs">View</ActionButton> },
  ];

  return (
    <div>
      <SectionHeader title="Purchase Records" description="Track invoice activity, payment states, and day-to-day purchasing trends." action={<ActionButton onClick={() => openModal('purchase')}><Plus className="h-4 w-4" />Add Purchase</ActionButton>} />
      <Toolbar>
        <div className="relative min-w-0 flex-1 xl:max-w-sm"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" /><input className="field-input pl-11" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by shop or invoice..." /></div>
        <select className="field-input xl:w-52" value={status} onChange={(event) => setStatus(event.target.value)}><option>All Status</option><option>Paid</option><option>Credit</option><option>Overdue</option></select>
        <select className="field-input xl:w-52" value={dateRange} onChange={(event) => setDateRange(event.target.value)}><option>All Dates</option><option>Today</option><option>This Week</option><option>This Month</option></select>
       
      </Toolbar>
      <DataTable columns={columns} rows={filteredRows} />
    </div>
  );
}

export default PurchaseRecordsPage;
