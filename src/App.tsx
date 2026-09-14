import React, { useState } from 'react';
import { RealtimeProvider } from './context/RealtimeContext';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { DoctorSearchPage } from './pages/DoctorSearchPage';
import { DoctorProfilePage } from './pages/DoctorProfilePage';
import { BookingPage } from './pages/BookingPage';
import { ConsultationRoomPage } from './pages/ConsultationRoomPage';
import { PatientDashboard } from './pages/PatientDashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { BlogPage } from './pages/BlogPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { SupportPages } from './pages/SupportPages';
import { AuthPage } from './pages/AuthPage';
import { Doctor, ConsultationType, Appointment } from './types';

function AppContent() {
  const { doctors } = useApp();
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [navParams, setNavParams] = useState<any>({});

  const handleNavigate = (page: string, params: any = {}) => {
    setCurrentPage(page);
    setNavParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedDoctor = doctors.find((d) => d.id === navParams.doctorId) || doctors[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-teal-500 selection:text-white">
      {/* Header */}
      <Header onNavigate={handleNavigate} currentPage={currentPage} />

      {/* Main Page Router View */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectDoctor={(doctor: Doctor) =>
              handleNavigate('doctor-profile', { doctorId: doctor.id })
            }
          />
        )}

        {currentPage === 'search' && (
          <DoctorSearchPage
            initialParams={navParams}
            onSelectDoctor={(doctor: Doctor) =>
              handleNavigate('doctor-profile', { doctorId: doctor.id })
            }
          />
        )}

        {currentPage === 'doctor-profile' && (
          <DoctorProfilePage
            doctor={selectedDoctor}
            onNavigate={handleNavigate}
            onBookSlot={(doctor, type, day, time, price) =>
              handleNavigate('booking', { doctor, consultationType: type, day, time, price })
            }
          />
        )}

        {currentPage === 'booking' && (
          <BookingPage
            doctor={navParams.doctor || selectedDoctor}
            consultationType={navParams.consultationType || 'text'}
            day={navParams.day || 'شنبه'}
            time={navParams.time || '۱۰:۰۰'}
            price={navParams.price || 200000}
            onNavigate={handleNavigate}
            onBookingSuccess={(newAppointment: Appointment) =>
              handleNavigate('dashboard', { tab: 'appointments' })
            }
          />
        )}

        {currentPage === 'consultation-room' && (
          <ConsultationRoomPage
            appointmentId={navParams.appointmentId || 'app-101'}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'dashboard' && (
          <PatientDashboard
            initialTab={navParams.tab || 'appointments'}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'doctor-dashboard' && (
          <DoctorDashboard onNavigate={handleNavigate} />
        )}

        {currentPage === 'admin-dashboard' && (
          <AdminDashboard onNavigate={handleNavigate} />
        )}

        {currentPage === 'blog' && <BlogPage onNavigate={handleNavigate} />}

        {currentPage === 'blog-detail' && (
          <BlogDetailPage
            articleId={navParams.articleId || 'blog-1'}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'support' && <SupportPages />}

        {currentPage === 'auth' && (
          <AuthPage
            onNavigate={handleNavigate}
            initialTab={navParams.tab || 'login'}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <RealtimeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </RealtimeProvider>
  );
}
