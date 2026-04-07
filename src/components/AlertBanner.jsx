function AlertBanner({ tone = 'warning', children }) {
  const tones = {
    warning: 'border-[#f5d990] bg-[#fff8ec] text-[#7a5200]',
    danger: 'border-[#f5c6c2] bg-danger-light text-danger',
    success: 'border-[#b0d8c4] bg-green-light text-green',
  };

  return <div className={`mb-5 rounded-2xl border px-4 py-3 text-sm ${tones[tone]}`}>{children}</div>;
}

export default AlertBanner;
