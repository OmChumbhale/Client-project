import { ArrowUpRight, Box, Landmark, Store } from 'lucide-react';

const tones = {
  amber: 'before:bg-amber',
  green: 'before:bg-green',
  rust: 'before:bg-rust',
  ink: 'before:bg-ink',
};

const icons = {
  "Today's Sales": Landmark,
  'Total Stock Items': Box,
  'Outstanding Credit': ArrowUpRight,
  'Retail Shops': Store,
};

function StatCard({ stat }) {
  const Icon = icons[stat.label] ?? Box;
  return (
    <div className={`relative overflow-hidden rounded-[28px] border border-border bg-white p-6 shadow-soft before:absolute before:left-0 before:right-0 before:top-0 before:h-1 ${tones[stat.tone]}`}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">{stat.label}</div>
      <div className="mt-3 font-heading text-4xl font-bold tracking-tight text-ink">{stat.value}</div>
      <div className="mt-2 text-sm text-muted">{stat.subtext}</div>
      <Icon className="absolute right-5 top-5 h-7 w-7 text-ink/15" />
    </div>
  );
}

export default StatCard;
