import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useRealtime } from '../context/RealtimeContext';
import { Appointment, ChatMessage, Prescription } from '../types';
import { VideoCallModal } from '../components/VideoCallModal';
import { PrescriptionModal } from '../components/PrescriptionModal';
import {
  Send,
  Paperclip,
  Video,
  Phone,
  PhoneCall,
  FileText,
  Clock,
  ShieldCheck,
  ChevronLeft,
  User,
  Image as ImageIcon,
  CheckCheck,
  Activity,
  Plus
} from 'lucide-react';

interface ConsultationRoomPageProps {
  appointmentId: string;
  onNavigate: (page: string, params?: any) => void;
}

export const ConsultationRoomPage: React.FC<ConsultationRoomPageProps> = ({
  appointmentId,
  onNavigate
}) => {
  const { joinRoom, subscribeSocketEvent } = useRealtime();
  const {
    appointments,
    chatMessages,
    sendChatMessage,
    prescriptions,
    addPrescription,
    currentUser,
    currentRole,
    medicalRecord
  } = useApp();

  const appointment = appointments.find((a) => a.id === appointmentId) || appointments[0];
  const messages = chatMessages[appointmentId] || [];

  const [inputMsg, setInputMsg] = useState('');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [incomingCall, setIncomingCall] = useState<{ senderName: string; senderRole: string } | null>(null);
  const [viewPrescription, setViewPrescription] = useState<Prescription | null>(null);
  const [showNewPrescriptionForm, setShowNewPrescriptionForm] = useState(false);

  // Join WebSocket room on mount
  useEffect(() => {
    joinRoom(appointmentId, currentUser.id, currentUser.name, currentRole);
  }, [appointmentId, currentUser.id, currentUser.name, currentRole, joinRoom]);

  // Subscribe to WebRTC signaling for incoming calls
  useEffect(() => {
    const unsubscribe = subscribeSocketEvent((data: any) => {
      if (data.appointmentId === appointmentId && data.senderId !== currentUser.id) {
        if (data.type === 'webrtc_start_call' || data.type === 'webrtc_offer') {
          if (!showVideoModal) {
            setIncomingCall({
              senderName: data.senderName || (currentRole === 'doctor' ? appointment.patientName : appointment.doctorName),
              senderRole: data.senderRole || (currentRole === 'doctor' ? 'patient' : 'doctor')
            });
          }
        } else if (data.type === 'webrtc_end_call') {
          setIncomingCall(null);
        }
      }
    });

    return unsubscribe;
  }, [appointmentId, currentUser.id, currentRole, appointment, showVideoModal, subscribeSocketEvent]);

  // New Prescription Form state for Doctors
  const [diagnosis, setDiagnosis] = useState('');
  const [drugName, setDrugName] = useState('');
  const [dosage, setDosage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [drugList, setDrugList] = useState<Array<{ drugName: string; dosage: string; quantity: number }>>([]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    sendChatMessage(appointmentId, inputMsg);
    setInputMsg('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fakeUrl = URL.createObjectURL(file);
      sendChatMessage(appointmentId, `ارسال فایل آزمایش: ${file.name}`, fakeUrl, 'image');
    }
  };

  const handleAddDrugItem = () => {
    if (!drugName.trim()) return;
    setDrugList([...drugList, { drugName, dosage: dosage || 'طبق دستور', quantity }]);
    setDrugName('');
    setDosage('');
    setQuantity(1);
  };

  const handleIssuePrescriptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (drugList.length === 0) return;

    const newPresc = addPrescription({
      appointmentId: appointment.id,
      doctorId: appointment.doctorId,
      doctorName: appointment.doctorName,
      medicalCode: 'م-۱۴۸۹۲',
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      patientNationalId: '0019283746',
      diagnosis: diagnosis || 'چکاپ و ویزیت آنلاین',
      items: drugList
    });

    setShowNewPrescriptionForm(false);
    setViewPrescription(newPresc);
  };

  const existingPrescription = prescriptions.find((p) => p.appointmentId === appointment.id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Incoming Video Call Banner */}
      {incomingCall && !showVideoModal && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-3xl shadow-xl flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl animate-pulse">
              <PhoneCall className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-sm">تماس تصویری ورودی در حال زنگ خوردن...</h4>
              <p className="text-xs text-blue-100">{incomingCall.senderName} در حال برقراری تماس تصویری است.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowVideoModal(true);
                setIncomingCall(null);
              }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              پاسخ به تماس
            </button>
            <button
              onClick={() => setIncomingCall(null)}
              className="bg-white/20 hover:bg-white/30 text-white font-bold px-3 py-2 rounded-xl text-xs transition-all cursor-pointer"
            >
              رد تماس
            </button>
          </div>
        </div>
      )}

      {/* Top Consultation Room Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => onNavigate(currentRole === 'doctor' ? 'doctor-dashboard' : 'dashboard')}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 rotate-180" />
          </button>

          <img
            src={appointment.doctorAvatar}
            alt={appointment.doctorName}
            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-teal-500/30"
          />

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">{appointment.doctorName}</h2>
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" title="آنلاین" />
            </div>
            <p className="text-xs text-slate-500">{appointment.specialtyName} • بیمار: {appointment.patientName}</p>
          </div>
        </div>

        {/* Quick Consultation Tools Bar */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setShowVideoModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Video className="w-4 h-4" />
            <span>تماس تصویری</span>
          </button>

          {existingPrescription ? (
            <button
              onClick={() => setViewPrescription(existingPrescription)}
              className="bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-teal-600" />
              <span>مشاهده نسخه</span>
            </button>
          ) : currentRole === 'doctor' ? (
            <button
              onClick={() => setShowNewPrescriptionForm(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>صدور نسخه بیمه</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="bg-white rounded-3xl border border-slate-200 h-[65vh] flex flex-col overflow-hidden shadow-xs relative">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          <div className="text-center my-2">
            <span className="bg-slate-200/80 text-slate-600 text-[10px] font-medium px-3 py-1 rounded-full">
              اتاق مشاوره امن فعال شد • نوبت {appointment.date} ساعت {appointment.time}
            </span>
          </div>

          {messages.map((msg) => {
            const isMe = msg.senderRole === (currentRole === 'doctor' ? 'doctor' : 'patient');
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
              >
                <span className="text-[10px] text-slate-400 px-1 font-semibold">{msg.senderName}</span>
                <div
                  className={`p-3.5 rounded-2xl max-w-sm sm:max-w-md text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isMe
                      ? 'bg-teal-600 text-white rounded-tl-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tr-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {msg.attachmentUrl && (
                    <div className="mt-2 pt-2 border-t border-white/20">
                      <img
                        src={msg.attachmentUrl}
                        alt="ضمیمه"
                        className="max-w-full rounded-xl object-cover max-h-48"
                      />
                    </div>
                  )}

                  <div className={`text-[9px] mt-1 text-left ${isMe ? 'text-teal-200' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <label className="p-2.5 rounded-xl text-slate-500 hover:text-teal-600 hover:bg-slate-100 transition-colors cursor-pointer">
            <Paperclip className="w-5 h-5" />
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>

          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="پیام یا سوال پزشکی خود را بنویسید..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500"
          />

          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white p-2.5 rounded-2xl shadow-xs transition-colors cursor-pointer"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Video Call Modal */}
      {showVideoModal && (
        <VideoCallModal
          appointmentId={appointment.id}
          doctorName={appointment.doctorName}
          doctorAvatar={appointment.doctorAvatar}
          patientName={appointment.patientName}
          onClose={() => setShowVideoModal(false)}
          onOpenPrescription={() => existingPrescription && setViewPrescription(existingPrescription)}
        />
      )}

      {/* Prescription View Modal */}
      {viewPrescription && (
        <PrescriptionModal
          prescription={viewPrescription}
          onClose={() => setViewPrescription(null)}
        />
      )}

      {/* New Prescription Creator Modal for Doctors */}
      {showNewPrescriptionForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xl space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base">صدور نسخه الکترونیک بیمه‌ای</h3>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">تشخیص اولیه/اصلی</label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="مثال: کمبود ویتامین D3 و چربی خون"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-2 border-t border-slate-100 pt-3">
              <label className="text-xs font-bold text-slate-700 block">افزودن دارو به نسخه</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <input
                  type="text"
                  value={drugName}
                  onChange={(e) => setDrugName(e.target.value)}
                  placeholder="نام دارو (انگلیسی/فارسی)"
                  className="bg-slate-50 border border-slate-200 rounded-xl p-2"
                />
                <input
                  type="text"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="دستور مصرف"
                  className="bg-slate-50 border border-slate-200 rounded-xl p-2"
                />
                <button
                  type="button"
                  onClick={handleAddDrugItem}
                  className="bg-slate-800 text-white font-bold rounded-xl py-2 cursor-pointer"
                >
                  افزودن دارو
                </button>
              </div>

              {drugList.length > 0 && (
                <div className="space-y-1 pt-2">
                  {drugList.map((d, idx) => (
                    <div key={idx} className="bg-slate-50 p-2 rounded-xl text-xs flex justify-between">
                      <strong>{d.drugName}</strong>
                      <span className="text-slate-500">{d.dosage}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowNewPrescriptionForm(false)}
                className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-700"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleIssuePrescriptionSubmit}
                className="px-5 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
              >
                صدور و ثبت نهایی نسخه
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
