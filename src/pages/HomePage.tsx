import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DoctorCard } from '../components/DoctorCard';
import { Doctor } from '../types';
import {
  Search,
  MapPin,
  Calendar,
  MessageSquare,
  Phone,
  Video,
  UserCheck,
  ShieldCheck,
  Sparkles,
  ChevronLeft,
  Heart,
  Brain,
  Baby,
  Activity,
  Zap,
  Bone,
  Eye,
  Ear,
  Apple,
  Stethoscope,
  HeartPulse,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Clock,
  Award
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string, params?: any) => void;
  onSelectDoctor: (doctor: Doctor) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectDoctor }) => {
  const { doctors, specialties, articles } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('همه شهرها');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const iconMap: Record<string, React.ReactNode> = {
    Stethoscope: <Stethoscope className="w-6 h-6" />,
    HeartPulse: <HeartPulse className="w-6 h-6" />,
    Sparkles: <Sparkles className="w-6 h-6" />,
    Baby: <Baby className="w-6 h-6" />,
    Brain: <Brain className="w-6 h-6" />,
    Activity: <Activity className="w-6 h-6" />,
    Zap: <Zap className="w-6 h-6" />,
    Bone: <Bone className="w-6 h-6" />,
    Eye: <Eye className="w-6 h-6" />,
    Ear: <Ear className="w-6 h-6" />,
    Apple: <Apple className="w-6 h-6" />
  };

  // Get top 6 doctors with highest review count (highest patient volume)
  const topDoctors = [...doctors]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 6);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('search', { query: searchQuery, city: selectedCity });
  };

  const faqs = [
    {
      q: 'چگونه می‌توانم از پزشک مشاوره آنلاین (متنی، صوتی یا تصویری) رزرو کنم؟',
      a: 'کافیست نام پزشک یا تخصص مورد نظر خود را در فیلد جستجو وارد کنید، نوع مشاوره آنلاین (متنی، صوتی یا تصویری) و زمان خالی دلخواه را انتخاب کرده و مراحل پرداخت را تکمیل کنید.'
    },
    {
      q: 'آیا نسخه آنلاین صادر شده دارای کد رهگیری و معتبر در بیمه است؟',
      a: 'بله، تمامی پزشکان دارای شماره نظام پزشکی تأییدشده در سامانه بوده و نسخه‌های الکترونیکی بلافاصله در سامانه تأمین اجتماعی و بیمه سلامت ثبت شده و کد رهگیری کشوری دریافت می‌کنند.'
    },
    {
      q: 'در صورت لغو نوبت توسط بیمار یا پزشک، بازگشت وجه به چه صورت انجام می‌شود؟',
      a: 'اگر حداقل ۲ ساعت قبل از زمان ویزیت نوبت خود را لغو کنید، ۱۰۰٪ مبلغ پرداختی بدون کسر هیچ‌گونه کارمزدی بلافاصله به کیف پول حساب کاربری شما عودت داده می‌شود.'
    },
    {
      q: 'برای مشاوره تصویری به چه امکاناتی نیاز دارم؟',
      a: 'تنها با یک گوشی هوشمند یا کامپیوتر متصل به اینترنت و دارای مرورگر بروز (مانند Chrome یا Safari) می‌توانید بدون نیاز به نصب هیچ‌گونه نرم‌افزار جانبی وارد اتاق مشاوره شوید.'
    }
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-teal-900 via-teal-800 to-slate-900 text-white pt-10 pb-20 px-4 sm:px-6 lg:px-8 rounded-b-[2.5rem] shadow-xl overflow-hidden">
        {/* Background Decorative Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/30 text-teal-200 px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>مشاوره پزشکی آنلاین ۲۴ ساعته با پزشکان فوق‌تخصص سراسر کشور</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight max-w-3xl mx-auto">
            مشاوره پزشکی آنلاین با متخصصین <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-teal-200 via-emerald-300 to-teal-100 bg-clip-text text-transparent">
              سریع، آسان و مطمئن
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            جستجوی بیش از ۱۵۰ پزشک متخصص در تمام زمینه‌ها، مشاوره متنی، تماس صوتی و ویدیویی زنده به همراه صدور نسخه الکترونیک بیمه‌ای.
          </p>

          {/* Search Box Card */}
          <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-2xl text-slate-800 max-w-3xl mx-auto border border-slate-100">
            <form onSubmit={handleHeroSearch} className="flex flex-col md:flex-row items-center gap-3">
              {/* Query Input */}
              <div className="flex-1 w-full flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3.5 py-3 rounded-2xl focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="نام پزشک، تخصص یا علائم بیماری (مثلاً: قلب، دکتر رضایی، سردرد)..."
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>

              {/* City Dropdown */}
              <div className="w-full md:w-44 flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-3 rounded-2xl">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="همه شهرها">همه شهرها</option>
                  <option value="تهران">تهران</option>
                  <option value="مشهد">مشهد</option>
                  <option value="اصفهان">اصفهان</option>
                  <option value="شیراز">شیراز</option>
                  <option value="تبریز">تبریز</option>
                  <option value="کرج">کرج</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full md:w-auto bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-lg shadow-teal-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>جستجوی پزشک</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </form>

            {/* Quick consultation shortcuts */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => onNavigate('search', { type: 'video' })}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-100"
              >
                <Video className="w-4 h-4 text-blue-600" />
                <span>مشاوره ویدیویی آنلاین</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('search', { type: 'voice' })}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-100"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>تماس صوتی مستقیم</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('search', { type: 'text' })}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 hover:text-purple-700 text-slate-700 font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-100"
              >
                <MessageSquare className="w-4 h-4 text-purple-600" />
                <span>چت متنی تخصصی</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">دسته‌بندی تخصص‌های پزشکی</h2>
            <p className="text-xs text-slate-500 mt-1">پزشک متخصص خود را بر اساس دسته‌بندی درمان انتخاب کنید</p>
          </div>
          <button
            onClick={() => onNavigate('search')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
          >
            <span>مشاهده همه تخصص‌ها</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 sm:gap-4">
          {specialties.map((spec) => (
            <div
              key={spec.id}
              onClick={() => onNavigate('search', { specialty: spec.id })}
              className="bg-white p-1.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer group text-center flex flex-col items-center justify-center min-h-[80px] sm:min-h-[120px]"
            >
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors flex items-center justify-center mb-1.5 sm:mb-3 shadow-xs shrink-0 [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-6 sm:[&>svg]:h-6">
                {iconMap[spec.icon] || <Stethoscope className="w-6 h-6" />}
              </div>
              <h3 className="font-bold text-slate-900 text-[10px] sm:text-sm group-hover:text-teal-600 transition-colors leading-tight line-clamp-2">
                {spec.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Instant Consultation Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl text-center md:text-right">
            <span className="inline-block bg-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-full">
              پاسخگویی آنی کمتر از ۵ دقیقه
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold leading-snug">
              نیاز به مشاوره سریع با پزشک عمومی دارید؟
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-normal">
              بدون نیاز به انتظار، همین حالا گفتگو با پزشک عمومی کشیک را شروع کنید و پاسخ آزمایش، نسخه‌نویسی یا دستورات دارویی را دریافت نمایید.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => onNavigate('search', { specialty: 'general', type: 'text' })}
              className="w-full sm:w-auto bg-white text-teal-800 hover:bg-emerald-50 font-extrabold px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-md transition-all cursor-pointer text-center"
            >
              شروع مشاوره فوری متنی
            </button>
            <button
              onClick={() => onNavigate('search', { specialty: 'general', type: 'video' })}
              className="w-full sm:w-auto bg-emerald-900/40 hover:bg-emerald-900/60 text-white font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm border border-white/30 transition-all cursor-pointer text-center flex items-center justify-center gap-2"
            >
              <Video className="w-4 h-4" />
              <span>تماس ویدیویی زنده</span>
            </button>
          </div>
        </div>
      </section>

      {/* Top Doctors Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">پزشکان برجسته و برتر</h2>
            <p className="text-xs text-slate-500 mt-1">برترین پزشکان با بالاترین رضایت بیماران</p>
          </div>
          <button
            onClick={() => onNavigate('search')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
          >
            <span>نمایش همه پزشکان</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {topDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onSelect={onSelectDoctor}
            />
          ))}
        </div>
      </section>

      {/* Why Choose Us Features */}
      <section className="bg-slate-100 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900">مزایای نوبت‌دهی آنلاین در اسنپ‌درمان ۲۴</h2>
            <p className="text-xs text-slate-500 mt-1">تجربه‌ای مدرن، سریع و بدون دردسر برای حفظ سلامت شما و خانوده شما</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div className="bg-white p-3.5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs text-right space-y-1.5 sm:space-y-2 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-2.5 sm:mb-4">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">عدم اتلاف وقت در صف</h3>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed mt-1">
                  بدون معطلی در ترافیک شهری یا اتاق انتظار مطب، در دقیقه‌ مشخص شده ویزیت شوید.
                </p>
              </div>
            </div>

            <div className="bg-white p-3.5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs text-right space-y-1.5 sm:space-y-2 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2.5 sm:mb-4">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">نسخه الکترونیک بیمه‌ای</h3>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed mt-1">
                  صدور مستقیم نسخه دارویی و آزمایش‌ها با کد رهگیری کشوری در سازمان‌های بیمه‌گر.
                </p>
              </div>
            </div>

            <div className="bg-white p-3.5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs text-right space-y-1.5 sm:space-y-2 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-2.5 sm:mb-4">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">پزشکان احراز هویت شده</h3>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed mt-1">
                  بررسی پروانه طبابت و شماره نظام پزشکی تمام پزشکان توسط تیم نظارت پزشکی پلتفرم.
                </p>
              </div>
            </div>

            <div className="bg-white p-3.5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs text-right space-y-1.5 sm:space-y-2 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-2.5 sm:mb-4">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">تضمین استرداد ۱۰۰٪ وجه</h3>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed mt-1">
                  امکان لغو نوبت تا ۲ ساعت قبل و بازگشت آنی مبلغ ویزیت به کیف پول کاربری.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog & Health Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">آخرین مقالات مجله سلامت</h2>
            <p className="text-xs text-slate-500 mt-1">اطلاعات و توصیه‌های علمی تاییدشده توسط متخصصین</p>
          </div>
          <button
            onClick={() => onNavigate('blog')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
          >
            <span>مطالعه مقالات بیشتر</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
          {articles.map((art) => (
            <div
              key={art.id}
              onClick={() => onNavigate('blog-detail', { articleId: art.id })}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <img
                  src={art.image}
                  alt={art.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80';
                  }}
                  className="w-full h-28 sm:h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-2.5 sm:p-4">
                  <span className="inline-block bg-teal-50 text-teal-700 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md mb-1.5 sm:mb-2">
                    {art.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug group-hover:text-teal-600 transition-colors mb-1.5 sm:mb-2 line-clamp-2">
                    {art.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2 leading-relaxed mb-2 sm:mb-3">
                    {art.summary}
                  </p>
                </div>
              </div>

              <div className="px-2.5 sm:px-4 pb-2.5 sm:pb-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400">
                <span className="truncate max-w-[100px] sm:max-w-none">{art.author}</span>
                <span className="shrink-0">{art.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">سوالات متداول کاربران</h2>
          <p className="text-xs text-slate-500 mt-1">پاسخ به متداول‌ترین ابهامات نوبت‌دهی و مشاوره آنلاین</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-4 text-right flex items-center justify-between gap-4 font-bold text-slate-800 text-xs sm:text-sm hover:bg-slate-50 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaqIndex === idx ? 'rotate-180 text-teal-600' : ''}`} />
              </button>

              {openFaqIndex === idx && (
                <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
