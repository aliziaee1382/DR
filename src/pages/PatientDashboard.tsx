import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Appointment, Prescription, Doctor } from '../types';
import { PrescriptionModal } from '../components/PrescriptionModal';
import { DoctorCard } from '../components/DoctorCard';
import {
  Calendar,
  FileText,
  Heart,
  Wallet,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Video,
  MessageSquare,
  Phone,
  ShieldCheck,
  Building,
  Upload,
  ChevronLeft
} from 'lucide-react';

interface PatientDashboardProps {
  initialTab?: string;
  onNavigate: (page: string, params?: any) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  initialTab = 'appointments',
  onNavigate
}) => {
  const {
    currentUser,
    appointments,
    cancelAppointment,
    prescriptions,
    medicalRecord,
    updateMedicalRecord,
    walletTransactions,
    depositWallet,
    savedDoctorIds,
    doctors
  } = useApp();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  // Deposit state
  const [depositAmount, setDepositAmount] = useState<number>(500000);

  // Medical Record Edit State
  const [bloodType, setBloodType] = useState(medicalRecord.bloodType);
  const [newAllergy, setNewAllergy] = useState('');
  const [newChronic, setNewChronic] = useState('');

  const savedDoctors = doctors.filter((d) => savedDoctorIds.includes(d.id));

  const handleAddAllergy = () => {
    if (!newAllergy.trim()) return;
    updateMedicalRecord({ allergies: [...medicalRecord.allergies, newAllergy] });
    setNewAllergy('');
  };

  const handleAddChronic = () => {
    if (!newChronic.trim()) return;
    updateMedicalRecord({ chronicDiseases: [...medicalRecord.chronicDiseases, newChronic] });
    setNewChronic('');
  };

  const handleChargeWalletSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    depositWallet(depositAmount);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Patient Profile Card Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-right">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-20 h-20 rounded-3xl object-cover ring-4 ring-slate-100 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{currentUser.name}</h1>
              <span className="bg-teal-50 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                بیمار احراز هویت شده
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">شماره همراه: {currentUser.phone} • کد ملی: {currentUser.nationalId}</p>
            <p className="text-xs text-slate-500">شهر: {currentUser.city || 'تهران'}</p>
          </div>
        </div>

        {/* Wallet Balance Widget */}
        <div className="bg-gradient-to-r from-teal-800 to-slate-900 text-white p-4 rounded-2xl w-full md:w-auto min-w-[240px] flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-slate-300 block">موجودی کیف پول</span>
            <span className="text-lg font-extrabold text-teal-300">
              {currentUser.walletBalance.toLocaleString('fa-IR')} <span className="text-xs text-slate-300">تومان</span>
            </span>
          </div>
          <button
            onClick={() => setActiveTab('wallet')}
            className="bg-teal-500 hover:bg-teal-600 text-white p-2.5 rounded-xl transition-colors cursor-pointer"
            title="افزایش موجودی"
          >
            <PlusCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'appointments'
              ? 'border-teal-600 text-teal-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>نوبت‌های من ({appointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`pb-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'prescriptions'
              ? 'border-teal-600 text-teal-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>نسخه‌های الکترونیک ({prescriptions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('record')}
          className={`pb-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'record'
              ? 'border-teal-600 text-teal-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>پرونده سلامت</span>
        </button>

        <button
          onClick={() => setActiveTab('wallet')}
          className={`pb-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'wallet'
              ? 'border-teal-600 text-teal-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>کیف پول و تراکنش‌ها</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'saved'
              ? 'border-teal-600 text-teal-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>پزشکان نشان‌شده ({savedDoctors.length})</span>
        </button>
      </div>

      {/* TAB 1: APPOINTMENTS */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          {appointments.length > 0 ? (
            appointments.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={app.doctorAvatar}
                    alt={app.doctorName}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{app.doctorName}</h3>
                      <span className="text-[10px] bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded-md">
                        کد پیگیری: {app.trackingCode}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500">{app.doctorTitle}</p>

                    <div className="flex items-center gap-3 text-xs text-slate-600 pt-1">
                      <span>زمان: <strong>{app.date} ساعت {app.time}</strong></span>
                      <span>نوع: <strong className="text-teal-700">{app.type}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {app.status === 'scheduled' && (
                    <>
                      <button
                        onClick={() => onNavigate('consultation-room', { appointmentId: app.id })}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Video className="w-4 h-4" />
                        <span>ورود به اتاق مشاوره</span>
                      </button>

                      <button
                        onClick={() => cancelAppointment(app.id)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-3 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        لغو نوبت
                      </button>
                    </>
                  )}

                  {app.status === 'completed' && (
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ویزیت تکمیل شده</span>
                    </span>
                  )}

                  {app.status === 'cancelled' && (
                    <span className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
                      <XCircle className="w-4 h-4 text-rose-500" />
                      <span>لغو شده</span>
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-500 text-xs space-y-3">
              <p>هنوز نوبتی ثبت نکرده‌اید.</p>
              <button
                onClick={() => onNavigate('search')}
                className="bg-teal-600 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
              >
                جستجوی پزشکان و ثبت نوبت
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRESCRIPTIONS */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-4">
          {prescriptions.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex items-center justify-between gap-4"
            >
              <div>
                <span className="text-[10px] text-teal-600 font-bold block">کد رهگیری: {p.trackingCode}</span>
                <h3 className="font-bold text-slate-900 text-sm">{p.diagnosis}</h3>
                <p className="text-xs text-slate-500 mt-0.5">پزشک صادرکننده: {p.doctorName} • تاریخ: {p.date}</p>
              </div>

              <button
                onClick={() => setSelectedPrescription(p)}
                className="bg-teal-600 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>مشاهده نسخه کامل</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: MEDICAL RECORD */}
      {activeTab === 'record' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 border-r-2 border-teal-500 pr-2">
            پرونده دیجیتال سلامت بیمار
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
              <label className="font-bold text-slate-700 block">گروه خونی:</label>
              <select
                value={bloodType}
                onChange={(e) => {
                  setBloodType(e.target.value);
                  updateMedicalRecord({ bloodType: e.target.value });
                }}
                className="w-full bg-white border border-slate-200 rounded-xl p-2 font-bold text-teal-800"
              >
                <option value="O+">O+</option>
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="AB+">AB+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
              <label className="font-bold text-slate-700 block">حساسیت‌ها و آلرژی‌های دارویی:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  placeholder="افزودن حساسیت (مثلا پنی‌سیلین)"
                  className="flex-1 bg-white border border-slate-200 rounded-xl p-2 text-xs"
                />
                <button
                  onClick={handleAddAllergy}
                  className="bg-teal-600 text-white px-3 py-2 rounded-xl font-bold cursor-pointer"
                >
                  ثبت
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {medicalRecord.allergies.map((allg, idx) => (
                  <span key={idx} className="bg-rose-50 text-rose-700 font-bold px-2.5 py-0.5 rounded-lg text-[11px]">
                    {allg}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: WALLET */}
      {activeTab === 'wallet' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm">شارژ آنلاین کیف پول</h3>
            <form onSubmit={handleChargeWalletSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 block mb-1">مبلغ به تومان:</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl text-xs cursor-pointer"
              >
                پرداخت و شارژ
              </button>
            </form>
          </div>

          <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm">تاریخچه تراکنش‌ها</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {walletTransactions.map((tx) => (
                <div key={tx.id} className="p-3 bg-slate-50 rounded-2xl text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold block text-slate-800">{tx.description}</span>
                    <span className="text-[10px] text-slate-400">{tx.date}</span>
                  </div>
                  <strong className={tx.type === 'deposit' ? 'text-emerald-600' : 'text-slate-800'}>
                    {tx.type === 'deposit' ? '+' : '-'}{tx.amount.toLocaleString('fa-IR')} تومان
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SAVED DOCTORS / FAVORITES */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 border-r-2 border-rose-500 pr-2">
              پزشکان نشان‌شده و علاقه‌مندی‌ها
            </h2>
            <span className="text-xs text-slate-500">
              {savedDoctors.length} پزشک ذخیره شده
            </span>
          </div>

          {savedDoctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onSelect={(doc) => onNavigate('doctor-profile', { doctor: doc })}
                  onBookDirect={(doc, type) => onNavigate('booking', { doctor: doc, consultationType: type })}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-500 text-xs space-y-3">
              <Heart className="w-10 h-10 text-slate-300 mx-auto" />
              <p>شما هنوز هیچ پزشکی را به لیست علاقه‌مندی‌های خود اضافه نکرده‌اید.</p>
              <button
                onClick={() => onNavigate('search')}
                className="bg-teal-600 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
              >
                جستجو و مشاهده لیست پزشکان
              </button>
            </div>
          )}
        </div>
      )}

      {/* Prescription Viewer Modal */}
      {selectedPrescription && (
        <PrescriptionModal
          prescription={selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
        />
      )}
    </div>
  );
};
