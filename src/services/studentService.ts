import api from './api';
import { StudentProfile, CompanyDrive, Application } from '../types';

export const studentService = {
  async getProfile(): Promise<{ success: boolean; profile: StudentProfile }> {
    const { data } = await api.get('/students/profile');
    return data;
  },

  async updateProfile(profile: Partial<StudentProfile>): Promise<{ success: boolean; message: string }> {
    const { data } = await api.put('/students/profile', profile);
    return data;
  },

  async uploadResume(file: File): Promise<{ success: boolean; resume_url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/students/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async getEligibleDrives(): Promise<{ success: boolean; drives: CompanyDrive[] }> {
    const { data } = await api.get('/students/eligible-drives');
    return data;
  },

  async getRecommendedDrives(): Promise<{ success: boolean; drives: CompanyDrive[] }> {
    const { data } = await api.get('/students/recommended-drives');
    return data;
  },

  async applyToDrive(companyId: string): Promise<{ success: boolean; message: string }> {
    const { data } = await api.post('/students/apply', { company_id: companyId });
    return data;
  },

  async getApplications(): Promise<{ success: boolean; applications: Application[] }> {
    const { data } = await api.get('/students/applications');
    return data;
  },
};
