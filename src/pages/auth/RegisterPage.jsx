import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validatePassword } from '../../utils/validation';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', nim: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Nama lengkap wajib diisi.';
    if (!validateEmail(form.email)) errs.email = 'Format email tidak valid.';
    if (!form.nim.trim()) errs.nim = 'NIM wajib diisi untuk akun mahasiswa.';
    else if (form.nim.trim().length < 5) errs.nim = 'NIM minimal 5 karakter.';
    if (!validatePassword(form.password)) errs.password = 'Password minimal 6 karakter.';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Konfirmasi password tidak cocok.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    const result = await register({
      name: form.name.trim(),
      email: form.email.trim(),
      nim: form.nim.trim(),
      password: form.password,
    });
    setLoading(false);
    if (!result.success) {
      if (result.error.includes('Email')) setErrors({ email: result.error });
      else if (result.error.includes('NIM')) setErrors({ nim: result.error });
      else setErrors({ general: result.error });
    } else {
      navigate('/student');
    }
  };

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: '' }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 text-white">
            <div className="bg-blue-500 p-2 rounded-xl">
              <GraduationCap size={26} />
            </div>
            <span className="text-2xl font-bold">Campus<span className="text-blue-300">HUB</span></span>
          </Link>
          <p className="text-blue-200 text-sm mt-3">Daftar sebagai Mahasiswa</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Buat Akun Mahasiswa</h2>
          <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg p-3 mb-5">
            <Info size={15} className="text-blue-500 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-700">Registrasi publik hanya untuk akun Mahasiswa. Akun organisasi dibuat oleh Super Admin.</p>
          </div>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 mb-4">
              <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Nama Lengkap</label>
              <input
                type="text"
                className={`input-field ${errors.name ? 'border-red-400 ring-red-300' : ''}`}
                placeholder="Masukkan nama lengkap Anda"
                value={form.name}
                onChange={handleChange('name')}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="label">NIM (Nomor Induk Mahasiswa)</label>
              <input
                type="text"
                className={`input-field ${errors.nim ? 'border-red-400' : ''}`}
                placeholder="Contoh: 20210001"
                value={form.nim}
                onChange={handleChange('nim')}
              />
              {errors.nim && <p className="text-xs text-red-500 mt-1">{errors.nim}</p>}
            </div>

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className={`input-field ${errors.email ? 'border-red-400' : ''}`}
                placeholder="nama@email.com"
                value={form.email}
                onChange={handleChange('email')}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className={`input-field pr-10 ${errors.password ? 'border-red-400' : ''}`}
                  placeholder="Minimal 6 karakter"
                  value={form.password}
                  onChange={handleChange('password')}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="label">Konfirmasi Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className={`input-field pr-10 ${errors.confirmPassword ? 'border-red-400' : ''}`}
                  placeholder="Ulangi password"
                  value={form.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            <div className="flex items-start gap-2 text-xs text-gray-500">
              <Info size={13} className="mt-0.5 shrink-0" />
              <span>Verifikasi email adalah simulasi. Tidak ada email nyata yang dikirimkan dalam demo ini.</span>
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
                  <CheckCircle2 size={18} />
                  Daftar Sekarang
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">Masuk di sini</Link>
          </p>
        </div>

        <p className="text-center text-xs text-blue-300 mt-6">
          <Link to="/" className="hover:text-white">← Kembali ke Beranda</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

