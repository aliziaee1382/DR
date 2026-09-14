import React from 'react';
import { Doctor } from '../types';
import { useApp } from '../context/AppContext';
import {
  Star,
  MapPin,
  Calendar,
  Video,
  MessageSquare,
  Phone,
  UserCheck,
  Heart,
  ChevronLeft,
  ShieldCheck,
  Building
} from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
  onSelect: (doctor: Doctor) => void;
  onBookDirect?: (doctor: Doctor, type: 'text' | 'voice' | 'video') => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onSelect, onBookDirect }) => {
  const { savedDoctorIds, toggleFavoriteDoctor } = useApp();
  const isFavorite = savedDoctorIds.includes(doctor.id);

  // Find next available slot
  const nextSlotDay = doctor.workingHours[0]?.day || 'فردا';
  const nextSlotTime = doctor.workingHours[0]?.slots[0] || '۱۰:۰۰';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-3 sm:p-5 flex flex-col justify-between relative group">
      {/* Favorite Heart Button in top corner */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavoriteDoctor(doctor.id);
        }}
        className={`absolute top-2.5 left-2.5 sm:top-3 sm:left-3 p-1.5 sm:p-2 rounded-xl transition-colors cursor-pointer z-10 ${
          isFavorite
            ? 'bg-rose-50 text-rose-600'
            : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
        }`}
        title={isFavorite ? 'حذف از نشان‌شده‌ها' : 'افزودن به نشان‌شده‌ها'}
      >
        <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
      </button>

      {/* Top Section: Avatar centered, and Doctor Name + Specialty stacked directly below */}
      <div className="flex flex-col items-center text-center mb-2 sm:mb-3 pt-1 sm:pt-0">
        <div className="relative shrink-0 mb-2">
          <img
            src={doctor.avatar}
            alt={doctor.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-slate-100 shadow-xs"
          />
          {doctor.onlineStatus === 'online' && (
            <span className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emerald-500 ring-2 ring-white rounded-full" title="آنلاین و آماده مشاوره" />
          )}
        </div>

        <div className="w-full flex flex-col items-center px-1">
          <div className="flex items-center justify-center gap-1 flex-wrap w-full">
            <h3
              onClick={() => onSelect(doctor)}
              className="font-bold text-slate-900 text-xs sm:text-base hover:text-teal-600 transition-colors cursor-pointer text-center truncate max-w-full"
            >
              {doctor.name}
            </h3>
            {doctor.isVerified && (
              <span className="text-teal-600 shrink-0" title="دارای نظام پزشکی تأیید شده">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline" />
              </span>
            )}
          </div>
          <p className="text-[11px] sm:text-xs text-slate-600 font-medium mt-0.5 text-center truncate max-w-full">{doctor.title}</p>
          <span className="inline-block mt-1 text-[9px] sm:text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 sm:px-2 rounded-md">
            نظام پزشکی: {doctor.medicalCode}
          </span>
        </div>
      </div>

      {/* Info Badges (Rating, Experience, Location) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2 my-2 sm:my-3 text-[10px] sm:text-xs bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-100">
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400 shrink-0" />
          <span className="font-bold text-slate-800">{doctor.rating}</span>
          <span className="text-slate-400 text-[9px] sm:text-[10px]">({doctor.reviewCount})</span>
        </div>
        <div className="flex items-center gap-1 text-slate-600">
          <UserCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-600 shrink-0" />
          <span>{doctor.experienceYears} سال سابقه</span>
        </div>
        <div className="flex items-center gap-1 text-slate-600 truncate">
          <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-500 shrink-0" />
          <span className="truncate">{doctor.city}</span>
        </div>
      </div>

      {/* Hospital/Clinic if present */}
      {doctor.hospitalOrClinic && (
        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-500 mb-2 sm:mb-3">
          <Building className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{doctor.hospitalOrClinic}</span>
        </div>
      )}

      {/* Available Consultation Types & Lowest Price */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1 sm:gap-2 mb-2 sm:mb-3 text-[10px] sm:text-xs">
        <div className="flex items-center gap-1 flex-wrap">
          {doctor.consultationTypes.includes('video') && (
            <span className="px-1 py-0.5 bg-blue-50 text-blue-700 rounded font-medium text-[9px] sm:text-[10px]">
              تصویری
            </span>
          )}
          {doctor.consultationTypes.includes('voice') && (
            <span className="px-1 py-0.5 bg-emerald-50 text-emerald-700 rounded font-medium text-[9px] sm:text-[10px]">
              صوتی
            </span>
          )}
          {doctor.consultationTypes.includes('text') && (
            <span className="px-1 py-0.5 bg-purple-50 text-purple-700 rounded font-medium text-[9px] sm:text-[10px]">
              متنی
            </span>
          )}
        </div>

        <div className="text-left shrink-0">
          <span className="text-[9px] sm:text-[10px] text-slate-400 block">مشاوره از</span>
          <span className="font-bold text-teal-700 text-xs sm:text-sm">
            {(doctor.prices.text || doctor.prices.voice || doctor.prices.video || 150000).toLocaleString('fa-IR')}
          </span>
          <span className="text-[9px] sm:text-[10px] text-slate-500 mr-0.5">تومان</span>
        </div>
      </div>

      {/* Next free slot & Action Buttons */}
      <div className="flex flex-col gap-2 pt-2 border-t sm:border-t-0 border-slate-100">
        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-600">
          <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-600 shrink-0" />
          <span className="truncate">نوبت: <strong className="text-slate-800">{nextSlotDay} {nextSlotTime}</strong></span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => onSelect(doctor)}
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-2 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-0.5 cursor-pointer"
          >
            <span>رزرو نوبت</span>
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
