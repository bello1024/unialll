import React from 'react';
import { TrendingUp, BookOpen, Calendar, Trophy, Clock, Target } from 'lucide-react';
import type { Grade, ScheduleItem } from '../lib/supabase';

interface DashboardOverviewProps {
  grades: Grade[];
  schedule: ScheduleItem[];
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ grades, schedule }) => {
  // Calculs des statistiques
  const calculateAverage = () => {
    if (grades.length === 0) return 0;
    const totalPoints = grades.reduce((sum, grade) => sum + (grade.value * grade.coefficient), 0);
    const totalCoefficients = grades.reduce((sum, grade) => sum + grade.coefficient, 0);
    return totalPoints / totalCoefficients;
  };

  const average = calculateAverage();
  const todaySchedule = schedule.filter(item => {
    const today = new Date().toDateString();
    const itemDate = new Date(item.date + 'T00:00:00').toDateString();
    return today === itemDate;
  });

  const stats = [
    {
      title: 'Moyenne Générale',
      value: `${average.toFixed(1)}/20`,
      icon: Trophy,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Matières',
      value: new Set(grades.map(g => g.course?.name)).size.toString(),
      icon: BookOpen,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Cours Aujourd\'hui',
      value: todaySchedule.length.toString(),
      icon: Calendar,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Prochain Objectif',
      value: '16/20',
      icon: Target,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const getGradeColor = (grade: number) => {
    if (grade >= 16) return 'text-green-600 bg-green-100';
    if (grade >= 14) return 'text-blue-600 bg-blue-100';
    if (grade >= 12) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
        <p className="text-gray-600">Aperçu de vos performances académiques</p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${stat.bgColor} rounded-xl p-6 transition-transform hover:scale-105`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Récentes notes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Notes Récentes</h2>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-3">
            {grades.slice(0, 4).map((grade) => (
              <div key={grade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{grade.course?.name}</p>
                  <p className="text-sm text-gray-500">Coeff. {grade.coefficient}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(grade.value)}`}>
                  {grade.value}/20
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Emploi du temps du jour */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Aujourd'hui</h2>
            <Clock className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            {todaySchedule.length > 0 ? (
              todaySchedule.map((item) => (
                <div key={item.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.course?.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.start_time} - {item.end_time} • {item.room}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    item.type === 'cours' ? 'bg-blue-100 text-blue-800' :
                    item.type === 'td' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {item.type.toUpperCase()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Aucun cours aujourd'hui</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;