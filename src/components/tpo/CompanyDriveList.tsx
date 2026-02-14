import { useState, useEffect } from 'react';
import { companyService } from '../../services/companyService';
import { CompanyDrive } from '../../types';
import CompanyDriveForm from './CompanyDriveForm';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineOfficeBuilding } from 'react-icons/hi';
import PageHeader from '../ui/PageHeader';
import EmptyState from '../ui/EmptyState';
import Skeleton from '../ui/Skeleton';

export default function CompanyDriveList() {
  const [drives, setDrives] = useState<CompanyDrive[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDrive, setEditingDrive] = useState<CompanyDrive | null>(null);

  const fetchDrives = () => {
    setLoading(true);
    companyService.getAllCompanies()
      .then((res) => { if (res.success) setDrives(res.companies); })
      .catch(() => toast.error('Failed to load drives'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDrives(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this drive?')) return;
    try {
      await companyService.deleteCompany(id);
      toast.success('Drive deleted');
      fetchDrives();
    } catch {
      toast.error('Failed to delete drive');
    }
  };

  if (loading) return <Skeleton />;

  return (
    <div>
      <PageHeader
        title="Company Drives"
        action={
          <button
            onClick={() => { setEditingDrive(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm"
          >
            <HiOutlinePlus className="h-4 w-4" />
            New Drive
          </button>
        }
      />

      {drives.length === 0 ? (
        <EmptyState
          icon={HiOutlineOfficeBuilding}
          title="No Company Drives"
          description="Create a company drive to get started with placements."
          color="blue"
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Min GPA</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Backlogs</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {drives.map((drive, i) => (
                  <tr key={drive.id} className={`hover:bg-blue-50/40 transition-colors ${i % 2 === 1 ? 'bg-gray-50/30' : ''}`}>
                    <td className="py-3 px-4 font-medium text-gray-900">{drive.company_name}</td>
                    <td className="py-3 px-4 text-gray-600">{drive.role}</td>
                    <td className="py-3 px-4 text-gray-600">{drive.min_gpa}</td>
                    <td className="py-3 px-4 text-gray-600">{drive.allowed_backlogs}</td>
                    <td className="py-3 px-4 text-gray-600">{drive.drive_date || 'TBD'}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => { setEditingDrive(drive); setShowForm(true); }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <HiOutlinePencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(drive.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <HiOutlineTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <CompanyDriveForm
          drive={editingDrive}
          onClose={() => setShowForm(false)}
          onSaved={fetchDrives}
        />
      )}
    </div>
  );
}
