import React, { useState, useEffect } from 'react';
import { fetchNotes, fetchSchedule, Note, ScheduleItem } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import StudentSidebar from './student/StudentSidebar';
import DashboardOverview from './DashboardOverview';
import NotesSection from './NotesSection';
import ScheduleSection from './ScheduleSection';
import AssignmentsSection from './student/AssignmentsSection';
import RequestsSection from './student/RequestsSection';
import NotificationsSection from './student/NotificationsSection';
import LibrarySection from './student/LibrarySection';
import CertificationsSection from './student/CertificationsSection';
import RequestsSection from './student/RequestsSection';
import ChatBot from './shared/ChatBot';
import { Loader2 } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (user && token) {
        setIsLoading(true);
        try {
          const [notesData, scheduleData] = await Promise.all([
            fetchNotes(user.id, token),
            fetchSchedule(user.promotion, token)
          ]);
          setNotes(notesData);
          setSchedule(scheduleData);
        } catch (error) {
          console.error('Erreur lors du chargement des données:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadData();
  }, [user, token]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      );
    }

    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview notes={notes} schedule={schedule} />;
      case 'notes':
        return <NotesSection notes={notes} />;
      case 'schedule':
        return <ScheduleSection schedule={schedule} />;
      case 'assignments':
        return <AssignmentsSection />;
      case 'requests':
        return <RequestsSection />;
      case 'notifications':
        return <NotificationsSection />;
      case 'library':
        return <LibrarySection />;
      case 'certifications':
        return <CertificationsSection />;
      case 'requests':
        return <RequestsSection />;
      case 'stats':
        return (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-4">Statistiques détaillées</h2>
            <p className="text-gray-600">Cette section sera bientôt disponible.</p>
          </div>
        );
      case 'profile':
        return (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-4">Mon Profil</h2>
            <p className="text-gray-600">Cette section sera bientôt disponible.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-4">Paramètres</h2>
            <p className="text-gray-600">Cette section sera bientôt disponible.</p>
          </div>
        );
      default:
        return <DashboardOverview notes={notes} schedule={schedule} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <StudentSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
      <ChatBot />
    </div>
  );
};

export default StudentDashboard;