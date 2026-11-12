import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';
import { useState } from 'react';

const PublicLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <GraduationCap size={22} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Campus<span className="text-blue-600">HUB</span></span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors">Beranda</Link>
              <Link to="/calendar" className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors">Kalender</Link>
              <Link to="/organizations" className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors">Organisasi</Link>
              <Link to="/login" className="btn-secondary text-sm">Masuk</Link>
              <Link to="/register" className="btn-primary text-sm">Daftar</Link>
            </div>

            {/* Mobile toggle */}
            <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
            <Link to="/" className="block text-sm text-gray-700 py-2" onClick={() => setMobileOpen(false)}>Beranda</Link>
            <Link to="/calendar" className="block text-sm text-gray-700 py-2" onClick={() => setMobileOpen(false)}>Kalender</Link>
            <Link to="/organizations" className="block text-sm text-gray-700 py-2" onClick={() => setMobileOpen(false)}>Organisasi</Link>
            <div className="flex gap-3 pt-2">
              <Link to="/login" className="btn-secondary text-sm flex-1 text-center" onClick={() => setMobileOpen(false)}>Masuk</Link>
              <Link to="/register" className="btn-primary text-sm flex-1 text-center" onClick={() => setMobileOpen(false)}>Daftar</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <GraduationCap size={20} className="text-white" />
                </div>
                <span className="text-lg font-bold text-white">Campus<span className="text-blue-400">HUB</span></span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                Platform manajemen kegiatan kampus terintegrasi. Satu platform untuk semua aktivitas kampus Anda.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/calendar" className="hover:text-white transition-colors">Kalender Kampus</Link></li>
                <li><Link to="/organizations" className="hover:text-white transition-colors">Direktori Organisasi</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Daftar Mahasiswa</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Kegiatan</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-400"></span>UKM</span></li>
                <li><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-400"></span>LAB</span></li>
                <li><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-400"></span>Event</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
            © 2024 CampusHUB. Demo Application — Built with React + Vite
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;

