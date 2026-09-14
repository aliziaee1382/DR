import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import {
  Bell,
  User as UserIcon,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  LogIn,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: string, params?: any) => void;
  currentPage: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const { currentUser, currentRole, isLoggedIn, logout, notifications } = useApp();
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handlePanelNavigate = () => {
    setShowAccountDropdown(false);
    if (currentRole === 'patient') onNavigate('dashboard');
    else if (currentRole === 'doctor') onNavigate('doctor-dashboard');
    else onNavigate('admin-dashboard');
  };

  const handleLogoutClick = () => {
    setShowAccountDropdown(false);
    logout();
    onNavigate('home');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-teal-500/30 text-teal-200 px-2 py-0.5 rounded-full font-medium text-[11px]">
              <ShieldCheck className="w-3 h-3 text-teal-300" /> سامانه سلامت و مشاوره پزشکی
            </span>
            <span className="text-slate-300 hidden md:inline">
              پلتفرم مشاوره آنلاین پزشکی صوتی، تصویری و متنی
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-teal-100">
            {isLoggedIn ? (
              <span className="flex items-center gap-1 text-emerald-300 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                وارد شده به عنوان {currentRole === 'doctor' ? 'پزشک' : currentRole === 'admin' ? 'مدیر' : 'بیمار'} ({currentUser.name})
              </span>
            ) : (
              <button
                onClick={() => onNavigate('auth')}
                className="text-teal-200 hover:text-white font-medium underline underline-offset-2 cursor-pointer"
              >
                جهت ثبت‌نام یا ورود کلیک کنید
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Hamburger Button */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Hamburger Menu Button for Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
            aria-label="منوی سایت"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-slate-800" /> : <Menu className="w-6 h-6 text-slate-800" />}
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-right group cursor-pointer focus:outline-none"
          >
            <Logo size="md" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 mr-4">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'home'
                  ? 'text-teal-700 bg-teal-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              صفحه اصلی
            </button>
            <button
              onClick={() => onNavigate('search')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'search'
                  ? 'text-teal-700 bg-teal-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              جستجوی پزشکان
            </button>
            <button
              onClick={() => onNavigate('blog')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'blog'
                  ? 'text-teal-700 bg-teal-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              مجله سلامت
            </button>
            <button
              onClick={() => onNavigate('support')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'support'
                  ? 'text-teal-700 bg-teal-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              پشتیبانی و قوانین
            </button>
          </nav>
        </div>

        {/* Right Action Icons & Account Button */}
        <div className="flex items-center gap-3">
          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-teal-500 ring-2 ring-white"></span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">اعلان‌های اخیر</span>
                  <span className="text-[10px] text-teal-600 font-medium">علامت‌گذاری خوانده شده</span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2 bg-slate-50 rounded-xl text-xs text-slate-700 flex flex-col gap-1">
                      <span>{n.message}</span>
                      <span className="text-[10px] text-slate-400 text-left">{n.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Account Button (حساب کاربری / ورود و ثبت‌نام) */}
          <div className="relative">
            {isLoggedIn ? (
              <button
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-3.5 py-2 rounded-xl shadow-sm text-xs font-bold transition-all cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:inline">حساب کاربری ({currentUser.name})</span>
                <span className="sm:hidden">حساب کاربری</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>
            ) : (
              <button
                onClick={() => onNavigate('auth')}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl shadow-sm text-xs font-bold transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>ورود / ثبت‌نام</span>
              </button>
            )}

            {/* Account Dropdown Menu */}
            {isLoggedIn && showAccountDropdown && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-2.5 bg-slate-50 rounded-xl mb-2 flex items-center gap-3">
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-500/30"
                  />
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</h4>
                    <span className="text-[10px] text-teal-600 font-semibold block mt-0.5">
                      {currentRole === 'patient' && 'حساب بیمار'}
                      {currentRole === 'doctor' && 'حساب پزشک'}
                      {currentRole === 'admin' && 'مدیر ارشد سامانه'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={handlePanelNavigate}
                    className="w-full text-right px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-teal-50 hover:text-teal-700 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4 text-teal-600" />
                    <span>ورود به پنل کاربری</span>
                  </button>

                  <button
                    onClick={handleLogoutClick}
                    className="w-full text-right px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>خروج از حساب کاربری</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Links */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-4 py-3 space-y-1.5 shadow-xl animate-in slide-in-from-top-2">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-right px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              currentPage === 'home'
                ? 'text-teal-700 bg-teal-50'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            صفحه اصلی
          </button>
          <button
            onClick={() => {
              onNavigate('search');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-right px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              currentPage === 'search'
                ? 'text-teal-700 bg-teal-50'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            جستجوی پزشکان
          </button>
          <button
            onClick={() => {
              onNavigate('blog');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-right px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              currentPage === 'blog'
                ? 'text-teal-700 bg-teal-50'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            مجله سلامت
          </button>
          <button
            onClick={() => {
              onNavigate('support');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-right px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              currentPage === 'support'
                ? 'text-teal-700 bg-teal-50'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            پشتیبانی و قوانین
          </button>
        </div>
      )}
    </header>
  );
};
