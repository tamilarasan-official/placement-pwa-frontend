import { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { companyService } from '../../services/companyService';
import { Application } from '../../types';
import StatusBadge from '../common/StatusBadge';
import toast from 'react-hot-toast';
import PageHeader from '../ui/PageHeader';
import Skeleton from '../ui/Skeleton';

export default function PlacementTracker() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const fetchApplications = () => {
    setLoading(true);
    analyticsService.getAllApplications()
      .then((res) => { if (res.success) setApplications(res.applications); })
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchApplications(); }, []);

  const handleStatusUpdate = async (appId: string, newStatus: string) => {
    try {
      await companyService.updateApplicationStatus(appId, newStatus);
      toast.success('Status updated');
      fetchApplications();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filtered = filter === 'ALL'
    ? applications
    : applications.filter((a) => a.status === filter);

  if (loading) return <Skeleton />;

  return (
    <div>
      <PageHeader
        title="Placement Tracker"
        action={
          <div className="flex gap-2 flex-wrap">
            {['ALL', 'APPLIED', 'SHORTLISTED', 'INTERVIEWED', 'SELECTED', 'REJECTED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filter === status
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        }
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((app, i) => (
                <tr key={app.id} className={`hover:bg-blue-50/40 transition-colors ${i % 2 === 1 ? 'bg-gray-50/30' : ''}`}>
                  <td className="py-3 px-4 font-medium text-gray-900">{app.student?.name || 'N/A'}</td>
                  <td className="py-3 px-4 text-gray-600">{app.company?.company_name || 'N/A'}</td>
                  <td className="py-3 px-4"><StatusBadge status={app.status} /></td>
                  <td className="py-3 px-4 text-gray-500 text-sm">
                    {new Date(app.applied_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <select
                      value=""
                      onChange={(e) => e.target.value && handleStatusUpdate(app.id, e.target.value)}
                      className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="">Update Status</option>
                      {app.status === 'APPLIED' && <option value="SHORTLISTED">Shortlist</option>}
                      {app.status === 'SHORTLISTED' && <option value="INTERVIEWED">Interviewed</option>}
                      {app.status === 'INTERVIEWED' && <option value="SELECTED">Select</option>}
                      {['APPLIED', 'SHORTLISTED', 'INTERVIEWED'].includes(app.status) && (
                        <option value="REJECTED">Reject</option>
                      )}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">No applications found</div>
        )}
      </div>
    </div>
  );
}
