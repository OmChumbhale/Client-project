import Badge from './Badge';

function StockCard({ item }) {
  const progress = Math.min(Math.round((item.quantity / item.minStock) * 100), 100);
  const progressColor = item.status === 'Critical' ? 'bg-rust' : item.status === 'Low' ? 'bg-amber' : 'bg-green';
  const quantityColor = item.status === 'Critical' ? 'text-rust' : item.status === 'Low' ? 'text-amber' : 'text-green';

  return (
    <article className="card-shell rounded-[28px] p-5 transition hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-lg font-bold tracking-tight">{item.name}</h3>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">SKU {item.sku} · Size {item.size}</p>
        </div>
        <div className="text-right">
          <div className={`font-heading text-4xl font-extrabold tracking-tight ${quantityColor}`}>{item.quantity}</div>
          <div className="text-xs uppercase tracking-[0.18em] text-muted">pairs</div>
        </div>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-warm"><div className={`h-full rounded-full ${progressColor}`} style={{ width: `${progress}%` }} /></div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm text-muted">
        <span>Min: {item.minStock} pairs</span>
        <Badge status={item.status} />
      </div>
    </article>
  );
}

export default StockCard;
