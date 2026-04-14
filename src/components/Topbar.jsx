import { Bell, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import usePageTitle from '../hooks/usePageTitle';

function Topbar({ navigation }) {
  const { user, logout } = useAuth();
  const title = usePageTitle(navigation);
  const currentDate = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());
  const initials = user?.username?.slice(0, 2).toUpperCase() || 'AD';

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-white/85 backdrop-blur">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="pl-14 lg:pl-0">
          <div className="font-heading text-2xl font-bold tracking-tight text-ink">{title}</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden rounded-full bg-warm px-4 py-2 text-sm text-muted sm:block">{currentDate}</div>
          <Link to="/notifications" className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-amber-pale text-amber transition hover:-translate-y-0.5 hover:bg-[#f5dfa8]">
            <Bell className="h-5 w-5" />
            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full border-2 border-white bg-rust" />
          </Link>
          <button type="button" onClick={logout} className="hidden rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-muted transition hover:bg-warm sm:inline-flex sm:items-center sm:gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink font-heading text-sm font-bold text-amber-light">AF</div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
