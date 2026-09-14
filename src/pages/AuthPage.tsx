import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';
import { User, Phone, Lock, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, Info } from 'lucide-react';

interface AuthPageProps {
  onNavigate: (page: string, params?: any) => void;
  initialTab?: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ onNavigate, initialTab = 'login' }) => {
  const { login, register } = useApp();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);

  // Form inputs
  const [loginIdentity, setLoginIdentity] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerName, setRegisterName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginIdentity.trim()) {
      setErrorMsg('لطفاً شماره موبایل یا نام کاربری را وارد کنید.');
      return;
    }

    const res = login(loginIdentity.trim(), loginPassword.trim());
    if (res.success) {
      if (res.role === 'doctor') {
        onNavigate('doctor-dashboard');
      } else if (res.role === 'admin') {
        onNavigate('admin-dashboard');
      } else {
        onNavigate('dashboard');
      }
    } else {
      setErrorMsg(res.message || 'خطا در ورود به حساب کاربری.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!registerName.trim()) {
      setErrorMsg('لطفاً نام و نام خانوادگی خود را وارد کنید.');
      return;
    }
    if (!registerPhone.trim()) {
      setErrorMsg('لطفاً شماره موبایل خود را وارد کنید.');
      return;
    }

    const res = register(registerName.trim(), registerPhone.trim());
    if (res.success) {
      onNavigate('dashboard');
    } else {
      setErrorMsg(res.message || 'خطا در ثبت نام.');
    }
  };

  const fillDoctorDemo = () => {
    setLoginIdentity('doctor');
    setLoginPassword('doctor');
    setActiveTab('login');
  };

  const fillPatientDemo = () => {
    setLoginIdentity('patient');
    setLoginPassword('patient');
    setActiveTab('login');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header Branding */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-slate-900 text-white p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl" />
          <button
            onClick={() => onNavigate('home')}
            className="absolute top-4 left-4 text-slate-300 hover:text-white p-2 rounded-xl transition-colors cursor-pointer"
            title="بازگشت به خانه"
          >
            <ArrowRight className="w-5 h-5 transform rotate-180" />
          </button>

          <div className="flex justify-center mb-3">
            <Logo size="lg" />
          </div>
          <p className="text-xs text-teal-100 font-medium">سامانه هوشمند مشاوره آنلاین پزشکی و سلامت</p>
        </div>

        {/* Auth Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          <button
            onClick={() => {
              setActiveTab('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-3.5 text-xs font-bold text-center transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white text-teal-700 border-b-2 border-teal-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            ورود به حساب کاربری
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-3.5 text-xs font-bold text-center transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-white text-teal-700 border-b-2 border-teal-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            ثبت‌نام بیمار جدید
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  شماره موبایل یا نام کاربری
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                  <input
                    type="text"
                    value={loginIdentity}
                    onChange={(e) => setLoginIdentity(e.target.value)}
                    placeholder="مثلاً: 09121112233 یا doctor"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pr-10 pl-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition-all dir-ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رمز عبور / کد تأیید
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="رمز عبور حساب"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pr-10 pl-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition-all dir-ltr"
                  />
                </div>
              </div>

              {/* Demo Helper Box - Doctor and Patient test accounts */}
              <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl text-xs text-amber-900 space-y-2.5">
                <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
                  <span className="font-bold flex items-center gap-1 text-amber-950 text-xs">
                    <Info className="w-4 h-4 text-amber-600 shrink-0" />
                    راهنمای ورود حساب‌های تستی سامانه:
                  </span>
                </div>

                {/* Patient Demo (Ali Ziaei) */}
                <div className="space-y-1 bg-amber-100/70 p-2.5 rounded-xl border border-amber-200/60">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-teal-900 text-[11px]">حساب تستی بیمار (علی ضیائی):</span>
                    <button
                      type="button"
                      onClick={fillPatientDemo}
                      className="text-[10px] font-bold text-teal-700 hover:text-teal-900 bg-white/80 hover:bg-white px-2 py-0.5 rounded-md shadow-2xs border border-teal-200/80 cursor-pointer transition-all"
                    >
                      جایگذاری بیمار
                    </button>
                  </div>
                  <div className="bg-white/90 p-1.5 rounded-lg text-[10px] font-mono text-slate-800 flex items-center justify-between dir-ltr">
                    <span>نام کاربری: patient</span>
                    <span>رمز عبور: patient</span>
                  </div>
                </div>

                {/* Doctor Demo (Dr. Maryam Rezaei) */}
                <div className="space-y-1 bg-amber-100/70 p-2.5 rounded-xl border border-amber-200/60">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-teal-900 text-[11px]">حساب تستی پزشک (دکتر مریم رضایی):</span>
                    <button
                      type="button"
                      onClick={fillDoctorDemo}
                      className="text-[10px] font-bold text-teal-700 hover:text-teal-900 bg-white/80 hover:bg-white px-2 py-0.5 rounded-md shadow-2xs border border-teal-200/80 cursor-pointer transition-all"
                    >
                      جایگذاری پزشک
                    </button>
                  </div>
                  <div className="bg-white/90 p-1.5 rounded-lg text-[10px] font-mono text-slate-800 flex items-center justify-between dir-ltr">
                    <span>نام کاربری: doctor</span>
                    <span>رمز عبور: doctor</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-2xl text-xs shadow-md shadow-teal-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>ورود به حساب کاربری</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-xs text-slate-600 hover:text-teal-700 font-medium cursor-pointer"
                >
                  حساب کاربری ندارید؟ <span className="font-bold text-teal-600">ثبت‌نام کنید</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  نام و نام خانوادگی
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                  <input
                    type="text"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    placeholder="مثال: علی رضایی"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pr-10 pl-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  شماره موبایل / تماس
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                  <input
                    type="tel"
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(e.target.value)}
                    placeholder="09123456789"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pr-10 pl-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition-all dir-ltr"
                  />
                </div>
              </div>

              <div className="p-3 bg-teal-50/70 border border-teal-100 rounded-2xl text-[11px] text-teal-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  کلیه ثبت‌نام‌های جدید به‌صورت پیش‌فرض به عنوان <strong>حساب بیمار</strong> فعال می‌شوند و امکان رزرو و مشاوره فوری را خواهند داشت.
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-2xl text-xs shadow-md shadow-teal-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>تکمیل ثبت‌نام و ورود</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-xs text-slate-600 hover:text-teal-700 font-medium cursor-pointer"
                >
                  قبلاً ثبت‌نام کرده‌اید؟ <span className="font-bold text-teal-600">وارد شوید</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
