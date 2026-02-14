import api from './api';
import { CompanyDrive, StudentProfile, Application } from '../types';

export const companyService = {
  async createCompany(company: Partial<CompanyDrive>): Promise<{ success: boolean; id: string }> {
    const { data } = await api.post('/companies', company);
    return data;
  },

  async getAllCompanies(): Promise<{ success: boolean; companies: CompanyDrive[] }> {
    const { data } = await api.get('/companies');
    return data;
  },

  async getCompany(id: string): Promise<{ success: boolean; company: CompanyDrive }> {
    const { data } = await api.get(`/companies/${id}`);
    return data;
  },

  async updateCompany(id: string, company: Partial<CompanyDrive>): Promise<{ success: boolean }> {
    const { data } = await api.put(`/companies/${id}`, company);
    return data;
  },

  async deleteCompany(id: string): Promise<{ success: boolean }> {
    const { data } = await api.delete(`/companies/${id}`);
    return data;
  },

  async getEligibleStudents(companyId: string): Promise<{ success: boolean; students: StudentProfile[] }> {
    const { data } = await api.get(`/companies/${companyId}/eligible-students`);
    return data;
  },

  async getDriveApplications(companyId: string): Promise<{ success: boolean; applications: Application[] }> {
    const { data } = await api.get(`/companies/${companyId}/applications`);
    return data;
  },

  async updateApplicationStatus(appId: string, status: string): Promise<{ success: boolean }> {
    const { data } = await api.put(`/applications/${appId}/status`, { status });
    return data;
  },
};
