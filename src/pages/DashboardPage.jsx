import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import ActionButton from '../components/ActionButton';
import AlertBanner from '../components/AlertBanner';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import { useAppContext } from '../context/AppContext';

function DashboardPage() {
  const { openModal, data, error } = useAppContext();
  const { purchaseRecords, stats, stockItems } = data;
  const purchaseColumns = [
    { key: 'shopName', header: 'Shop', render: (row) => <div><div className="font-semibold text-ink">{row.shopName}</div><div className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">{row.date}</div></div> },
    { key: 'amount', header: 'Amount' },
    { key: 'status', header: 'Status', render: (row) => <Badge status={row.status} /> },
  ];
  const lowStockColumns = [
    { key: 'name', header: 'Item', render: (row) => <span className="font-semibold">{row.name}</span> },
    { key: 'quantity', header: 'Qty', render: (row) => `${row.quantity} pairs` },
    { key: 'status', header: 'Status', render: (row) => <Badge status={row.status} /> },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="HELLO! JAGDAMBA TRADERS" description="Here's what is happening across your wholesale footwear business today." action={<ActionButton onClick={() => openModal('purchase')}><Plus className="h-4 w-4" />New Purchase</ActionButton>} />
      {error ? <AlertBanner tone="danger">Backend sync issue: {error}</AlertBanner> : null}
      <AlertBanner><span className="font-semibold">3 shops</span> have credit cycles ending in the next 7 days. <Link to="/credit" className="font-semibold underline">Review now</Link></AlertBanner>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => <StatCard key={stat.label} stat={stat} />)}</section>
      <section className="grid gap-6 xl:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between"><h2 className="font-heading text-xl font-bold tracking-tight">Recent Purchases</h2><Link to="/purchases" className="text-sm font-medium text-amber underline-offset-4 hover:underline">View all</Link></div>
          <DataTable columns={purchaseColumns} rows={purchaseRecords.slice(0, 4)} />
        </div>
        <div>
          <div className="mb-3 flex items-center justify-between"><h2 className="font-heading text-xl font-bold tracking-tight">Low Stock Alerts</h2><Link to="/stock" className="text-sm font-medium text-amber underline-offset-4 hover:underline">View stock</Link></div>
          <DataTable columns={lowStockColumns} rows={stockItems.filter((item) => item.status !== 'In Stock').slice(0, 4)} />
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
