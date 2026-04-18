import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { login, isAuthenticated, authLoading } = useAuth();
  const location = useLocation();
  const adminUsernameHint = import.meta.env.VITE_ADMIN_USERNAME || 'Jagdambatraders';
  const [form, setForm] = useState({ username: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    const destination = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={destination} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await login(form.username, form.password);
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream bg-dashboard-wash px-4 py-8 font-body text-ink">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[36px] border border-border bg-white shadow-soft">
        <section className="hidden flex-1 bg-ink px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
              <ShieldCheck className="h-4 w-4 text-amber-light" />
              Secure Admin Access
            </div>
            <h1 className="mt-8 font-heading text-5xl font-extrabold tracking-tight text-amber-light">Archana Traders Nashik</h1>
            <p className="mt-5 max-w-md text-base leading-7 text-white/70">
              Sign in to manage wholesale purchases, stock, customer credit, and live records stored in MongoDB Atlas.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.24em] text-white/35">Admin Portal</div>
            <div className="mt-3 font-heading text-2xl font-bold">Protected business dashboard</div>
            <p className="mt-3 text-sm leading-6 text-white/60">
              Only authenticated admins can open the dashboard and submit new purchases, stock updates, or credit entries.
            </p>
          </div>
        </section>

        <section className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-pale text-amber">
                <LockKeyhole className="h-6 w-6" />
              </div>
              <h2 className="mt-6 font-heading text-4xl font-bold tracking-tight text-ink">Admin Login</h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                Enter your admin credentials to open the Archana Traders Nashik dashboard.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off">
              <div>
                <label className="field-label" htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  className="field-input mt-2"
                  value={form.username}
                  onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
                  placeholder={adminUsernameHint}
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="field-label" htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  className="field-input mt-2"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  placeholder="traders123"
                  autoComplete="off"
                />
              </div>

              {error ? <div className="rounded-2xl border border-[#f5c6c2] bg-danger-light px-4 py-3 text-sm text-danger">{error}</div> : null}

              <button
                type="submit"
                disabled={submitting || authLoading}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-amber px-4 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#c06a08] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting || authLoading ? 'Signing In...' : 'Login to Dashboard'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LoginPage;
