import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DoctorCard } from '../components/DoctorCard';
import { Doctor, ConsultationType } from '../types';
import { CITIES, INSURANCES } from '../data/mockData';
import {
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  Shield,
  Star,
  CheckCircle,
  X,
  Stethoscope,
  ChevronDown
} from 'lucide-react';

interface DoctorSearchPageProps {
  onSelectDoctor: (doctor: Doctor) => void;
  initialParams?: {
    query?: string;
    specialty?: string;
    city?: string;
    type?: ConsultationType;
  };
}

export const DoctorSearchPage: React.FC<DoctorSearchPageProps> = ({
  onSelectDoctor,
  initialParams
}) => {
  const { doctors, specialties } = useApp();

  const [query, setQuery] = useState(initialParams?.query || '');
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialParams?.specialty || 'all');
  const [selectedCity, setSelectedCity] = useState(initialParams?.city || 'همه شهرها');
  const [selectedConsultType, setSelectedConsultType] = useState<ConsultationType | 'all'>(
    initialParams?.type || 'all'
  );
  const [selectedInsurance, setSelectedInsurance] = useState('all');
  const [onlyAvailableToday, setOnlyAvailableToday] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'price_low' | 'price_high'>('rating');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter logic
  const filteredDoctors = useMemo(() => {
    return doctors
      .filter((doc) => {
        // Text Search
        if (query.trim()) {
          const q = query.toLowerCase().trim();
          const matchesName = doc.name.toLowerCase().includes(q);
          const matchesTitle = doc.title.toLowerCase().includes(q);
          const matchesBio = doc.biography.toLowerCase().includes(q);
          const matchesCode = doc.medicalCode.includes(q);
          if (!matchesName && !matchesTitle && !matchesBio && !matchesCode) return false;
        }

        // Specialty
        if (selectedSpecialty !== 'all' && doc.specialtyId !== selectedSpecialty) {
          return false;
        }

        // City
        if (selectedCity !== 'همه شهرها' && doc.city !== selectedCity) {
          return false;
        }

        // Consultation type
        if (selectedConsultType !== 'all' && !doc.consultationTypes.includes(selectedConsultType as ConsultationType)) {
          return false;
        }

        // Insurance
        if (selectedInsurance !== 'all' && !doc.insurances.includes(selectedInsurance)) {
          return false;
        }

        // Only verified doctors by default
        if (doc.status !== 'active') return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
        if (sortBy === 'price_low') {
          const priceA = a.prices.text || a.prices.voice || a.prices.video || 0;
          const priceB = b.prices.text || b.prices.voice || b.prices.video || 0;
          return priceA - priceB;
        }
        if (sortBy === 'price_high') {
          const priceA = a.prices.text || a.prices.voice || a.prices.video || 0;
          const priceB = b.prices.text || b.prices.voice || b.prices.video || 0;
          return priceB - priceA;
        }
        return 0;
      });
  }, [
    doctors,
    query,
    selectedSpecialty,
    selectedCity,
    selectedConsultType,
    selectedInsurance,
    onlyAvailableToday,
    sortBy
  ]);

  const clearAllFilters = () => {
    setQuery('');
    setSelectedSpecialty('all');
    setSelectedCity('همه شهرها');
    setSelectedConsultType('all');
    setSelectedInsurance('all');
    setOnlyAvailableToday(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header & Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">جستجو و نوبت‌دهی آنلاین پزشکان</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              نمایش <span className="font-bold text-teal-700">{filteredDoctors.length}</span> پزشک متخصص آماده ویزیت
            </p>
          </div>

          {/* Quick Sort Selector */}
          <div className="flex items-center gap-2 self-end md:self-center text-xs">
            <span className="text-slate-500 font-medium">مرتب‌سازی بر اساس:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="rating">محبوب‌ترین و بالاترین امتیاز</option>
              <option value="experience">بیشترین سابقه طبابت</option>
              <option value="price_low">کمترین قیمت ویزیت</option>
              <option value="price_high">بیشترین قیمت ویزیت</option>
            </select>
          </div>
        </div>

        {/* Query Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی نام پزشک، شماره نظام پزشکی، تخصص یا بیماری..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pr-11 pl-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute left-3 top-3.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid Layout: Sidebar Filters + Doctor Cards List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full bg-teal-600 text-white p-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{showMobileFilters ? 'بستن فیلترها' : 'فیلترهای پیشرفته'}</span>
          </button>
        </div>

        {/* Filter Sidebar */}
        <aside
          className={`lg:block ${
            showMobileFilters ? 'block' : 'hidden'
          } bg-white rounded-3xl border border-slate-200 p-5 space-y-6 shadow-xs sticky top-20 z-10`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-teal-600" />
              <span>فیلترهای جستجو</span>
            </span>
            <button
              onClick={clearAllFilters}
              className="text-[11px] text-rose-600 hover:underline font-medium cursor-pointer"
            >
              پاک کردن همه
            </button>
          </div>

          {/* Specialty Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">تخصص پزشکی</label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="all">همه تخصص‌ها</option>
              {specialties.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.name}
                </option>
              ))}
            </select>
          </div>

          {/* Consultation Type Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">نوع مشاوره آنلاین</label>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                onClick={() => setSelectedConsultType('all')}
                className={`p-2 rounded-xl border text-[11px] font-medium transition-colors ${
                  selectedConsultType === 'all'
                    ? 'bg-teal-50 border-teal-500 text-teal-800 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                همه روش‌ها
              </button>
              <button
                onClick={() => setSelectedConsultType('voice')}
                className={`p-2 rounded-xl border text-[11px] font-medium transition-colors ${
                  selectedConsultType === 'voice'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                تماس صوتی
              </button>
              <button
                onClick={() => setSelectedConsultType('video')}
                className={`p-2 rounded-xl border text-[11px] font-medium transition-colors ${
                  selectedConsultType === 'video'
                    ? 'bg-blue-50 border-blue-500 text-blue-800 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                ویدیو کال
              </button>
              <button
                onClick={() => setSelectedConsultType('text')}
                className={`p-2 rounded-xl border text-[11px] font-medium transition-colors ${
                  selectedConsultType === 'text'
                    ? 'bg-purple-50 border-purple-500 text-purple-800 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                چت متنی
              </button>
            </div>
          </div>

          {/* City Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">شهر پزشک</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Insurance Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">بیمه طرف قرارداد</label>
            <select
              value={selectedInsurance}
              onChange={(e) => setSelectedInsurance(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="all">همه بیمه‌ها</option>
              {INSURANCES.map((ins) => (
                <option key={ins} value={ins}>
                  {ins}
                </option>
              ))}
            </select>
          </div>
        </aside>

        {/* Doctor Cards List */}
        <main className="lg:col-span-3">
          {filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {filteredDoctors.map((doc) => (
                <DoctorCard
                  key={doc.id}
                  doctor={doc}
                  onSelect={onSelectDoctor}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">پزشکی با این مشخصات یافت نشد</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                لطفاً عبارت جستجو یا فیلترهای انتخابی (شهر، تخصص، بیمه) را تغییر دهید.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                پاک کردن تمام فیلترها
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
