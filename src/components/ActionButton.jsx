function ActionButton({ children, tone = 'primary', className = '', disabled = false, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition duration-200';
  const tones = {
    primary: 'bg-amber text-white hover:-translate-y-0.5 hover:bg-[#c06a08] hover:shadow-lg hover:shadow-amber/20',
    outline: 'border border-border bg-white text-ink hover:bg-warm',
    danger: 'border border-[#f5c6c2] bg-danger-light text-danger hover:bg-[#f9dfdc]',
  };

  return (
    <button
      type="button"
      disabled={disabled}
      className={`${base} ${tones[tone]} ${disabled ? 'cursor-not-allowed opacity-60' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default ActionButton;
