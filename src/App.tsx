import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import CertificationStore from './components/CertificationStore';
import LoginForm from './components/LoginForm';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import AdminDashboard from './components/admin/AdminDashboard';

type AppView = 'landing' | 'certifications' | 'login' | 'dashboard';

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [currentView, setCurrentView] = React.useState<AppView>('landing');

  // Si l'utilisateur est authentifié, aller directement au dashboard
  if (isAuthenticated) {
    switch (user?.role) {
      case 'student':
        return <StudentDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <LoginForm />;
    }
  }

  // Si pas authentifié, gérer les vues publiques
  switch (currentView) {
    case 'landing':
      return (
        <LandingPage 
          onLogin={() => setCurrentView('login')}
          onViewCertifications={() => setCurrentView('certifications')}
        />
      );
    case 'certifications':
      return (
        <CertificationStore 
          onBack={() => setCurrentView('landing')}
          onLogin={() => setCurrentView('login')}
        />
      );
    case 'login':
      return <LoginForm />;
    default:
      return (
        <LandingPage 
          onLogin={() => setCurrentView('login')}
          onViewCertifications={() => setCurrentView('certifications')}
        />
      );
  }
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;