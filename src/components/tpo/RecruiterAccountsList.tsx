import { useState, useEffect } from 'react';
import { tpoService } from '../../services/tpoService';
import { RecruiterAccount } from '../../types';
import toast from 'react-hot-toast';
import { HiOutlineUserGroup } from 'react-icons/hi';
import PageHeader from '../ui/PageHeader';
import EmptyState from '../ui/EmptyState';
import LoadingSpinner from '../common/LoadingSpinner';

export default function RecruiterAccountsList() {
  const [recruiters, setRecruiters] = useState<RecruiterAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        const res = await tpoService.getRecruiters();
        if (res.success) {
          setRecruiters(res.recruiters);
        }
      } catch {
        toast.error('Failed to load recruiters');
      } finally {
        setLoading(false);
      }
    };
    fetchRecruiters();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="Recruiter Accounts"
        subtitle={`${recruiters.length} recruiter account${recruiters.length !== 1 ? 's' : ''} created`}
      />

      {recruiters.length === 0 ? (
        <EmptyState
          icon={HiOutlineUserGroup}
          title="No Recruiter Accounts"
          description="Recruiter accounts are created when you add a company drive."
          color="blue"
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned Drives</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recruiters.map((recruiter, i) => (
                  <tr key={recruiter.id} className={`hover:bg-blue-50/40 transition-colors ${i % 2 === 1 ? 'bg-gray-50/30' : ''}`}>
                    <td className="px-5 py-3 text-sm font-medium text-gray-900">{recruiter.name}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">{recruiter.email}</td>
                    <td className="px-5 py-3 text-sm">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        {recruiter.assigned_drives?.length || 0} drive{(recruiter.assigned_drives?.length || 0) !== 1 ? 's' : ''}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
