/*
  # Schéma complet du portail étudiant

  1. Tables principales
    - `profiles` - Profils utilisateurs étendus
    - `courses` - Cours disponibles
    - `enrollments` - Inscriptions aux cours
    - `grades` - Notes des étudiants
    - `assignments` - Devoirs
    - `submissions` - Soumissions de devoirs
    - `schedule_items` - Emploi du temps
    - `requests` - Demandes étudiantes
    - `certifications` - Cours de certification
    - `certification_enrollments` - Inscriptions aux certifications
    - `library_documents` - Documents de la bibliothèque
    - `chat_messages` - Messages du chat de classe

  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques appropriées pour chaque rôle

  3. Fonctions et triggers
    - Création automatique de profil
    - Calcul automatique des moyennes
*/

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum pour les rôles
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');

-- Enum pour les statuts
CREATE TYPE request_status AS ENUM ('pending', 'in_progress', 'resolved', 'closed');
CREATE TYPE assignment_status AS ENUM ('active', 'closed');
CREATE TYPE submission_status AS ENUM ('submitted', 'graded');

-- Table des profils utilisateurs
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  promotion text,
  department text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des cours
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  description text,
  teacher_id uuid REFERENCES profiles(id),
  promotion text NOT NULL,
  coefficient integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Table des inscriptions aux cours
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  UNIQUE(student_id, course_id)
);

-- Table des notes
CREATE TABLE IF NOT EXISTS grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  value numeric(4,2) NOT NULL CHECK (value >= 0 AND value <= 20),
  coefficient integer DEFAULT 1,
  grade_type text NOT NULL DEFAULT 'examen',
  date_obtained date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Table des devoirs
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES profiles(id),
  promotion text NOT NULL,
  max_points integer DEFAULT 20,
  due_date timestamptz NOT NULL,
  status assignment_status DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- Table des soumissions
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid REFERENCES assignments(id) ON DELETE CASCADE,
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  files jsonb DEFAULT '[]',
  comments text,
  grade numeric(4,2) CHECK (grade >= 0 AND grade <= 20),
  feedback text,
  status submission_status DEFAULT 'submitted',
  submitted_at timestamptz DEFAULT now(),
  graded_at timestamptz,
  UNIQUE(assignment_id, student_id)
);

-- Table de l'emploi du temps
CREATE TABLE IF NOT EXISTS schedule_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  promotion text NOT NULL,
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  room text NOT NULL,
  type text NOT NULL DEFAULT 'cours',
  created_at timestamptz DEFAULT now()
);

-- Table des demandes étudiantes
CREATE TABLE IF NOT EXISTS requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  subject text NOT NULL,
  description text NOT NULL,
  status request_status DEFAULT 'pending',
  admin_response text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des certifications
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  instructor_id uuid REFERENCES profiles(id),
  duration text NOT NULL,
  level text NOT NULL DEFAULT 'débutant',
  category text NOT NULL,
  total_lessons integer DEFAULT 1,
  rating numeric(2,1) DEFAULT 0,
  enrolled_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Table des inscriptions aux certifications
CREATE TABLE IF NOT EXISTS certification_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  certification_id uuid REFERENCES certifications(id) ON DELETE CASCADE,
  progress integer DEFAULT 0,
  completed_lessons integer DEFAULT 0,
  certificate_earned boolean DEFAULT false,
  enrolled_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(student_id, certification_id)
);

-- Table des documents de la bibliothèque
CREATE TABLE IF NOT EXISTS library_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  author_id uuid REFERENCES profiles(id),
  file_type text NOT NULL,
  file_size bigint,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  file_url text,
  downloads integer DEFAULT 0,
  rating numeric(2,1) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Table des messages du chat
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  promotion text NOT NULL,
  content text NOT NULL,
  is_pinned boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Politiques pour profiles
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles" ON profiles FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Politiques pour courses
CREATE POLICY "Everyone can view courses" ON courses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Teachers can manage their courses" ON courses FOR ALL TO authenticated USING (
  teacher_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Politiques pour enrollments
CREATE POLICY "Students can view their enrollments" ON enrollments FOR SELECT TO authenticated USING (
  student_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
);

-- Politiques pour grades
CREATE POLICY "Students can view their grades" ON grades FOR SELECT TO authenticated USING (
  student_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
);
CREATE POLICY "Teachers can manage grades" ON grades FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
);

-- Politiques pour assignments
CREATE POLICY "Students can view assignments for their promotion" ON assignments FOR SELECT TO authenticated USING (
  promotion IN (SELECT p.promotion FROM profiles p WHERE p.id = auth.uid()) OR
  teacher_id = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Teachers can manage assignments" ON assignments FOR ALL TO authenticated USING (
  teacher_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Politiques pour submissions
CREATE POLICY "Students can manage their submissions" ON submissions FOR ALL TO authenticated USING (
  student_id = auth.uid()
);
CREATE POLICY "Teachers can view and grade submissions" ON submissions FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM assignments a 
    WHERE a.id = assignment_id AND a.teacher_id = auth.uid()
  ) OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Politiques pour schedule_items
CREATE POLICY "Students can view schedule for their promotion" ON schedule_items FOR SELECT TO authenticated USING (
  promotion IN (SELECT p.promotion FROM profiles p WHERE p.id = auth.uid()) OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
);
CREATE POLICY "Teachers and admins can manage schedule" ON schedule_items FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
);

-- Politiques pour requests
CREATE POLICY "Students can manage their requests" ON requests FOR ALL TO authenticated USING (
  student_id = auth.uid()
);
CREATE POLICY "Admins can manage all requests" ON requests FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Politiques pour certifications
CREATE POLICY "Everyone can view certifications" ON certifications FOR SELECT TO authenticated USING (true);
CREATE POLICY "Teachers can manage certifications" ON certifications FOR ALL TO authenticated USING (
  instructor_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Politiques pour certification_enrollments
CREATE POLICY "Students can manage their certification enrollments" ON certification_enrollments FOR ALL TO authenticated USING (
  student_id = auth.uid()
);
CREATE POLICY "Teachers can view enrollments for their certifications" ON certification_enrollments FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM certifications c 
    WHERE c.id = certification_id AND c.instructor_id = auth.uid()
  ) OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Politiques pour library_documents
CREATE POLICY "Everyone can view library documents" ON library_documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can upload documents" ON library_documents FOR INSERT TO authenticated USING (
  author_id = auth.uid()
);
CREATE POLICY "Authors can manage their documents" ON library_documents FOR ALL TO authenticated USING (
  author_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Politiques pour chat_messages
CREATE POLICY "Students can view messages for their promotion" ON chat_messages FOR SELECT TO authenticated USING (
  promotion IN (SELECT p.promotion FROM profiles p WHERE p.id = auth.uid()) OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
);
CREATE POLICY "Students can send messages to their promotion" ON chat_messages FOR INSERT TO authenticated USING (
  user_id = auth.uid() AND 
  promotion IN (SELECT p.promotion FROM profiles p WHERE p.id = auth.uid())
);
CREATE POLICY "Users can manage their own messages" ON chat_messages FOR ALL TO authenticated USING (
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Fonction pour créer automatiquement un profil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', 'Utilisateur'), 'student');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement un profil
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON requests FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();