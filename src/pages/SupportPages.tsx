import React, { useState } from 'react';
import { Headphones, ShieldCheck, Mail, MapPin, Phone, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export const SupportPages: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'about' | 'contact' | 'rules'>('about');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMsg, setTicketMsg] = useState('');
  const [showTicketSent, setShowTicketSent] = useState(false);

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMsg.trim()) return;
    setShowTicketSent(true);
    setTicketSubject('');
    setTicketMsg('');
    setTimeout(() => setShowTicketSent(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('about')}
          className={`pb-3 px-4 border-b-2 transition-all cursor-pointer ${
            activeTab === 'about' ? 'border-teal-600 text-teal-700 font-extrabold' : 'text-slate-500'
          }`}
        >
          درباره پلتفرم اسنپ‌درمان ۲۴
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`pb-3 px-4 border-b-2 transition-all cursor-pointer ${
            activeTab === 'contact' ? 'border-teal-600 text-teal-700 font-extrabold' : 'text-slate-500'
          }`}
        >
          تماس با ما و ثبت تیکت پشتیبانی
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`pb-3 px-4 border-b-2 transition-all cursor-pointer ${
            activeTab === 'rules' ? 'border-teal-600 text-teal-700 font-extrabold' : 'text-slate-500'
          }`}
        >
          قوانین و حریم خصوصی
        </button>
      </div>

      {activeTab === 'about' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 border-r-2 border-teal-500 pr-2">
            درباره پلتفرم پزشک آنلاین
          </h2>
          <p>
            پزشک آنلاین تخصصی‌ترین سامانه هوشمند ارتباط آنلاین بیمار با پزشک از طریق مشاوره متنی، تماس صوتی و ویدیویی زنده است. هدف ما تسهیل دسترسی به بهترین متخصصین کشور بدون نیاز به رفت‌وآمد و اتلاف زمان در صف‌های طولانی می‌باشد.
          </p>
        </div>
      )}

      {activeTab === 'contact' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 border-r-2 border-teal-500 pr-2">
            ارسال تیکت به واحد پشتیبانی
          </h2>

          {showTicketSent && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-2xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>تیکت شما با موفقیت ثبت شد. همکاران پشتیبانی در کمتر از ۳۰ دقیقه با شما تماس خواهند گرفت.</span>
            </div>
          )}

          <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">موضوع تیکت</label>
              <input
                type="text"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="مثلاً: مشکل در پرداخت ویزیت..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">متن پیام یا شکایت</label>
              <textarea
                value={ticketMsg}
                onChange={(e) => setTicketMsg(e.target.value)}
                placeholder="توضیحات کامل..."
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800"
              />
            </div>

            <button
              type="submit"
              className="bg-teal-600 text-white font-bold px-6 py-3 rounded-xl text-xs cursor-pointer flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>ارسال تیکت پشتیبانی</span>
            </button>
          </form>
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs text-xs text-slate-700 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 border-r-2 border-teal-500 pr-2">
            قوانین نوبت‌دهی و لغو مشاوره
          </h2>
          <p>
            ۱. لغو نوبت تا حداقل ۲ ساعت قبل از زمان ویزیت امکان‌پذیر بوده و تمام وجه عودت داده می‌شود.<br />
            ۲. اطلاعات پزشکی و پرونده سلامت بیماران بر اساس استانداردهای فایروال و رمزشده حفظ می‌گردد.
          </p>
        </div>
      )}
    </div>
  );
};
