import React, { useState, useEffect } from 'react';
import { Users, Clock, CheckCircle, XCircle, AlertCircle, Send, Calendar, User } from 'lucide-react';
import { fetchStudentsByPromotion, submitAttendance, Student, AttendanceRecord, AttendanceEntry, ScheduleItem } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface AttendanceSectionProps {
  schedule: ScheduleItem[];
}

const AttendanceSection: React.FC<AttendanceSectionProps> = ({ schedule }) => {
  const { user, token } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<ScheduleItem | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Filtrer les cours d'aujourd'hui pour cet enseignant
  const todaysCourses = schedule.filter(item => {
    const today = new Date().toISOString().split('T')[0];
    return item.date === today;
  });

  useEffect(() => {
    const loadStudents = async () => {
      if (selectedCourse && token) {
        setIsLoading(true);
        try {
          const studentsData = await fetchStudentsByPromotion(selectedCourse.promotion, token);
          setStudents(studentsData);
          
          // Initialiser l'appel avec tous les étudiants présents par défaut
          const initialAttendance: AttendanceEntry[] = studentsData.map(student => ({
            studentId: student.id,
            studentName: student.name,
            isPresent: true,
            isLate: false,
            notes: ''
          }));
          setAttendance(initialAttendance);
        } catch (error) {
          console.error('Erreur lors du chargement des étudiants:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadStudents();
  }, [selectedCourse, token]);

  const updateAttendance = (studentId: string, field: 'isPresent' | 'isLate', value: boolean) => {
    setAttendance(prev => prev.map(entry => 
      entry.studentId === studentId 
        ? { ...entry, [field]: value }
        : entry
    ));
  };

  const updateNotes = (studentId: string, notes: string) => {
    setAttendance(prev => prev.map(entry => 
      entry.studentId === studentId 
        ? { ...entry, notes }
        : entry
    ));
  };

  const handleSubmitAttendance = async () => {
    if (!selectedCourse) return;

    setIsSubmitting(true);
    try {
      const attendanceRecord: Omit<AttendanceRecord, 'id'> = {
        courseId: selectedCourse.id,
        courseName: selectedCourse.cours,
        teacherId: user!.id,
        teacherName: user!.name,
        date: selectedCourse.date,
        startTime: selectedCourse.heureDebut,
        endTime: selectedCourse.heureFin,
        promotion: selectedCourse.promotion,
        students: attendance,
        isSubmitted: true,
        submittedAt: new Date().toISOString()
      };

      await submitAttendance(attendanceRecord, token!);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
      
      // Réinitialiser la sélection
      setSelectedCourse(null);
      setAttendance([]);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAttendanceStats = () => {
    const present = attendance.filter(entry => entry.isPresent).length;
    const absent = attendance.filter(entry => !entry.isPresent).length;
    const late = attendance.filter(entry => entry.isLate).length;
    return { present, absent, late };
  };

  const stats = getAttendanceStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Présences</h1>
        <p className="text-gray-600">Effectuez l'appel pour vos cours d'aujourd'hui</p>
      </div>

      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Appel soumis avec succès à l'administration !
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sélection du cours */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cours d'Aujourd'hui</h2>
          
          {todaysCourses.length > 0 ? (
            <div className="space-y-3">
              {todaysCourses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedCourse?.id === course.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{course.cours}</p>
                      <p className="text-sm text-gray-600">
                        {course.heureDebut} - {course.heureFin} • {course.salle}
                      </p>
                      <p className="text-sm text-gray-500">{course.promotion}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Aucun cours aujourd'hui</p>
            </div>
          )}
        </div>

        {/* Statistiques de présence */}
        {selectedCourse && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">Présents</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{stats.present}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-900">Absents</span>
                </div>
                <span className="text-2xl font-bold text-red-600">{stats.absent}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <span className="font-medium text-orange-900">En retard</span>
                </div>
                <span className="text-2xl font-bold text-orange-600">{stats.late}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Taux de présence</p>
                <div className="text-3xl font-bold text-gray-900">
                  {attendance.length > 0 ? Math.round((stats.present / attendance.length) * 100) : 0}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions rapides */}
        {selectedCourse && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h2>
            
            <div className="space-y-3">
              <button
                onClick={() => setAttendance(prev => prev.map(entry => ({ ...entry, isPresent: true, isLate: false })))}
                className="w-full bg-green-100 text-green-800 py-2 px-4 rounded-lg font-medium hover:bg-green-200 transition-colors"
              >
                Marquer tous présents
              </button>
              
              <button
                onClick={() => setAttendance(prev => prev.map(entry => ({ ...entry, isPresent: false, isLate: false })))}
                className="w-full bg-red-100 text-red-800 py-2 px-4 rounded-lg font-medium hover:bg-red-200 transition-colors"
              >
                Marquer tous absents
              </button>
              
              <button
                onClick={handleSubmitAttendance}
                disabled={isSubmitting || !selectedCourse}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Soumission...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Soumettre l'Appel
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Liste des étudiants pour l'appel */}
      {selectedCourse && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Appel - {selectedCourse.cours}
            </h2>
            <div className="text-sm text-gray-600">
              {selectedCourse.heureDebut} - {selectedCourse.heureFin} • {selectedCourse.salle}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-3" />
              <p className="text-gray-500">Chargement des étudiants...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map((student) => {
                const studentAttendance = attendance.find(entry => entry.studentId === student.id);
                
                return (
                  <div
                    key={student.id}
                    className={`border-2 rounded-lg p-4 transition-all ${
                      studentAttendance?.isPresent
                        ? studentAttendance.isLate
                          ? 'border-orange-300 bg-orange-50'
                          : 'border-green-300 bg-green-50'
                        : 'border-red-300 bg-red-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={student.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'}
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Statut de présence */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateAttendance(student.id, 'isPresent', true)}
                          className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                            studentAttendance?.isPresent
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                          }`}
                        >
                          <CheckCircle className="h-4 w-4 mx-auto" />
                        </button>
                        
                        <button
                          onClick={() => updateAttendance(student.id, 'isPresent', false)}
                          className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                            !studentAttendance?.isPresent
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                          }`}
                        >
                          <XCircle className="h-4 w-4 mx-auto" />
                        </button>
                      </div>

                      {/* Option retard */}
                      {studentAttendance?.isPresent && (
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={studentAttendance.isLate || false}
                            onChange={(e) => updateAttendance(student.id, 'isLate', e.target.checked)}
                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">En retard</span>
                        </label>
                      )}

                      {/* Notes */}
                      <input
                        type="text"
                        value={studentAttendance?.notes || ''}
                        onChange={(e) => updateNotes(student.id, e.target.value)}
                        className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Notes (optionnel)"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {!selectedCourse && (
        <div className="text-center py-12">
          <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Sélectionnez un cours</h3>
          <p className="text-gray-600">Choisissez un cours dans la liste ci-dessus pour commencer l'appel</p>
        </div>
      )}
    </div>
  );
};

export default AttendanceSection;