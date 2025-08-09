import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour TypeScript
export interface Profile {
  id: string
  email: string
  full_name: string
  role: 'student' | 'teacher' | 'admin'
  promotion?: string
  department?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  name: string
  code: string
  description?: string
  teacher_id: string
  promotion: string
  coefficient: number
  created_at: string
  teacher?: Profile
}

export interface Grade {
  id: string
  student_id: string
  course_id: string
  value: number
  coefficient: number
  grade_type: string
  date_obtained: string
  created_at: string
  course?: Course
}

export interface Assignment {
  id: string
  title: string
  description: string
  course_id: string
  teacher_id: string
  promotion: string
  max_points: number
  due_date: string
  status: 'active' | 'closed'
  created_at: string
  course?: Course
  teacher?: Profile
}

export interface Submission {
  id: string
  assignment_id: string
  student_id: string
  files: any[]
  comments?: string
  grade?: number
  feedback?: string
  status: 'submitted' | 'graded'
  submitted_at: string
  graded_at?: string
  student?: Profile
  assignment?: Assignment
}

export interface ScheduleItem {
  id: string
  course_id: string
  promotion: string
  date: string
  start_time: string
  end_time: string
  room: string
  type: string
  created_at: string
  course?: Course
}

export interface Request {
  id: string
  student_id: string
  type: string
  subject: string
  description: string
  status: 'pending' | 'in_progress' | 'resolved' | 'closed'
  admin_response?: string
  created_at: string
  updated_at: string
  student?: Profile
}

export interface Certification {
  id: string
  title: string
  description: string
  instructor_id: string
  duration: string
  level: string
  category: string
  total_lessons: number
  rating: number
  enrolled_count: number
  created_at: string
  instructor?: Profile
}

export interface CertificationEnrollment {
  id: string
  student_id: string
  certification_id: string
  progress: number
  completed_lessons: number
  certificate_earned: boolean
  enrolled_at: string
  completed_at?: string
  certification?: Certification
}

export interface LibraryDocument {
  id: string
  title: string
  description?: string
  author_id: string
  file_type: string
  file_size: number
  category: string
  tags: string[]
  file_url?: string
  downloads: number
  rating: number
  created_at: string
  author?: Profile
}

export interface ChatMessage {
  id: string
  user_id: string
  promotion: string
  content: string
  is_pinned: boolean
  created_at: string
  user?: Profile
}