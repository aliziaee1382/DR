import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Doctor, Appointment } from '../types';
import {
  Calendar,
  Clock,
  User,
  Video,
  FileText,
  DollarSign,
  Plus,
  CheckCircle2,
  Settings,
  ShieldCheck,
  TrendingUp,
  Activity
} from 'lucide-react';

interface DoctorDashboardProps {
  onNavigate: (page: string, params?: any) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ onNavigate }) => {
  const { currentUser, appointments, updateDoctorWorkingHours, doctors } = useApp();

  const myDoctorInfo = doctors.find((d) => d.id === currentUser.id) || doctors[0];
  const myAppointments = appointments.filter((a) => a.doctorId === myDoctorInfo.id);

  const [activeTab, setActiveTab] = useState<'queue' | 'schedule' | 'earnings'>('queue');

  // Working Hours Edit state
  const [workingDays, setWorkingDays] = useState(myDoctorInfo.workingHours);
  const [newSlotTime, setNewSlotTime] = useState('18:00');

  const handleAddSlotToDay = (dayIndex: number) => {
    if (!newSlotTime) return;
    const updated = workingDays.map((d, idx) => {
      if (idx === dayIndex) {
        return { ...d, slots: [...d.slots, newSlotTime] };
      }
      return d;
    });
    setWorkingDays(updated);
    updateDoctorWorkingHours(myDoctorInfo.id, updated);
  };

  const totalEarnings = myAppointments.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Doctor Info Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-right">
          <img
            src={myDoctorInfo.avatar}
            alt={myDoctorInfo.name}
            className="w-20 h-20 rounded-3xl object-cover ring-4 ring-slate-100 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{myDoctorInfo.name}</h1>
              <span className="bg-teal-50 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>پزشک معتمد</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{myDoctorInfo.title} • شماره نظام: {myDoctorInfo.medicalCode}</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-800 to-slate-900 text-white p-4 rounded-2xl w-full md:w-auto min-w-[240px]">
          <span className="text-[10px] text-slate-300 block">کل درآمد حاصل از مشاوره</span>
          <span className="text-lg font-extrabold text-teal-300">
            {totalEarnings.toLocaleString('fa-IR')} <span className="text-xs text-slate-300">تومان</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('queue')}
          className={`pb-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'queue' ? 'border-teal-600 text-teal-700' : 'text-slate-500'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>لیست نوبت‌ها و بیماران امروز ({myAppointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`pb-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'schedule' ? 'border-teal-600 text-teal-700' : 'text-slate-500'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>مدیریت تقویم و ساعات کاری</span>
        </button>
      </div>

      {/* QUEUE TAB */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          {myAppointments.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">{app.patientName}</h3>
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                    کد: {app.trackingCode}
                  </span>
                </div>
                <p className="text-xs text-slate-500">شماره همراه بیمار: {app.patientPhone}</p>
                <span className="text-xs text-teal-700 font-bold block">
                  نوبت: {app.date} ساعت {app.time} ({app.type})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('consultation-room', { appointmentId: app.id })}
                  className="bg-teal-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span>شروع مشاوره و ویزیت</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SCHEDULE TAB */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 border-r-2 border-teal-500 pr-2">
            تنظیم روزها و ساعات نوبت‌دهی مشاوره آنلاین
          </h2>

          <div className="space-y-4">
            {workingDays.map((dayObj, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between font-bold text-xs text-slate-800">
                  <span>روز کاری: {dayObj.day}</span>
                  <span className="text-[10px] text-slate-400">({dayObj.slots.length} ظرفیت نوبت)</span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {dayObj.slots.map((slot) => (
                    <span key={slot} className="bg-white border border-slate-200 text-teal-800 text-xs px-2.5 py-1 rounded-xl font-mono font-bold">
                      {slot}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2 text-xs">
                  <input
                    type="text"
                    value={newSlotTime}
                    onChange={(e) => setNewSlotTime(e.target.value)}
                    placeholder="ساعت جدید e.g. 18:30"
                    className="bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs"
                  />
                  <button
                    onClick={() => handleAddSlotToDay(idx)}
                    className="bg-teal-600 text-white font-bold px-3 py-1 rounded-xl text-xs cursor-pointer"
                  >
                    افزودن نوبت
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
