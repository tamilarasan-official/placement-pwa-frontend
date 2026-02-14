import api from './api';
import { PendingStudent, RecruiterAccount } from '../types';

export const tpoService = {
  async getPendingStudents(): Promise<{ success: boolean; students: PendingStudent[] }> {
    const { data } = await api.get('/tpo/pending-students');
    return data;
  },

  async approveStudent(id: string): Promise<{ success: boolean; message: string }> {
    const { data } = await api.put(`/tpo/students/${id}/approve`);
    return data;
  },

  async rejectStudent(id: string): Promise<{ success: boolean; message: string }> {
    const { data } = await api.put(`/tpo/students/${id}/reject`);
    return data;
  },

  async getRecruiters(): Promise<{ success: boolean; recruiters: RecruiterAccount[] }> {
    const { data } = await api.get('/tpo/recruiters');
    return data;
  },
};
