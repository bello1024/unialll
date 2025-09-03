export interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  course: string;
  description: string;
}

export interface Absence {
  id: string;
  date: string;
  course: string;
  justified: boolean;
  reason?: string;
}

export interface Note {
  id: string;
  subject: string;
  grade: number;
  maxGrade: number;
  date: string;
  teacher: string;
  comment?: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  day: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  promotion?: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

export interface Request {
  id: string;
  studentId: string;
  studentName: string;
  type: 'absence' | 'grade_review' | 'schedule_change' | 'other';
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface AbsenceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  course: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  promotion: string;
  photo?: string;
}

export interface AttendanceEntry {
  studentId: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  courseId: string;
  courseName: string;
  date: string;
  teacherId: string;
  entries: AttendanceEntry[];
  submittedAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  content: string;
  grade?: number;
  feedback?: string;
  status: 'submitted' | 'graded' | 'late';
}

// Fonction pour récupérer les absences d'un étudiant
export const fetchStudentAbsences = async (studentId: string): Promise<Absence[]> => {
  // Simuler un appel API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          date: '2023-09-01',
          course: 'Mathématiques',
          justified: true,
          reason: 'Maladie'
        },
        {
          id: '2',
          date: '2023-09-05',
          course: 'Physique',
          justified: false
        }
      ]);
    }, 1000);
  });
};

// Fonction pour récupérer les notes d'un étudiant
export const fetchNotes = async (studentId: string): Promise<Note[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          subject: 'Mathématiques',
          grade: 16,
          maxGrade: 20,
          date: '2023-09-10',
          teacher: 'Prof. Martin',
          comment: 'Excellent travail'
        },
        {
          id: '2',
          subject: 'Physique',
          grade: 14,
          maxGrade: 20,
          date: '2023-09-12',
          teacher: 'Prof. Dubois'
        }
      ]);
    }, 1000);
  });
};

// Fonction pour récupérer l'emploi du temps
export const fetchSchedule = async (studentId: string): Promise<ScheduleItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          time: '08:00 - 10:00',
          subject: 'Mathématiques',
          teacher: 'Prof. Martin',
          room: 'Salle 101',
          day: 'Lundi'
        },
        {
          id: '2',
          time: '10:15 - 12:15',
          subject: 'Physique',
          teacher: 'Prof. Dubois',
          room: 'Salle 203',
          day: 'Lundi'
        }
      ]);
    }, 1000);
  });
};

// Fonction pour récupérer tous les utilisateurs (Admin)
export const fetchAllUsers = async (): Promise<UserAccount[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          name: 'Jean Dupont',
          email: 'jean.dupont@supptic.com',
          role: 'student',
          promotion: 'L3 Informatique',
          createdAt: '2023-09-01',
          status: 'active'
        },
        {
          id: '2',
          name: 'Marie Martin',
          email: 'marie.martin@supptic.com',
          role: 'teacher',
          createdAt: '2023-08-15',
          status: 'active'
        }
      ]);
    }, 1000);
  });
};

// Fonction pour créer un utilisateur
export const createUser = async (userData: Omit<UserAccount, 'id' | 'createdAt'>): Promise<UserAccount> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...userData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString()
      });
    }, 1000);
  });
};

// Fonction pour réinitialiser le mot de passe
export const resetPassword = async (email: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};

// Fonction pour récupérer toutes les demandes (Admin)
export const fetchAllRequests = async (): Promise<Request[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          studentId: '1',
          studentName: 'Jean Dupont',
          type: 'absence',
          title: 'Justification d\'absence',
          description: 'Absence pour raisons médicales',
          status: 'pending',
          submittedAt: '2023-09-15T10:00:00Z'
        }
      ]);
    }, 1000);
  });
};

// Fonction pour mettre à jour le statut d'une demande
export const updateRequestStatus = async (requestId: string, status: 'approved' | 'rejected'): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};

// Fonction pour soumettre une demande (Étudiant)
export const submitRequest = async (request: Omit<Request, 'id' | 'submittedAt' | 'status'>): Promise<Request> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...request,
        id: Math.random().toString(36).substr(2, 9),
        status: 'pending',
        submittedAt: new Date().toISOString()
      });
    }, 1000);
  });
};

// Fonction pour récupérer les devoirs (Étudiant)
export const fetchAssignments = async (studentId: string): Promise<Assignment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          title: 'Devoir de mathématiques',
          dueDate: '2023-09-25',
          status: 'pending',
          course: 'Mathématiques',
          description: 'Exercices sur les dérivées'
        }
      ]);
    }, 1000);
  });
};

// Fonction pour soumettre un devoir
export const submitAssignment = async (assignmentId: string, content: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};

// Fonction pour récupérer les devoirs d'un enseignant
export const fetchTeacherAssignments = async (teacherId: string): Promise<Assignment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          title: 'Devoir de mathématiques',
          dueDate: '2023-09-25',
          status: 'pending',
          course: 'Mathématiques',
          description: 'Exercices sur les dérivées'
        }
      ]);
    }, 1000);
  });
};

// Fonction pour récupérer les soumissions d'un devoir
export const fetchSubmissions = async (assignmentId: string): Promise<Submission[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          assignmentId,
          studentId: '1',
          studentName: 'Jean Dupont',
          submittedAt: '2023-09-20T14:30:00Z',
          content: 'Contenu du devoir soumis...',
          status: 'submitted'
        }
      ]);
    }, 1000);
  });
};

// Fonction pour noter une soumission
export const gradeSubmission = async (submissionId: string, grade: number, feedback: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};

// Fonction pour récupérer les étudiants par promotion
export const fetchStudentsByPromotion = async (promotion: string): Promise<Student[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          name: 'Jean Dupont',
          email: 'jean.dupont@supptic.com',
          promotion: 'L3 Informatique',
          photo: '/profile.jpg'
        },
        {
          id: '2',
          name: 'Marie Durand',
          email: 'marie.durand@supptic.com',
          promotion: 'L3 Informatique',
          photo: '/profile.jpg'
        },
        {
          id: '3',
          name: 'Pierre Martin',
          email: 'pierre.martin@supptic.com',
          promotion: 'L3 Informatique',
          photo: '/profile.jpg'
        }
      ]);
    }, 1000);
  });
};

// Fonction pour soumettre l'appel
export const submitAttendance = async (attendanceData: Omit<AttendanceRecord, 'id' | 'submittedAt'>): Promise<AttendanceRecord> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...attendanceData,
        id: Math.random().toString(36).substr(2, 9),
        submittedAt: new Date().toISOString()
      });
    }, 1000);
  });
};

export const fetchStudentAssignments = async (studentId: string): Promise<Assignment[]> => {
  // Simulation d'un appel API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          title: 'Devoir de mathématiques',
          dueDate: '2023-09-15',
          status: 'pending',
          course: 'Mathématiques',
          description: 'Exercices sur les dérivées'
        },
        {
          id: '2',
          title: 'Projet de physique',
          dueDate: '2023-09-20',
          status: 'completed',
          course: 'Physique',
          description: 'Rapport sur les ondes électromagnétiques'
        }
      ]);
    }, 1000);
  });
};