import api from './api';
import { Analytics, Notification, StudentProfile, Application } from '../types';

export const analyticsService = {
  async getAnalytics(): Promise<{ success: boolean; analytics: Analytics }> {
    const { data } = await api.get('/analytics');
    return data;
  },

  async getNotifications(): Promise<{ success: boolean; notifications: Notification[]; unread_count: number }> {
    const { data } = await api.get('/notifications');
    return data;
  },

  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    const { data } = await api.put(`/notifications/${id}/read`);
    return data;
  },

  async getAllStudents(): Promise<{ success: boolean; students: StudentProfile[] }> {
    const { data } = await api.get('/students');
    return data;
  },

  async getAllApplications(): Promise<{ success: boolean; applications: Application[] }> {
    const { data } = await api.get('/applications');
    return data;
  },
};
