import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle, XCircle, Filter, TrendingDown } from 'lucide-react';
import { fetchStudentAbsences, AbsenceRecord } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const AbsencesSection: React.FC = () => {
  const { user, token } = useAuth();
  const [absences, setAbsences] = useState<AbsenceRecord[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'excused' | 'unexcused' | 'late'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAbsences = async () => {
      if (user && token) {
        setIsLoading(true);
        try {
          const data = await fetchStudentAbsences(user.id, token);
          setAbsences(data);
        } catch (error) {
          console.error('Erreur lors du chargement des absences:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadAbsences();
  }, [user, token]);

  const filteredAbsences = absences.filter(absence => {
    switch (selectedFilter) {
      case 'excused':
        return absence.isExcused;
      case 'unexcused':
        return !absence.isExcused;
      case 'late':
        return absence.isLate;
      default:
        return true;
    }
  });

  const getAbsenceStats = () => {
    const total = absences.length;
    const excused = absences.filter(a => a.isExcused).length;
    const unexcused = absences.filter(a => !a.isExcused).length;
    const late = absences.filter(a => a.isLate).length;
    return { total, excused, unexcused, late };
  };

  const stats = getAbsenceStats();

  const getAbsenceColor = (absence: AbsenceRecord) => {
    if (absence.isLate) return 'border-orange-200 bg-orange-50';
    if (absence.isExcused) return 'border-blue-200 bg-blue-50';
    return 'border-red-200 bg-red-50';
  };

  const getAbsenceIcon = (absence: AbsenceRecord) => {
    if (absence.isLate) return AlertTriangle;
    if (absence.isExcused) return CheckCircle;
    return XCircle;
  };

  const getAbsenceIconColor = (absence: AbsenceRecord) => {
    if (absence.isLate) return 'text-orange-600';
    if (absence.isExcused) return 'text-blue-600';
    return 'text-red-600';
  };

  const filters = [
    { key: 'all', label: 'Toutes', count: stats.total },
    { key: 'unexcused', label: 'Non justifiées', count: stats.unexcused },
    { key: 'excused', label: 'Justifiées', count: stats.excused },
    { key: 'late', label: 'Retards', count: stats.late },
  ] as const;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Absences</h1>
        <p className="text-gray-600">Suivi de votre assiduité et de vos retards</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-100">Total absences</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-gray-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Non justifiées</p>
              <p className="text-3xl font-bold">{stats.unexcused}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Justifiées</p>
              <p className="text-3xl font-bold">{stats.excused}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Retards</p>
              <p className="text-3xl font-bold">{stats.late}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="font-medium text-gray-700">Filtrer par:</span>
          </div>
          <div className="flex space-x-2">
            {filters.map(filter => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedFilter === filter.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Liste des absences */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Historique des Absences</h2>
        </div>
        
        {filteredAbsences.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredAbsences.map((absence) => {
              const Icon = getAbsenceIcon(absence);
              const iconColor = getAbsenceIconColor(absence);
              
              return (
                <div key={absence.id} className={`p-6 ${getAbsenceColor(absence)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg bg-white`}>
                        <Icon className={`h-6 w-6 ${iconColor}`} />
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900">{absence.courseName}</h3>
                        <p className="text-sm text-gray-600">Enseignant: {absence.teacherName}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(absence.date).toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {absence.startTime} - {absence.endTime}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        absence.isLate ? 'bg-orange-100 text-orange-800' :
                        absence.isExcused ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {absence.isLate ? 'Retard' : absence.isExcused ? 'Justifiée' : 'Non justifiée'}
                      </span>
                      
                      {absence.reason && (
                        <p className="text-sm text-gray-600 mt-2">
                          Motif: {absence.reason}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Aucune absence</h3>
            <p className="text-gray-600">
              {selectedFilter === 'all' 
                ? 'Félicitations ! Vous n\'avez aucune absence enregistrée.'
                : 'Aucune absence ne correspond à ce filtre.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AbsencesSection;