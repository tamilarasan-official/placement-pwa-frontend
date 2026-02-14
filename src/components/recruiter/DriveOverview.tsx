import { useState, useEffect } from 'react';
import { companyService } from '../../services/companyService';
import { CompanyDrive } from '../../types';
import toast from 'react-hot-toast';
import { HiOutlineOfficeBuilding, HiOutlineCalendar } from 'react-icons/hi';
import EmptyState from '../ui/EmptyState';
import PageHeader from '../ui/PageHeader';
import Skeleton from '../ui/Skeleton';

interface Props {
  onSelectDrive: (drive: CompanyDrive) => void;
  selectedDriveId?: string;
}

export default function DriveOverview({ onSelectDrive, selectedDriveId }: Props) {
  const [drives, setDrives] = useState<CompanyDrive[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    companyService.getAllCompanies()
      .then((res) => { if (res.success) setDrives(res.companies); })
      .catch(() => toast.error('Failed to load drives'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton className="h-48" />;

  return (
    <div>
      <PageHeader title="Company Drives" />
      {drives.length === 0 ? (
        <EmptyState
          icon={HiOutlineOfficeBuilding}
          title="No Company Drives"
          description="No company drives are available yet."
          color="blue"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drives.map((drive) => {
            const isSelected = selectedDriveId === drive.id;
            return (
              <button
                key={drive.id}
                onClick={() => onSelectDrive(drive)}
                className={`text-left bg-white rounded-xl shadow-sm border p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-100 shadow-blue-100'
                    : 'border-gray-200'
                }`}
              >
                <h3 className="font-semibold text-gray-900">{drive.company_name}</h3>
                <p className="text-sm text-gray-500 mt-1">{drive.role}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md font-medium">
                    Min GPA: {drive.min_gpa}
                  </span>
                  <span className="flex items-center gap-1">
                    <HiOutlineCalendar className="h-3 w-3" />
                    {drive.drive_date || 'TBD'}
                  </span>
                </div>
                {drive.required_skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {drive.required_skills.slice(0, 3).map((s) => (
                      <span key={s} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">{s}</span>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
