import React from 'react';
import { Prescription } from '../types';
import {
  FileText,
  Printer,
  Download,
  ShieldCheck,
  Building,
  CheckCircle2,
  Calendar,
  X,
  Pill,
  Activity
} from 'lucide-react';

interface PrescriptionModalProps {
  prescription: Prescription;
  onClose: () => void;
}

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({ prescription, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Prescription Header */}
        <div className="border-b-2 border-dashed border-slate-200 pb-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">نسخه الکترونیک پزشکی</h2>
                <p className="text-xs text-slate-500 font-medium">ثبت‌شده در سامانه یکپارچه سازمان بیمهگر</p>
              </div>
            </div>

            <div className="text-left bg-slate-50 border border-slate-200 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 block">کد رهگیری نسخه</span>
              <span className="text-sm font-mono font-bold text-teal-800 tracking-wider">
                {prescription.trackingCode}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-teal-50/50 p-3.5 rounded-2xl border border-teal-100 text-slate-700">
            <div>
              <span className="text-slate-400 text-[11px] block">پزشک معالج:</span>
              <strong className="text-slate-900">{prescription.doctorName}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">کد نظام پزشکی:</span>
              <strong className="text-slate-900">{prescription.medicalCode}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">تاریخ صدور:</span>
              <strong className="text-slate-900">{prescription.date}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">نام بیمار:</span>
              <strong className="text-slate-900">{prescription.patientName}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">کد ملی بیمار:</span>
              <strong className="text-slate-900 font-mono">{prescription.patientNationalId}</strong>
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-teal-600" />
            <span>تشخیص اولیه پزشک:</span>
          </h4>
          <p className="text-xs bg-slate-50 p-3 rounded-xl text-slate-800 font-medium border border-slate-200/80">
            {prescription.diagnosis}
          </p>
        </div>

        {/* Prescribed Medications */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
            <Pill className="w-4 h-4 text-teal-600" />
            <span>اقلام دارویی تجویز شده:</span>
          </h4>

          <div className="space-y-2.5">
            {prescription.items.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-mono font-bold text-sm text-slate-900">{item.drugName}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 mr-7">
                    دستور مصرف: <strong className="text-slate-800">{item.dosage}</strong>
                  </p>
                  {item.description && (
                    <span className="text-[11px] text-slate-500 mr-7 block">{item.description}</span>
                  )}
                </div>

                <div className="self-end sm:self-center bg-white px-3 py-1 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium">
                  تعداد: <strong>{item.quantity} عدد</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lab Tests if any */}
        {prescription.labTests && prescription.labTests.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-700 mb-2">آزمایش‌ها و پاراکلینیک درخواستی:</h4>
            <ul className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-xs space-y-1 text-slate-800">
              {prescription.labTests.map((test, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>{test}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Instructions */}
        {prescription.instructions && (
          <div className="mb-6 bg-amber-50 border border-amber-200/80 p-3.5 rounded-2xl text-xs text-amber-900">
            <strong>توصیه‌های پزشکی:</strong> {prescription.instructions}
          </div>
        )}

        {/* Digital Stamp Footer */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>امضای الکترونیکی پزشک ثبت و معتبر در تمام داروخانه‌های کشور</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ نسخه</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
