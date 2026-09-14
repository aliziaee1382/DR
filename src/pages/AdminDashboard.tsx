import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Doctor } from '../types';
import {
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  XCircle,
  FileText,
  DollarSign,
  Users,
  Building,
  Plus
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: string, params?: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { doctors, verifyDoctor, articles, addBlogArticle } = useApp();

  const [activeTab, setActiveTab] = useState<'doctors' | 'financials' | 'blog'>('doctors');
  const [commissionRate, setCommissionRate] = useState<number>(15);

  // New Article Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('سلامت عمومی');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addBlogArticle({
      title,
      category,
      author: 'تیم تحریریه سلامت',
      authorRole: 'پزشک ناظر پلتفرم',
      readTime: '۵ دقیقه',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80',
      summary,
      content,
      tags: ['سلامت', 'پزشکی']
    });

    setTitle('');
    setSummary('');
    setContent('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-teal-900 text-white rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="bg-teal-500/30 text-teal-200 text-[10px] font-bold px-3 py-1 rounded-full border border-teal-400/30">
            پنل مدیریتی ارشد پلتفرم
          </span>
          <h1 className="text-xl font-bold mt-2">مدیریت جامع نوبت‌دهی و پزشکان</h1>
          <p className="text-xs text-slate-300 mt-1">احراز هویت پروانه طبابت، کمیسیون مالی و انتشار محتوای پزشکی</p>
        </div>

        <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 text-xs space-y-1">
          <div>تعداد کل پزشکان: <strong>{doctors.length} نفر</strong></div>
          <div>پزشکان تأیید شده: <strong>{doctors.filter((d) => d.isVerified).length} نفر</strong></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('doctors')}
          className={`pb-3 px-4 border-b-2 transition-all cursor-pointer ${
            activeTab === 'doctors' ? 'border-teal-600 text-teal-700' : 'text-slate-500'
          }`}
        >
          مدیریت و احراز هویت پزشکان ({doctors.length})
        </button>

        <button
          onClick={() => setActiveTab('financials')}
          className={`pb-3 px-4 border-b-2 transition-all cursor-pointer ${
            activeTab === 'financials' ? 'border-teal-600 text-teal-700' : 'text-slate-500'
          }`}
        >
          تنظیمات کمیسیون مالی
        </button>

        <button
          onClick={() => setActiveTab('blog')}
          className={`pb-3 px-4 border-b-2 transition-all cursor-pointer ${
            activeTab === 'blog' ? 'border-teal-600 text-teal-700' : 'text-slate-500'
          }`}
        >
          انتشار مقالات سلامت
        </button>
      </div>

      {/* DOCTORS MANAGEMENT TAB */}
      {activeTab === 'doctors' && (
        <div className="space-y-4">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img src={doc.avatar} alt={doc.name} className="w-14 h-14 rounded-2xl object-cover" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{doc.name}</h3>
                  <p className="text-xs text-slate-500">{doc.title} • شماره نظام: {doc.medicalCode}</p>
                  <span className="text-[10px] text-slate-400 block mt-1">شهر: {doc.city}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {doc.isVerified ? (
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تأیید شده</span>
                  </span>
                ) : (
                  <button
                    onClick={() => verifyDoctor(doc.id, true)}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
                  >
                    تأیید پروانه طبابت
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FINANCIALS TAB */}
      {activeTab === 'financials' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900">تنظیم درصد کمیسیون پلتفرم اسنپ‌درمان ۲۴</h2>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-600">درصد کمیسیون هر ویزیت:</span>
            <input
              type="number"
              value={commissionRate}
              onChange={(e) => setCommissionRate(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded-xl p-2 w-20 text-center font-bold"
            />
            <span>درصد (%)</span>
          </div>
        </div>
      )}

      {/* BLOG CREATOR TAB */}
      {activeTab === 'blog' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900">انتشار مقاله سلامت جدید در سامانه</h2>
          <form onSubmit={handleCreateArticle} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">عنوان مقاله</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="عنوان..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">خلاصه کوتاه</label>
              <input
                type="text"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="خلاصه..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">متن کامل مقاله</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="متن کامل..."
                rows={5}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
              />
            </div>

            <button
              type="submit"
              className="bg-teal-600 text-white font-bold px-6 py-2.5 rounded-xl cursor-pointer"
            >
              انتشار مقاله
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
