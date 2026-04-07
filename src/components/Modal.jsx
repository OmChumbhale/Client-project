import { X } from 'lucide-react';

function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/50 p-4" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-[32px] border border-border bg-white shadow-soft" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div className="font-heading text-2xl font-bold tracking-tight text-ink">{title}</div>
          <button type="button" onClick={onClose} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-warm text-ink transition hover:bg-border">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
        <div className="flex justify-end gap-3 px-6 pb-6">{footer}</div>
      </div>
    </div>
  );
}

export default Modal;
