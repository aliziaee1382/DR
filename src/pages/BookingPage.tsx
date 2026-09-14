import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Doctor, ConsultationType, Appointment } from '../types';
import { INSURANCES } from '../data/mockData';
import {
  Calendar,
  Clock,
  User,
  ShieldCheck,
  CreditCard,
  Wallet,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  ChevronLeft,
  Sparkles,
  Lock,
  Tag
} from 'lucide-react';

interface BookingPageProps {
  doctor: Doctor;
  consultationType: ConsultationType;
  day: string;
  time: string;
  price: number;
  onNavigate: (page: string, params?: any) => void;
  onBookingSuccess: (appointment: Appointment) => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  doctor,
  consultationType,
  day,
  time,
  price,
  onNavigate,
  onBookingSuccess
}) => {
  const { currentUser, addAppointment, depositWallet } = useApp();

  const [forWho, setForWho] = useState<'self' | 'relative'>('self');
  const [patientName, setPatientName] = useState(currentUser.name);
  const [patientPhone, setPatientPhone] = useState(currentUser.phone);
  const [patientNationalId, setPatientNationalId] = useState(currentUser.nationalId || '0019283746');
  const [selectedInsurance, setSelectedInsurance] = useState(doctor.insurances[0] || 'تأمین اجتماعی');
  const [symptoms, setSymptoms] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);

  // Promo code
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountError, setDiscountError] = useState('');

  // Payment choice
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'gateway'>('wallet');

  // Calculating final price
  const discountAmount = Math.round((price * discountPercent) / 100);
  const finalPrice = Math.max(0, price - discountAmount);

  const applyDiscount = () => {
    if (discountCode.trim().toUpperCase() === 'OFF20' || discountCode.trim().toUpperCase() === 'HEALTH') {
      setDiscountPercent(20);
      setDiscountError('');
    } else {
      setDiscountError('کد تخفیف وارد شده معتبر نیست.');
    }
  };

  const handleConfirmBooking = () => {
    // If paying via wallet and balance is less, prompt deposit
    if (paymentMethod === 'wallet' && currentUser.walletBalance < finalPrice) {
      const needed = finalPrice - currentUser.walletBalance;
      depositWallet(needed, 'شارژ خودکار کیف پول جهت تکمیل پرداخت نوبت');
    }

    const newApp = addAppointment({
      patientId: currentUser.id,
      patientName,
      patientPhone,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorTitle: doctor.title,
      doctorAvatar: doctor.avatar,
      specialtyName: doctor.specialtyName,
      type: consultationType,
      date: day,
      time,
      price: finalPrice,
      insuranceUsed: selectedInsurance,
      symptoms,
      attachments
    });

    onBookingSuccess(newApp);
  };

  const typeLabels: Record<ConsultationType, string> = {
    text: 'مشاوره چت متنی',
    voice: 'مشاوره صوتی (تلفنی)',
    video: 'مشاوره ویدیویی آنلاین'
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header breadcrumb */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-slate-900">تکمیل اطلاعات و پرداخت نوبت</h1>
        <button
          onClick={() => onNavigate('doctor-profile', { doctorId: doctor.id })}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span>انصراف</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Patient Details & Symptom Upload */}
        <div className="md:col-span-2 space-y-6">
          {/* Patient Selection (Self / Relative) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600" />
              <span>مشخصات بیمار</span>
            </h3>

            <div className="flex items-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => {
                  setForWho('self');
                  setPatientName(currentUser.name);
                }}
                className={`flex-1 p-3 rounded-2xl border font-bold text-center transition-colors ${
                  forWho === 'self'
                    ? 'bg-teal-50 border-teal-500 text-teal-800'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                برای خودم ({currentUser.name})
              </button>
              <button
                type="button"
                onClick={() => {
                  setForWho('relative');
                  setPatientName('');
                }}
                className={`flex-1 p-3 rounded-2xl border font-bold text-center transition-colors ${
                  forWho === 'relative'
                    ? 'bg-teal-50 border-teal-500 text-teal-800'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                برای اعضای خانواده / اعضای دیگر
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">نام و نام خانوادگی بیمار</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="نام کامل بیمار"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">کد ملی جهت ثبت نسخه بیمه</label>
                <input
                  type="text"
                  value={patientNationalId}
                  onChange={(e) => setPatientNationalId(e.target.value)}
                  placeholder="کد ملی ۱۰ رقمی"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">شماره تلفن همراه</label>
                <input
                  type="text"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="۰۹۱۲..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">بیمه پایه / تکمیلی</label>
                <select
                  value={selectedInsurance}
                  onChange={(e) => setSelectedInsurance(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-teal-500"
                >
                  {INSURANCES.map((ins) => (
                    <option key={ins} value={ins}>
                      {ins}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Symptoms Description & File Upload */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" />
              <span>علائم و سوابق پزشکی (اختیاری)</span>
            </h3>

            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="توضیح کوتاه درباره علت مراجعه، داروی خاص یا علائم بیماری..."
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
            />

            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center text-xs text-slate-500 space-y-2 hover:bg-slate-50 transition-colors cursor-pointer">
              <Upload className="w-6 h-6 text-teal-600 mx-auto" />
              <p className="font-bold text-slate-700">بارگذاری تصویر آزمایش، سونوگرافی یا نسخه قبلی</p>
              <span className="text-[10px] text-slate-400 block">فرمت‌های مجاز: JPG, PNG, PDF (حداکثر ۱۰ مگابایت)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Payment Gateway */}
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">خلاصه نوبت انتخابی</h3>

            <div className="flex items-center gap-3">
              <img src={doctor.avatar} alt={doctor.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100" />
              <div>
                <h4 className="font-bold text-slate-900 text-xs">{doctor.name}</h4>
                <span className="text-[11px] text-slate-500">{doctor.title}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl text-xs space-y-2 text-slate-700">
              <div className="flex items-center justify-between">
                <span>نوع مشاوره:</span>
                <strong className="text-teal-800">{typeLabels[consultationType]}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>زمان نوبت:</span>
                <strong className="text-slate-900">{day} ساعت {time}</strong>
              </div>
            </div>

            {/* Discount Promo Input */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-[11px] font-bold text-slate-700 block">کد تخفیف دارید؟ (تست: OFF20)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="مثال: OFF20"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={applyDiscount}
                  className="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                >
                  اعمال
                </button>
              </div>
              {discountError && <span className="text-[10px] text-rose-600 block">{discountError}</span>}
              {discountPercent > 0 && (
                <span className="text-[10px] text-emerald-600 font-bold block">
                  کد تخفیف ۲۰٪ با موفقیت اعمال شد.
                </span>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs pt-3 border-t border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>هزینه ویزیت:</span>
                <span>{price.toLocaleString('fa-IR')} تومان</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>تخفیف:</span>
                  <span>- {discountAmount.toLocaleString('fa-IR')} تومان</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>مبلغ قابل پرداخت:</span>
                <span className="text-teal-700">{finalPrice.toLocaleString('fa-IR')} تومان</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 pt-3">
              <label className="text-xs font-bold text-slate-700 block">روش پرداخت:</label>
              <div className="space-y-2 text-xs">
                <label className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer ${
                  paymentMethod === 'wallet' ? 'bg-teal-50 border-teal-500' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payMethod"
                      checked={paymentMethod === 'wallet'}
                      onChange={() => setPaymentMethod('wallet')}
                      className="accent-teal-600"
                    />
                    <Wallet className="w-4 h-4 text-teal-600" />
                    <span className="font-bold text-slate-800">پرداخت از کیف پول</span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    موجودی: {currentUser.walletBalance.toLocaleString('fa-IR')} تومان
                  </span>
                </label>

                <label className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer ${
                  paymentMethod === 'gateway' ? 'bg-teal-50 border-teal-500' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payMethod"
                      checked={paymentMethod === 'gateway'}
                      onChange={() => setPaymentMethod('gateway')}
                      className="accent-teal-600"
                    />
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-800">درگاه پرداخت شتاب (زرین‌پال)</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Final CTA Button */}
            <button
              onClick={handleConfirmBooking}
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold py-3.5 rounded-2xl text-xs sm:text-sm shadow-lg shadow-teal-600/30 transition-all cursor-pointer mt-4 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>تأیید نهایی و پرداخت امن</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
