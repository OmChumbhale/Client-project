import { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import Toolbar from '../components/Toolbar';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import ActionButton from '../components/ActionButton';
import { useAppContext } from '../context/AppContext';

function RetailShopsPage() {
  const { openModal, data } = useAppContext();
  const { retailShops } = data;
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('All Cities');
  const [status, setStatus] = useState('All Status');

  const filteredRows = useMemo(() => retailShops.filter((shop) => {
    const matchesSearch = shop.shopName.toLowerCase().includes(search.toLowerCase()) || shop.city.toLowerCase().includes(search.toLowerCase());
    const matchesCity = city === 'All Cities' || shop.city === city;
    const matchesStatus = status === 'All Status' || shop.status === status;
    return matchesSearch && matchesCity && matchesStatus;
  }), [city, search, status]);

  const columns = [
    { key: 'shopName', header: 'Shop name', render: (row) => <div><div className="font-semibold">{row.shopName}</div><div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">Since {row.since}</div></div> },
    { key: 'owner', header: 'Owner' },
    { key: 'city', header: 'City' },
    { key: 'contact', header: 'Contact' },
    { key: 'creditLimit', header: 'Credit limit' },
    { key: 'status', header: 'Status', render: (row) => <Badge status={row.status} /> },
  ];

  return (
    <div>
      <SectionHeader title="Retail Shops" description="Manage your customer list, monitor credit capacity, and keep contact details in one place." action={<ActionButton onClick={() => openModal('customer')}><Plus className="h-4 w-4" />Add Customer</ActionButton>} />
      <Toolbar>
        <div className="relative min-w-0 flex-1 xl:max-w-sm"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" /><input className="field-input pl-11" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search shop name or city..." /></div>
        <select className="field-input xl:w-52" value={city} onChange={(event) => setCity(event.target.value)}><option>All Cities</option><option>Nashik</option><option>Pune</option><option>Mumbai</option><option>Aurangabad</option></select>
        <select className="field-input xl:w-52" value={status} onChange={(event) => setStatus(event.target.value)}><option>All Status</option><option>Active</option><option>On Hold</option></select>
      </Toolbar>
      <DataTable columns={columns} rows={filteredRows} />
    </div>
  );
}

export default RetailShopsPage;
