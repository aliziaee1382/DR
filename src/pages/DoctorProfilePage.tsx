import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Doctor, ConsultationType, Review } from '../types';
import {
  Star,
  MapPin,
  ShieldCheck,
  Calendar,
  Clock,
  Phone,
  Video,
  MessageSquare,
  Award,
  Building,
  Heart,
  ChevronLeft,
  Share2,
  ThumbsUp,
  UserCheck,
  CheckCircle2,
  Send
} from 'lucide-react';

interface DoctorProfilePageProps {
  doctor: Doctor;
  onBookSlot: (doctor: Doctor, type: ConsultationType, day: string, time: string, price: number) => void;
  onNavigate: (page: string, params?: any) => void;
}

export const DoctorProfilePage: React.FC<DoctorProfilePageProps> = ({
  doctor,
  onBookSlot,
  onNavigate
}) => {
  const { reviews, addReview, savedDoctorIds, toggleFavoriteDoctor } = useApp();
  const [activeTab, setActiveTab] = useState<'booking' | 'about' | 'reviews'>('booking');
  const [selectedConsultType, setSelectedConsultType] = useState<ConsultationType>(
    doctor.consultationTypes[0] || 'video'
  );
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [selectedSlotTime, setSelectedSlotTime] = useState<string>('');

  // Add review form state
  const [userRating, setUserRating] = useState<number>(5);
  const [userComment, setUserComment] = useState<string>('');
  const [showReviewSuccess, setShowReviewSuccess] = useState<boolean>(false);

  const isFavorite = savedDoctorIds.includes(doctor.id);
  const doctorReviews = reviews.filter((r) => r.doctorId === doctor.id);

  const workingDays = doctor.workingHours;
  const currentDay = workingDays[selectedDayIndex] || workingDays[0];

  const consultTypeTitles: Record<ConsultationType, { title: string; icon: React.ReactNode; desc: string }> = {
    video: {
      title: 'مشاوره ویدیویی زنده',
      icon: <Video className="w-5 h-5 text-blue-600" />,
      desc: 'تماس تصویری آنلاین در بستر امن مرورگر وب بدون نصب برنامه'
    },
    voice: {
      title: 'مشاوره صوتی (تلفنی)',
      icon: <Phone className="w-5 h-5 text-emerald-600" />,
      desc: 'تماس صوتی مستقیم پزشک با شماره همراه شما در زمان نوبت'
    },
    text: {
      title: 'چت متنی و ارسال فایل',
      icon: <MessageSquare className="w-5 h-5 text-purple-600" />,
      desc: 'گفتگوی متنی زنده، ارسال تصویر آزمایش و تجویز آنلاین'
    }
  };

  const handleProceedToBooking = () => {
    if (!selectedSlotTime) return;
    const price = doctor.prices[selectedConsultType] || 200000;
    onBookSlot(doctor, selectedConsultType, currentDay?.day || 'شنبه', selectedSlotTime, price);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) return;
    addReview(doctor.id, userRating, userComment, selectedConsultType);
    setUserComment('');
    setShowReviewSuccess(true);
    setTimeout(() => setShowReviewSuccess(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back Button */}
      <button
        onClick={() => onNavigate('search')}
        className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4 rotate-180" />
        <span>بازگشت به جستجوی پزشکان</span>
      </button>

      {/* Main Doctor Profile Card Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6 relative">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-right">
            <div className="relative">
              <img
                src={doctor.avatar}
                alt={doctor.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-slate-100 shadow-md"
              />
              {doctor.onlineStatus === 'online' && (
                <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 ring-2 ring-white rounded-full" title="آنلاین" />
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{doctor.name}</h1>
                {doctor.isVerified && (
                  <span className="bg-teal-50 text-teal-700 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>تأیید نظام پزشکی</span>
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-medium">{doctor.title}</p>

              <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 pt-1">
                <span className="bg-slate-100 px-2.5 py-1 rounded-lg">
                  کد نظام پزشکی: <strong className="text-slate-800">{doctor.medicalCode}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>{doctor.experienceYears} سال سابقه</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Rating & Save Actions */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/80 px-3.5 py-1.5 rounded-2xl">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <div className="text-right">
                <span className="text-sm font-bold text-amber-900">{doctor.rating}</span>
                <span className="text-[10px] text-amber-700 block font-medium">({doctor.reviewCount} نظر بیمار)</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavoriteDoctor(doctor.id)}
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  isFavorite
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
                title="افزودن به پزشکان نشان‌شده"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pt-2 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('booking')}
            className={`pb-3 px-4 border-b-2 transition-all cursor-pointer ${
              activeTab === 'booking'
                ? 'border-teal-600 text-teal-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            جدول نوبت‌دهی آنلاین
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-3 px-4 border-b-2 transition-all cursor-pointer ${
              activeTab === 'about'
                ? 'border-teal-600 text-teal-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            بیوگرافی و اطلاعات پزشک
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 px-4 border-b-2 transition-all cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-teal-600 text-teal-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            نظرات بیماران ({doctorReviews.length})
          </button>
        </div>
      </div>

      {/* TAB 1: BOOKING SLOTS CALENDAR */}
      {activeTab === 'booking' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Consultation Type Selector */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-2">۱. روش مشاوره را انتخاب کنید:</h3>
            <div className="space-y-2">
              {doctor.consultationTypes.map((type) => {
                const info = consultTypeTitles[type];
                const isSelected = selectedConsultType === type;
                const price = doctor.prices[type] || 200000;

                return (
                  <div
                    key={type}
                    onClick={() => {
                      setSelectedConsultType(type);
                      setSelectedSlotTime('');
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-teal-50/80 border-teal-500 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-xl shadow-xs">{info.icon}</div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{info.title}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">{info.desc}</p>
                      </div>
                    </div>

                    <div className="text-left shrink-0">
                      <span className="font-bold text-teal-800 text-xs sm:text-sm">
                        {price.toLocaleString('fa-IR')}
                      </span>
                      <span className="text-[10px] text-slate-500 block">تومان</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Date & Time Slot Selector */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-5 space-y-5 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-3">۲. روز و ساعت نوبت را انتخاب کنید:</h3>

              {/* Working Days Selector */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
                {workingDays.map((dayObj, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedDayIndex(idx);
                      setSelectedSlotTime('');
                    }}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 border transition-all cursor-pointer text-center ${
                      selectedDayIndex === idx
                        ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-[10px] font-normal opacity-80">روز کاری</span>
                    <span>{dayObj.day}</span>
                  </button>
                ))}
              </div>

              {/* Slots Grid */}
              <div className="space-y-2">
                <span className="text-xs text-slate-500 font-medium block">
                  ساعات خالی {currentDay?.day}:
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {currentDay?.slots.map((slot) => {
                    const isSelected = selectedSlotTime === slot;
                    return (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlotTime(slot)}
                        className={`p-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-teal-600 text-white border-teal-600 ring-2 ring-teal-300'
                            : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-teal-500 hover:bg-teal-50'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{slot}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Selected Booking CTA Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <div>
                <span className="text-xs text-slate-500 block">نوبت انتخابی شما:</span>
                <span className="text-sm font-extrabold text-slate-900">
                  {selectedSlotTime ? `${currentDay?.day} ساعت ${selectedSlotTime}` : 'هنوز ساعتی انتخاب نشده'}
                </span>
              </div>

              <button
                disabled={!selectedSlotTime}
                onClick={handleProceedToBooking}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 ${
                  selectedSlotTime
                    ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/30'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>ادامه و ثبت نوبت</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ABOUT & CLINIC ADDRESS */}
      {activeTab === 'about' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2 border-r-2 border-teal-500 pr-2">
                بیوگرافی و سوابق علمی
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                {doctor.biography}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2 border-r-2 border-teal-500 pr-2">
                بیمه‌های طرف قرارداد
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {doctor.insurances.map((ins) => (
                  <span
                    key={ins}
                    className="bg-teal-50 text-teal-800 text-xs px-3 py-1 rounded-xl font-medium border border-teal-100"
                  >
                    {ins}
                  </span>
                ))}
              </div>
            </div>

            {doctor.hospitalOrClinic && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 border-r-2 border-teal-500 pr-2">
                  مرکز درمانی / بیمارستان همکاری
                </h3>
                <div className="bg-slate-50 p-3 rounded-2xl text-xs text-slate-700 flex items-center gap-2">
                  <Building className="w-4 h-4 text-teal-600" />
                  <span>{doctor.hospitalOrClinic}</span>
                </div>
              </div>
            )}
          </div>

          {/* Address & Interactive Location Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2 border-r-2 border-teal-500 pr-2">
              آدرس و شماره تماس مطب
            </h3>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{doctor.address}</p>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-600 shrink-0" />
                <span>تلفن مطب: <strong>۰۲۱-۸۸۷۷۶۶۵۵</strong></span>
              </div>
            </div>

            {/* Map Placeholder Graphic */}
            <div className="w-full h-40 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col items-center justify-center p-4 text-center text-slate-400 space-y-1">
              <MapPin className="w-8 h-8 text-teal-600 animate-bounce" />
              <span className="text-xs font-bold text-slate-700">نقشه آنلاین مطب ({doctor.city})</span>
              <span className="text-[10px]">عرض جغرافیایی: {doctor.location.lat}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PATIENT REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {/* Add Review Form */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">ثبت تجربه و نظر درباره ویزیت {doctor.name}</h3>

            {showReviewSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-2xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>نظر شما با موفقیت ثبت شد و به امتیاز پزشک افزوده گردید.</span>
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-600 font-medium">امتیاز شما:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setUserRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= userRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                placeholder="توضیحات شما درباره نحوه رفتار، برخورد، دقت در معاینه و تشخیص پزشک..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500"
              />

              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>ثبت نظر بیمار</span>
              </button>
            </form>
          </div>

          {/* List of Reviews */}
          <div className="space-y-3">
            {doctorReviews.map((rev) => (
              <div key={rev.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{rev.patientName}</span>
                    <span className="text-[10px] text-slate-400">({rev.date})</span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{rev.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  {rev.comment}
                </p>

                {rev.doctorResponse && (
                  <div className="bg-teal-50 border border-teal-100 p-3 rounded-xl text-xs text-teal-900 mt-2 mr-4">
                    <strong className="block text-[11px] text-teal-700 mb-0.5">پاسخ پزشک:</strong>
                    {rev.doctorResponse}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
