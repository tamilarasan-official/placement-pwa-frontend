export type UserRole = 'student' | 'tpo' | 'recruiter';

export type UserStatus = 'pending_approval' | 'active' | 'rejected';

export type PlacementStatus = 'NOT_APPLIED' | 'APPLIED' | 'SHORTLISTED' | 'INTERVIEWED' | 'SELECTED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  assigned_drives?: string[];
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
  message?: string;
  status?: UserStatus;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  name: string;
  department: string;
  roll_number: string;
  gpa: number;
  backlogs: number;
  skills: string[];
  resume_url: string;
  github: string;
  linkedin: string;
  portfolio: string;
  placement_status: PlacementStatus;
}

export interface CompanyDrive {
  id: string;
  company_name: string;
  role: string;
  min_gpa: number;
  allowed_backlogs: number;
  required_skills: string[];
  drive_date: string;
  recruiter_id?: string;
  created_by?: string;
  already_applied?: boolean;
  recommendation_score?: number;
}

export interface CreateDriveRequest {
  company_name: string;
  role: string;
  min_gpa: number;
  allowed_backlogs: number;
  required_skills: string[];
  drive_date: string;
  recruiter_name?: string;
  recruiter_email?: string;
  recruiter_password?: string;
  existing_recruiter_id?: string;
}

export interface RecruiterAccount {
  id: string;
  name: string;
  email: string;
  assigned_drives: string[];
  created_at: string;
}

export interface PendingStudent {
  id: string;
  name: string;
  email: string;
  department: string;
  roll_number: string;
  status: UserStatus;
  created_at: string;
}

export interface Application {
  id: string;
  student_id: string;
  company_id: string;
  status: PlacementStatus;
  applied_at: string;
  company?: CompanyDrive;
  student?: StudentProfile;
}

export interface Interview {
  id: string;
  student_id: string;
  company_id: string;
  interview_date: string;
  interview_time: string;
  mode: 'online' | 'offline';
  company?: CompanyDrive;
  student?: StudentProfile;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

export interface Analytics {
  total_students: number;
  total_companies: number;
  total_applications: number;
  placed_students: number;
  placement_percentage: number;
  status_distribution: Record<string, number>;
  department_stats: { department: string; count: number }[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  error?: string;
  message?: string;
  data?: T;
}
