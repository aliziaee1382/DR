import React from 'react';
import { Logo } from './Logo';
import {
  PhoneCall,
  ShieldCheck,
  Heart,
  MapPin,
  Mail,
  Clock,
  Award,
  Lock,
  Headphones
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string, params?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 inline-block">
              <Logo size="md" showSubtitle={true} className="text-white" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              پزشک آنلاین؛ سامانه تخصصی مشاوره پزشکی آنلاین (متنی، صوتی و تصویری) با بیش از ۱۵۰ پزشک فوق‌تخصص در سراسر کشور. پاسخگویی ۲۴ ساعته و صدور نسخه الکترونیک معتبر بیمه‌ای.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-300">
                <Headphones className="w-4 h-4 text-teal-400" />
                <span>پشتیبانی تلفنی: <strong>۰۲۱-۹۱۰۰۲۴۲۴</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 border-r-2 border-teal-500 pr-2">
              دسترسی سریع
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-teal-400 transition-colors">
                  صفحه اصلی
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('search')} className="hover:text-teal-400 transition-colors">
                  جستجوی پزشک و نوبت‌دهی
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('search', { type: 'video' })} className="hover:text-teal-400 transition-colors">
                  مشاوره ویدیویی آنلاین
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="hover:text-teal-400 transition-colors">
                  مقالات و مجله سلامت
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-teal-400 transition-colors">
                  پرونده سلامت بیمار
                </button>
              </li>
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 border-r-2 border-teal-500 pr-2">
              تخصص‌های محبوب
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('search', { specialty: 'cardiology' })} className="hover:text-teal-400 transition-colors">
                  متخصص قلب و عروق
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('search', { specialty: 'dermatology' })} className="hover:text-teal-400 transition-colors">
                  پوست، مو و زیبایی
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('search', { specialty: 'gynecology' })} className="hover:text-teal-400 transition-colors">
                  زنان، زایمان و نازایی
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('search', { specialty: 'psychiatry' })} className="hover:text-teal-400 transition-colors">
                  روانپزشکی و اعصاب
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('search', { specialty: 'general' })} className="hover:text-teal-400 transition-colors">
                  پزشک عمومی و چکاپ
                </button>
              </li>
            </ul>
          </div>

          {/* Certificates & Emergency Notice */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 border-r-2 border-teal-500 pr-2">
              نمادهای اعتماد و امنیت
            </h4>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-400 mb-1" />
                <span className="text-[10px] font-medium text-slate-300">نماد اعتماد الکترونیکی</span>
              </div>
              <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
                <Lock className="w-6 h-6 text-teal-400 mb-1" />
                <span className="text-[10px] font-medium text-slate-300">پرداخت امن زرین‌پال</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-[11px] leading-relaxed">
              <strong>توجه اورژانسی:</strong> در صورت فوریت‌های پزشکی شدید حتماً بلافاصله با شماره اورژانس <strong>۱۱۵</strong> تماس بگیرید.
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-slate-800 text-center sm:flex sm:items-center sm:justify-between text-xs text-slate-500">
          <p>© ۱۴۰۳ تمامی حقوق مادی و معنوی این پلتفرم محفوظ است.</p>
          <div className="flex items-center justify-center gap-1.5 mt-3 sm:mt-0 text-slate-400">
            <span>طراحی و توسعه توسط</span>
            <a
              href="https://ali0003.ir"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:text-teal-300 font-bold transition-colors hover:underline"
            >
              0003
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
