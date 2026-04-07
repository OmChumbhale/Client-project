import { NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useState } from 'react';

function Sidebar({ navigation }) {
  const [open, setOpen] = useState(false);
  const navClass = ({ isActive }) => `group flex items-center gap-3 rounded-r-2xl border-l-4 px-5 py-3 text-sm transition ${isActive ? 'border-amber-light bg-amber/15 text-amber-light' : 'border-transparent text-white/60 hover:bg-white/5 hover:text-white'}`;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="fixed left-4 top-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-white text-ink shadow-soft lg:hidden">
        <Menu className="h-5 w-5" />
      </button>
      <div className={`fixed inset-0 z-40 bg-ink/40 transition lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`} onClick={() => setOpen(false)} />
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-ink text-white transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col">
          <div className="border-b border-white/10 px-6 pb-5 pt-7">
            <div className="font-heading text-2xl font-extrabold tracking-tight text-amber-light">Jagdamba Traders</div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.24em] text-white/40">Nashik</div>
          </div>
          <nav className="flex-1 overflow-y-auto py-4">
            {navigation.map((group) => (
              <div key={group.section} className="mb-4">
                <div className="px-6 pb-2 text-[10px] font-medium uppercase tracking-[0.26em] text-white/30">{group.section}</div>
                <div className="space-y-1 pr-4">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink key={item.path} to={item.path} className={navClass} onClick={() => setOpen(false)}>
                        <Icon className="h-[18px] w-[18px]" />
                        <span>{item.label}</span>
                        {item.badge ? <span className="ml-auto rounded-full bg-rust px-2 py-0.5 text-[10px] font-semibold text-white">{item.badge}</span> : null}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
          <div className="border-t border-white/10 px-6 py-5 text-xs leading-5 text-white/40">Jagdamba Traders<br />Nashik</div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
