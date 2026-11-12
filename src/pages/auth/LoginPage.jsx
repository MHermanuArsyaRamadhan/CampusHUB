import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, AlertCircle, ChevronDown, ChevronUp, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { validateEmail } from '../../utils/validation';

const DEMO_ACCOUNTS = [
  { role: 'Super Admin', email: 'admin@campushub.test', password: 'admin123' },
  { role: 'UKM Admin (Basket)', email: 'ukm@campushub.test', password: 'demo123' },
  { role: 'LAB Admin (Multimedia)', email: 'lab@campushub.test', password: 'demo123' },
  { role: 'Event Admin (Festival)', email: 'event@campushub.test', password: 'demo123' },
  { role: 'Mahasiswa', email: 'student@campushub.test', password: 'demo123' },
];

const LoginPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  if (user) {
    const paths = { SUPER_ADMIN: '/admin', UKM_ADMIN: '/ukm', LAB_ADMIN: '/lab', EVENT_ADMIN: '/event', STUDENT: '/student' };
    navigate(paths[user.role] || '/', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(form.email)) {
      setError('Format email tidak valid.');
      return;
    }
    if (!form.password) {
      setError('Password wajib diisi.');
      return;
    }
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (!result.success) {
      setError(result.error);
    } else {
      const paths = { SUPER_ADMIN: '/admin', UKM_ADMIN: '/ukm', LAB_ADMIN: '/lab', EVENT_ADMIN: '/event', STUDENT: '/student' };
      navigate(from || paths[result.user.role] || '/', { replace: true });
    }
  };

  const fillDemo = (email, password) => {
    setForm({ email, password });
    setDemoOpen(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 text-white">
            <div className="bg-blue-500 p-2 rounded-xl">
              <GraduationCap size={26} />
            </div>
            <span className="text-2xl font-bold">Campus<span className="text-blue-300">HUB</span></span>
          </Link>
          <p className="text-blue-200 text-sm mt-3">Masuk ke platform manajemen kampus</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Masuk ke Akun</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 mb-4">
              <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="nama@email.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-2.5"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn size={18} />
                  Masuk
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Belum punya akun?{' '}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">Daftar sebagai Mahasiswa</Link>
          </p>

          {/* Demo Accounts */}
          <div className="mt-6 border-t border-gray-100 pt-5">
            <button
              onClick={() => setDemoOpen(!demoOpen)}
              className="w-full flex items-center justify-between text-sm text-gray-500 hover:text-gray-700 font-medium"
            >
              <span>🔑 Akun Demo Tersedia</span>
              {demoOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {demoOpen && (
              <div className="mt-3 space-y-2 animate-fadeIn">
                <p className="text-xs text-gray-400 mb-2">Klik untuk mengisi formulir:</p>
                {DEMO_ACCOUNTS.map(acc => (
                  <button
                    key={acc.email}
                    onClick={() => fillDemo(acc.email, acc.password)}
                    className="w-full text-left bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-lg px-3 py-2.5 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-700">{acc.role}</span>
                      <span className="text-xs text-gray-400">Klik untuk isi</span>
                    </div>
                    <div className="text-xs text-blue-600 mt-0.5">{acc.email}</div>
                    <div className="text-xs text-gray-400">Password: {acc.password}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-blue-300 mt-6">
          <Link to="/" className="hover:text-white">← Kembali ke Beranda</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

