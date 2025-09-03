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

// Autres fonctions d'API...
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