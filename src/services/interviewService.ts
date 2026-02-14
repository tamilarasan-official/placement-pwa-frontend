import api from './api';
import { Interview } from '../types';

export const interviewService = {
  async scheduleInterview(interview: {
    student_id: string;
    company_id: string;
    interview_date: string;
    interview_time: string;
    mode: string;
  }): Promise<{ success: boolean; id: string }> {
    const { data } = await api.post('/interviews', interview);
    return data;
  },

  async getAllInterviews(companyId?: string): Promise<{ success: boolean; interviews: Interview[] }> {
    const params = companyId ? `?company_id=${companyId}` : '';
    const { data } = await api.get(`/interviews${params}`);
    return data;
  },

  async getMyInterviews(): Promise<{ success: boolean; interviews: Interview[] }> {
    const { data } = await api.get('/interviews/me');
    return data;
  },
};
