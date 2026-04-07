const toneClasses = {
  green: 'bg-green-light text-green',
  amber: 'bg-amber-pale text-amber',
  rust: 'bg-danger-light text-danger',
  ink: 'bg-warm text-muted',
};

const statusTone = {
  Paid: 'green',
  Active: 'green',
  Safe: 'green',
  Credit: 'amber',
  'Due soon': 'amber',
  Low: 'amber',
  'On Hold': 'amber',
  Overdue: 'rust',
  Critical: 'rust',
  Inactive: 'ink',
  'In Stock': 'green',
};

function Badge({ children, tone, status }) {
  const resolvedTone = tone ?? statusTone[status] ?? 'ink';
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.16em] ${toneClasses[resolvedTone]}`}>{children ?? status}</span>;
}

export default Badge;
