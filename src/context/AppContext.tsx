import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Doctor,
  Specialty,
  Appointment,
  MedicalRecord,
  Prescription,
  Review,
  BlogArticle,
  WalletTransaction,
  ChatMessage,
  ConsultationType
} from '../types';
import { useRealtime } from './RealtimeContext';
import {
  INITIAL_SPECIALTIES,
  INITIAL_DOCTORS,
  INITIAL_APPOINTMENTS,
  INITIAL_MEDICAL_RECORD,
  INITIAL_PRESCRIPTIONS,
  INITIAL_REVIEWS,
  INITIAL_BLOG_ARTICLES,
  CURRENT_USER_PATIENT,
  CURRENT_USER_DOCTOR,
  CURRENT_USER_ADMIN
} from '../data/mockData';

interface AppContextType {
  currentUser: User;
  currentRole: UserRole;
  isLoggedIn: boolean;
  switchRole: (role: UserRole) => void;
  login: (identity: string, password?: string) => { success: boolean; role?: UserRole; message?: string };
  register: (name: string, phone: string) => { success: boolean; role?: UserRole; message?: string };
  logout: () => void;
  doctors: Doctor[];
  specialties: Specialty[];
  appointments: Appointment[];
  medicalRecord: MedicalRecord;
  prescriptions: Prescription[];
  reviews: Review[];
  articles: BlogArticle[];
  savedDoctorIds: string[];
  walletTransactions: WalletTransaction[];
  chatMessages: Record<string, ChatMessage[]>;
  
  // Actions
  addAppointment: (appointment: Omit<Appointment, 'id' | 'trackingCode' | 'createdAt' | 'status'>) => Appointment;
  cancelAppointment: (id: string) => void;
  toggleFavoriteDoctor: (doctorId: string) => void;
  depositWallet: (amount: number, description?: string) => boolean;
  addReview: (doctorId: string, rating: number, comment: string, consultationType: ConsultationType) => void;
  addPrescription: (prescription: Omit<Prescription, 'id' | 'trackingCode' | 'date'>) => Prescription;
  sendChatMessage: (appointmentId: string, text: string, attachmentUrl?: string, attachmentType?: 'image' | 'file') => void;
  verifyDoctor: (doctorId: string, isApproved: boolean) => void;
  updateDoctorWorkingHours: (doctorId: string, workingHours: Doctor['workingHours']) => void;
  updateMedicalRecord: (record: Partial<MedicalRecord>) => void;
  addBlogArticle: (article: Omit<BlogArticle, 'id' | 'date'>) => void;
  notifications: { id: string; message: string; type: 'info' | 'success' | 'warning'; date: string }[];
  addNotification: (message: string, type?: 'info' | 'success' | 'warning') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sendSocketPayload, subscribeSocketEvent } = useRealtime();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [currentRole, setCurrentRole] = useState<UserRole>('patient');
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER_PATIENT);
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [specialties] = useState<Specialty[]>(INITIAL_SPECIALTIES);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord>(INITIAL_MEDICAL_RECORD);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [articles, setArticles] = useState<BlogArticle[]>(INITIAL_BLOG_ARTICLES);
  const [savedDoctorIds, setSavedDoctorIds] = useState<string[]>(['doc-1']);
  const [notifications, setNotifications] = useState<AppContextType['notifications']>([
    { id: '1', message: 'نوبت مشاوره تصویری شما با دکتر مریم رضایی تأیید شد.', type: 'success', date: '۱۰ دقیقه پیش' }
  ]);

  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([
    {
      id: 'tx-1',
      userId: 'patient-1',
      type: 'deposit',
      amount: 1000000,
      description: 'شارژ آنلاین کیف پول درگاه زرین‌پال',
      date: '1403/05/01 - 14:20',
      status: 'successful',
      refCode: 'ZP-892103912'
    },
    {
      id: 'tx-2',
      userId: 'patient-1',
      type: 'payment',
      amount: 150000,
      description: 'پرداخت ویزیت متنی آنلاین',
      date: '1403/05/02 - 10:00',
      status: 'successful',
      refCode: 'ZP-44120931'
    }
  ]);

  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({
    'app-102': [
      {
        id: 'msg-1',
        appointmentId: 'app-102',
        senderId: 'doc-6',
        senderRole: 'doctor',
        senderName: 'دکتر نسترن احمدی',
        text: 'سلام آقای ضیائی عزیز، وقتتون بخیر. فایل آزمایش خون جدیدتون رو مشاهده کردم.',
        timestamp: '۱۰:۰۲'
      },
      {
        id: 'msg-2',
        appointmentId: 'app-102',
        senderId: 'patient-1',
        senderRole: 'patient',
        senderName: 'علی ضیائی',
        text: 'سلام خانم دکتر، ممنون. آیا سطح ویتامین D پایینه؟',
        timestamp: '۱۰:۰۵'
      },
      {
        id: 'msg-3',
        appointmentId: 'app-102',
        senderId: 'doc-6',
        senderRole: 'doctor',
        senderName: 'دکتر نسترن احمدی',
        text: 'بله قدری پایین‌تر از حد نرمال هست (حدود ۱۸). من یک مکمل ویتامین D3 ماهیانه و امگا-۳ براتون در نسخه الکترونیک ثبت کردم.',
        timestamp: '۱۰:۰۸'
      }
    ]
  });

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'patient') setCurrentUser(CURRENT_USER_PATIENT);
    else if (role === 'doctor') setCurrentUser(CURRENT_USER_DOCTOR);
    else if (role === 'admin') setCurrentUser(CURRENT_USER_ADMIN);
  };

  const login = (identity: string, password?: string) => {
    const idClean = identity.trim().toLowerCase();
    const passClean = (password || '').trim();

    // Check doctor test login
    if (idClean === 'doctor' && (passClean === 'doctor' || passClean === '')) {
      setCurrentRole('doctor');
      setCurrentUser(CURRENT_USER_DOCTOR);
      setIsLoggedIn(true);
      addNotification('با موفقیت به عنوان پزشک (دکتر مریم رضایی) وارد شدید.', 'success');
      return { success: true, role: 'doctor' as UserRole };
    }

    // Check patient test login
    if ((idClean === 'patient' || idClean === 'ali') && (passClean === 'patient' || passClean === 'ali' || passClean === '')) {
      setCurrentRole('patient');
      setCurrentUser(CURRENT_USER_PATIENT);
      setIsLoggedIn(true);
      addNotification('با موفقیت به عنوان بیمار (علی ضیائی) وارد شدید.', 'success');
      return { success: true, role: 'patient' as UserRole };
    }

    // Check admin credentials
    if (idClean === 'aliziaee1382' && passClean === 'ali13821382ali') {
      setCurrentRole('admin');
      setCurrentUser(CURRENT_USER_ADMIN);
      setIsLoggedIn(true);
      addNotification('با موفقیت به عنوان مدیر ارشد سیستم وارد شدید.', 'success');
      return { success: true, role: 'admin' as UserRole };
    }

    // Default to patient login
    const patientUser: User = {
      ...CURRENT_USER_PATIENT,
      phone: identity,
      name: identity.length > 3 && !identity.startsWith('09') && !identity.startsWith('0') ? identity : CURRENT_USER_PATIENT.name
    };
    setCurrentRole('patient');
    setCurrentUser(patientUser);
    setIsLoggedIn(true);
    addNotification('ورود شما با موفقیت انجام شد.', 'success');
    return { success: true, role: 'patient' as UserRole };
  };

  const register = (name: string, phone: string) => {
    const newPatient: User = {
      id: 'patient-' + Date.now(),
      name: name.trim() || 'بیمار محترم',
      phone: phone.trim() || '09120000000',
      role: 'patient',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      nationalId: '002' + Math.floor(1000000 + Math.random() * 9000000),
      gender: 'male',
      walletBalance: 500000
    };

    setCurrentRole('patient');
    setCurrentUser(newPatient);
    setIsLoggedIn(true);
    addNotification(`ثبت‌نام شما با موفقیت انجام شد. خوش آمدید ${newPatient.name}`, 'success');
    return { success: true, role: 'patient' as UserRole };
  };

  const logout = () => {
    setIsLoggedIn(false);
    addNotification('شما از حساب کاربری خود خارج شدید.', 'info');
  };

  const addNotification = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    setNotifications((prev) => [
      { id: Date.now().toString(), message, type, date: 'هم‌اکنون' },
      ...prev
    ]);
  };

  const addAppointment = (appointmentData: Omit<Appointment, 'id' | 'trackingCode' | 'createdAt' | 'status'>): Appointment => {
    const trackingCode = 'MED-' + Math.floor(100000 + Math.random() * 900000);
    const newAppointment: Appointment = {
      ...appointmentData,
      id: 'app-' + Date.now(),
      trackingCode,
      createdAt: new Date().toLocaleDateString('fa-IR'),
      status: 'scheduled'
    };

    setAppointments((prev) => [newAppointment, ...prev]);

    // Deduct from wallet if paid via wallet
    if (currentUser.walletBalance >= appointmentData.price) {
      setCurrentUser((prev) => ({
        ...prev,
        walletBalance: prev.walletBalance - appointmentData.price
      }));

      setWalletTransactions((prev) => [
        {
          id: 'tx-' + Date.now(),
          userId: currentUser.id,
          type: 'payment',
          amount: appointmentData.price,
          description: `پرداخت نوبت ${appointmentData.doctorName} (${appointmentData.specialtyName})`,
          date: new Date().toLocaleDateString('fa-IR') + ' - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
          status: 'successful',
          refCode: trackingCode
        },
        ...prev
      ]);
    }

    addNotification(`نوبت شما با کد پیگیری ${trackingCode} با موفقیت ثبت شد.`, 'success');
    return newAppointment;
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'cancelled' } : app))
    );

    const app = appointments.find((a) => a.id === id);
    if (app) {
      // Refund to wallet
      setCurrentUser((prev) => ({
        ...prev,
        walletBalance: prev.walletBalance + app.price
      }));

      setWalletTransactions((prev) => [
        {
          id: 'tx-' + Date.now(),
          userId: currentUser.id,
          type: 'refund',
          amount: app.price,
          description: `استرداد وجه لغو نوبت ${app.doctorName}`,
          date: new Date().toLocaleDateString('fa-IR'),
          status: 'successful',
          refCode: 'RF-' + Math.floor(100000 + Math.random() * 900000)
        },
        ...prev
      ]);

      addNotification(`نوبت با موفقیت لغو شد و مبلغ ${app.price.toLocaleString('fa-IR')} تومان به کیف پول بازگشت.`, 'info');
    }
  };

  const toggleFavoriteDoctor = (doctorId: string) => {
    setSavedDoctorIds((prev) =>
      prev.includes(doctorId) ? prev.filter((id) => id !== doctorId) : [...prev, doctorId]
    );
  };

  const depositWallet = (amount: number, description = 'شارژ آنلاین کیف پول') => {
    setCurrentUser((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + amount
    }));

    setWalletTransactions((prev) => [
      {
        id: 'tx-' + Date.now(),
        userId: currentUser.id,
        type: 'deposit',
        amount,
        description,
        date: new Date().toLocaleDateString('fa-IR') + ' - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        status: 'successful',
        refCode: 'ZP-' + Math.floor(10000000 + Math.random() * 90000000)
      },
      ...prev
    ]);

    addNotification(`مبلغ ${amount.toLocaleString('fa-IR')} تومان با موفقیت به کیف پول افزوده‌شد.`, 'success');
    return true;
  };

  const addReview = (doctorId: string, rating: number, comment: string, consultationType: ConsultationType) => {
    const newReview: Review = {
      id: 'rev-' + Date.now(),
      doctorId,
      patientId: currentUser.id,
      patientName: currentUser.name,
      rating,
      comment,
      date: new Date().toLocaleDateString('fa-IR'),
      consultationType,
      isApproved: true
    };

    setReviews((prev) => [newReview, ...prev]);

    // Recalculate doctor rating
    setDoctors((prev) =>
      prev.map((doc) => {
        if (doc.id === doctorId) {
          const docRevs = [...reviews.filter((r) => r.doctorId === doctorId), newReview];
          const avg = docRevs.reduce((acc, curr) => acc + curr.rating, 0) / docRevs.length;
          return {
            ...doc,
            rating: Number(avg.toFixed(1)),
            reviewCount: docRevs.length
          };
        }
        return doc;
      })
    );

    addNotification('نظر و امتیاز شما با موفقیت به ثبت رسید.', 'success');
  };

  const addPrescription = (prescriptionData: Omit<Prescription, 'id' | 'trackingCode' | 'date'>) => {
    const trackingCode = 'RX-' + Math.floor(10000000 + Math.random() * 90000000);
    const newPrescription: Prescription = {
      ...prescriptionData,
      id: 'presc-' + Date.now(),
      trackingCode,
      date: new Date().toLocaleDateString('fa-IR')
    };

    setPrescriptions((prev) => [newPrescription, ...prev]);
    addNotification(`نسخه الکترونیک با کد رهگیری ${trackingCode} در سامانه بیمه صادر شد.`, 'success');
    return newPrescription;
  };

  // Subscribe to real-time WebSocket events for incoming chat messages & room history
  useEffect(() => {
    const unsubscribe = subscribeSocketEvent((data: any) => {
      if (data.type === 'chat_history') {
        const { appointmentId, messages } = data;
        if (appointmentId && Array.isArray(messages)) {
          setChatMessages((prev) => ({
            ...prev,
            [appointmentId]: messages
          }));
        }
      } else if (data.type === 'new_message') {
        const { appointmentId, message } = data;
        if (appointmentId && message) {
          setChatMessages((prev) => {
            const existing = prev[appointmentId] || [];
            if (existing.some((m) => m.id === message.id)) {
              return prev; // Avoid duplicate message
            }
            return {
              ...prev,
              [appointmentId]: [...existing, message]
            };
          });
        }
      }
    });

    return unsubscribe;
  }, [subscribeSocketEvent]);

  const sendChatMessage = (appointmentId: string, text: string, attachmentUrl?: string, attachmentType?: 'image' | 'file') => {
    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      appointmentId,
      senderId: currentUser.id,
      senderRole: currentRole === 'doctor' ? 'doctor' : 'patient',
      senderName: currentUser.name,
      text,
      attachmentUrl,
      attachmentType,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };

    // Optimistically update local state
    setChatMessages((prev) => {
      const existing = prev[appointmentId] || [];
      if (existing.some((m) => m.id === newMsg.id)) return prev;
      return {
        ...prev,
        [appointmentId]: [...existing, newMsg]
      };
    });

    // Send to WebSocket server for broadcasting to all connected tabs/users in this appointment room
    sendSocketPayload({
      type: 'send_message',
      appointmentId,
      message: newMsg
    });
  };

  const verifyDoctor = (doctorId: string, isApproved: boolean) => {
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.id === doctorId
          ? { ...doc, isVerified: isApproved, status: isApproved ? 'active' : 'suspended' }
          : doc
      )
    );
    addNotification(`وضعیت تأیید پزشک بروزرسانی شد.`, 'info');
  };

  const updateDoctorWorkingHours = (doctorId: string, workingHours: Doctor['workingHours']) => {
    setDoctors((prev) =>
      prev.map((doc) => (doc.id === doctorId ? { ...doc, workingHours } : doc))
    );
    addNotification('ساعات کاری پزشک با موفقیت بروزرسانی شد.', 'success');
  };

  const updateMedicalRecord = (recordData: Partial<MedicalRecord>) => {
    setMedicalRecord((prev) => ({ ...prev, ...recordData }));
    addNotification('پرونده سلامت شما با موفقیت بروز شد.', 'success');
  };

  const addBlogArticle = (articleData: Omit<BlogArticle, 'id' | 'date'>) => {
    const newArt: BlogArticle = {
      ...articleData,
      id: 'blog-' + Date.now(),
      date: new Date().toLocaleDateString('fa-IR')
    };
    setArticles((prev) => [newArt, ...prev]);
    addNotification('مقاله سلامت جدید با موفقیت منتشر شد.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        isLoggedIn,
        switchRole,
        login,
        register,
        logout,
        doctors,
        specialties,
        appointments,
        medicalRecord,
        prescriptions,
        reviews,
        articles,
        savedDoctorIds,
        walletTransactions,
        chatMessages,
        addAppointment,
        cancelAppointment,
        toggleFavoriteDoctor,
        depositWallet,
        addReview,
        addPrescription,
        sendChatMessage,
        verifyDoctor,
        updateDoctorWorkingHours,
        updateMedicalRecord,
        addBlogArticle,
        notifications,
        addNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
