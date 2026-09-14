export type UserRole = 'patient' | 'doctor' | 'admin';

export type ConsultationType = 'text' | 'voice' | 'video';

export interface Specialty {
  id: string;
  name: string;
  englishName: string;
  icon: string;
  doctorCount: number;
  description: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string; // e.g., متخصص بیماری‌های قلب و عروق
  specialtyId: string;
  specialtyName: string;
  medicalCode: string; // شماره نظام پزشکی
  city: string;
  address: string;
  location: { lat: number; lng: number };
  avatar: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  biography: string;
  insurances: string[];
  consultationTypes: ConsultationType[];
  prices: {
    text?: number;
    voice?: number;
    video?: number;
  };
  isVerified: boolean;
  status: 'active' | 'pending' | 'suspended';
  workingHours: {
    day: string; // e.g. "شنبه"
    dayIndex: number; // 0 to 6
    slots: string[]; // e.g. ["09:00", "09:30", "10:00"]
  }[];
  hospitalOrClinic?: string;
  onlineStatus: 'online' | 'offline' | 'busy';
}

export interface Appointment {
  id: string;
  trackingCode: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  doctorTitle: string;
  doctorAvatar: string;
  specialtyName: string;
  type: ConsultationType;
  date: string; // e.g. "1403/05/12"
  time: string; // e.g. "10:30"
  price: number;
  insuranceUsed?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'in_consultation';
  notes?: string;
  symptoms?: string;
  attachments?: string[];
  createdAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  bloodType: string;
  allergies: string[];
  chronicDiseases: string[];
  currentMedications: string[];
  pastSurgeries: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  uploadedFiles: {
    id: string;
    title: string;
    date: string;
    url: string;
    type: 'lab' | 'radiology' | 'prescription' | 'other';
  }[];
}

export interface Prescription {
  id: string;
  appointmentId: string;
  trackingCode: string;
  doctorId: string;
  doctorName: string;
  medicalCode: string;
  patientId: string;
  patientName: string;
  patientNationalId: string;
  date: string;
  diagnosis: string;
  items: {
    drugName: string;
    dosage: string; // e.g., هر ۱۲ ساعت یک عدد
    quantity: number;
    description?: string;
  }[];
  labTests?: string[];
  instructions?: string;
}

export interface ChatMessage {
  id: string;
  appointmentId: string;
  senderId: string;
  senderRole: 'patient' | 'doctor' | 'system';
  senderName: string;
  text: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'file';
  timestamp: string;
}

export interface Review {
  id: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  consultationType: ConsultationType;
  waitDuration?: string;
  doctorResponse?: string;
  isApproved: boolean;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdraw' | 'payment' | 'refund';
  amount: number;
  description: string;
  date: string;
  status: 'successful' | 'failed' | 'pending';
  refCode: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  category: string;
  author: string;
  authorRole: string;
  readTime: string;
  date: string;
  image: string;
  summary: string;
  content: string;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  avatar?: string;
  nationalId?: string;
  birthDate?: string;
  gender?: 'male' | 'female';
  city?: string;
  walletBalance: number;
}
