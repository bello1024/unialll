import { supabase } from '../lib/supabase'
import type { 
  Profile, 
  Grade, 
  Assignment, 
  Submission, 
  ScheduleItem, 
  Request, 
  Certification, 
  CertificationEnrollment, 
  LibraryDocument, 
  ChatMessage 
} from '../lib/supabase'

// Services d'authentification
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

// Services pour les notes
export const fetchStudentGrades = async (studentId: string): Promise<Grade[]> => {
  const { data, error } = await supabase
    .from('grades')
    .select(`
      *,
      course:courses(*)
    `)
    .eq('student_id', studentId)
    .order('date_obtained', { ascending: false })

  if (error) throw error
  return data || []
}

// Services pour l'emploi du temps
export const fetchScheduleByPromotion = async (promotion: string): Promise<ScheduleItem[]> => {
  const { data, error } = await supabase
    .from('schedule_items')
    .select(`
      *,
      course:courses(*, teacher:profiles(*))
    `)
    .eq('promotion', promotion)
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) throw error
  return data || []
}

// Services pour les devoirs
export const fetchAssignmentsByPromotion = async (promotion: string): Promise<Assignment[]> => {
  const { data, error } = await supabase
    .from('assignments')
    .select(`
      *,
      course:courses(*),
      teacher:profiles(*)
    `)
    .eq('promotion', promotion)
    .eq('status', 'active')
    .order('due_date', { ascending: true })

  if (error) throw error
  return data || []
}

export const fetchTeacherAssignments = async (teacherId: string): Promise<Assignment[]> => {
  const { data, error } = await supabase
    .from('assignments')
    .select(`
      *,
      course:courses(*)
    `)
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export const createAssignment = async (assignment: Omit<Assignment, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('assignments')
    .insert([assignment])
    .select()
    .single()

  if (error) throw error
  return data
}

// Services pour les soumissions
export const fetchSubmissionsByAssignment = async (assignmentId: string): Promise<Submission[]> => {
  const { data, error } = await supabase
    .from('submissions')
    .select(`
      *,
      student:profiles(*)
    `)
    .eq('assignment_id', assignmentId)
    .order('submitted_at', { ascending: false })

  if (error) throw error
  return data || []
}

export const submitAssignment = async (
  assignmentId: string,
  studentId: string,
  files: any[],
  comments?: string
) => {
  const { data, error } = await supabase
    .from('submissions')
    .insert([{
      assignment_id: assignmentId,
      student_id: studentId,
      files,
      comments
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

export const gradeSubmission = async (
  submissionId: string,
  grade: number,
  feedback?: string
) => {
  const { data, error } = await supabase
    .from('submissions')
    .update({
      grade,
      feedback,
      status: 'graded',
      graded_at: new Date().toISOString()
    })
    .eq('id', submissionId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Services pour les demandes
export const fetchStudentRequests = async (studentId: string): Promise<Request[]> => {
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export const fetchAllRequests = async (): Promise<Request[]> => {
  const { data, error } = await supabase
    .from('requests')
    .select(`
      *,
      student:profiles(*)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export const createRequest = async (
  studentId: string,
  type: string,
  subject: string,
  description: string
) => {
  const { data, error } = await supabase
    .from('requests')
    .insert([{
      student_id: studentId,
      type,
      subject,
      description
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateRequest = async (
  requestId: string,
  status: string,
  adminResponse?: string
) => {
  const { data, error } = await supabase
    .from('requests')
    .update({
      status,
      admin_response: adminResponse,
      updated_at: new Date().toISOString()
    })
    .eq('id', requestId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Services pour les certifications
export const fetchCertifications = async (): Promise<Certification[]> => {
  const { data, error } = await supabase
    .from('certifications')
    .select(`
      *,
      instructor:profiles(*)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export const fetchStudentCertificationEnrollments = async (studentId: string): Promise<CertificationEnrollment[]> => {
  const { data, error } = await supabase
    .from('certification_enrollments')
    .select(`
      *,
      certification:certifications(*, instructor:profiles(*))
    `)
    .eq('student_id', studentId)

  if (error) throw error
  return data || []
}

export const enrollInCertification = async (studentId: string, certificationId: string) => {
  const { data, error } = await supabase
    .from('certification_enrollments')
    .insert([{
      student_id: studentId,
      certification_id: certificationId
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

// Services pour la bibliothèque
export const fetchLibraryDocuments = async (): Promise<LibraryDocument[]> => {
  const { data, error } = await supabase
    .from('library_documents')
    .select(`
      *,
      author:profiles(*)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export const incrementDocumentDownloads = async (documentId: string) => {
  const { error } = await supabase.rpc('increment_downloads', {
    document_id: documentId
  })

  if (error) throw error
}

// Services pour le chat
export const fetchChatMessages = async (promotion: string): Promise<ChatMessage[]> => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select(`
      *,
      user:profiles(*)
    `)
    .eq('promotion', promotion)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data || []
}

export const sendChatMessage = async (
  userId: string,
  promotion: string,
  content: string
) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert([{
      user_id: userId,
      promotion,
      content
    }])
    .select(`
      *,
      user:profiles(*)
    `)
    .single()

  if (error) throw error
  return data
}

// Services pour les utilisateurs (admin)
export const fetchAllUsers = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export const createUser = async (userData: {
  email: string
  password: string
  full_name: string
  role: 'student' | 'teacher' | 'admin'
  promotion?: string
  department?: string
}) => {
  // Créer l'utilisateur dans auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: userData.email,
    password: userData.password,
    email_confirm: true
  })

  if (authError) throw authError

  // Mettre à jour le profil
  const { data, error } = await supabase
    .from('profiles')
    .update({
      full_name: userData.full_name,
      role: userData.role,
      promotion: userData.promotion,
      department: userData.department
    })
    .eq('id', authData.user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const resetUserPassword = async (userId: string) => {
  const { data, error } = await supabase.auth.admin.updateUserById(
    userId,
    { password: 'password123' }
  )

  if (error) throw error
  return 'password123'
}

// Fonction RPC pour incrémenter les téléchargements
export const createIncrementDownloadsFunction = async () => {
  const { error } = await supabase.rpc('create_increment_function')
  if (error) console.error('Error creating function:', error)
}