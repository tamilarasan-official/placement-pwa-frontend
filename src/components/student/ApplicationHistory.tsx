import { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { Application } from '../../types';
import StatusBadge from '../common/StatusBadge';
import toast from 'react-hot-toast';
import { HiOutlineDocumentText } from 'react-icons/hi';
import EmptyState from '../ui/EmptyState';
import PageHeader from '../ui/PageHeader';
import Skeleton from '../ui/Skeleton';

const statusBorderColors: Record<string, string> = {
  APPLIED: 'border-l-blue-400',
  SHORTLISTED: 'border-l-yellow-400',
  INTERVIEWED: 'border-l-purple-400',
  SELECTED: 'border-l-green-400',
  REJECTED: 'border-l-red-400',
};

export default function ApplicationHistory() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentService.getApplications()
      .then((res) => { if (res.success) setApplications(res.applications); })
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton />;

  return (
    <div>
      <PageHeader title="My Applications" />
      {applications.length === 0 ? (
        <EmptyState
          icon={HiOutlineDocumentText}
          title="No Applications Yet"
          description="Apply to eligible drives to get started."
          color="blue"
        />
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 border-l-4 ${
                statusBorderColors[app.status] || 'border-l-gray-300'
              } p-4 flex items-center justify-between hover:shadow-md transition-all duration-200`}
            >
              <div>
                <h3 className="font-medium text-gray-900">
                  {app.company?.company_name || 'Unknown Company'}
                </h3>
                <p className="text-sm text-gray-500">{app.company?.role || ''}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Applied: {new Date(app.applied_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={app.status} />
                <div className="flex gap-1">
                  {['APPLIED', 'SHORTLISTED', 'INTERVIEWED', 'SELECTED'].map((step, i) => (
                    <div
                      key={step}
                      className={`h-1.5 w-7 rounded-full transition-all ${
                        ['APPLIED', 'SHORTLISTED', 'INTERVIEWED', 'SELECTED'].indexOf(app.status) >= i
                          ? app.status === 'REJECTED' ? 'bg-red-400' : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
