import { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import ActionButton from '../components/ActionButton';
import AlertBanner from '../components/AlertBanner';
import Toolbar from '../components/Toolbar';
import StockCard from '../components/StockCard';
import { useAppContext } from '../context/AppContext';

function StockManagementPage() {
  const { openModal, data } = useAppContext();
  const { stockItems } = data;
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [stockLevel, setStockLevel] = useState('All Stock');

  const filteredItems = useMemo(() => stockItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All Categories' || item.category === category;
    const matchesLevel = stockLevel === 'All Stock' || item.status === stockLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  }), [category, search, stockLevel]);

  return (
    <div>
      <SectionHeader title="Stock Management" description="Monitor quantities, keep popular sizes moving, and catch low stock before it becomes a sales blocker." action={<ActionButton onClick={() => openModal('stock')}><Plus className="h-4 w-4" />Add Stock</ActionButton>} />
      <AlertBanner tone="danger"><span className="font-semibold">2 items</span> are critically low and need an immediate reorder.</AlertBanner>
      <Toolbar>
        <div className="relative min-w-0 flex-1 xl:max-w-sm"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" /><input className="field-input pl-11" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search stock..." /></div>
        <select className="field-input xl:w-56" value={category} onChange={(event) => setCategory(event.target.value)}><option>All Categories</option><option>Men's</option><option>Women's</option><option>Kids</option><option>Sports</option></select>
        <select className="field-input xl:w-56" value={stockLevel} onChange={(event) => setStockLevel(event.target.value)}><option>All Stock</option><option>Critical</option><option>Low</option><option>In Stock</option></select>
      </Toolbar>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filteredItems.map((item) => <StockCard key={item.sku} item={item} />)}</div>
    </div>
  );
}

export default StockManagementPage;
