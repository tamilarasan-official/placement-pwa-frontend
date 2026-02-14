import { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { CompanyDrive } from '../../types';
import toast from 'react-hot-toast';
import { HiOutlineStar, HiOutlineCalendar } from 'react-icons/hi';
import EmptyState from '../ui/EmptyState';
import PageHeader from '../ui/PageHeader';
import Skeleton from '../ui/Skeleton';

export default function RecommendedDrives() {
  const [drives, setDrives] = useState<CompanyDrive[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingTo, setApplyingTo] = useState<string | null>(null);

  useEffect(() => {
    studentService.getRecommendedDrives()
      .then((res) => { if (res.success) setDrives(res.drives); })
      .catch(() => toast.error('Failed to load recommendations'))
      .finally(() => setLoading(false));
  }, []);

  const handleApply = async (companyId: string) => {
    setApplyingTo(companyId);
    try {
      await studentService.applyToDrive(companyId);
      toast.success('Application submitted!');
      setDrives((prev) =>
        prev.map((d) => (d.id === companyId ? { ...d, already_applied: true } : d))
      );
    } catch {
      toast.error('Failed to apply');
    } finally {
      setApplyingTo(null);
    }
  };

  if (loading) return <Skeleton />;

  return (
    <div>
      <PageHeader title="Recommended Drives" />
      {drives.length === 0 ? (
        <EmptyState
          icon={HiOutlineStar}
          title="No Recommendations Yet"
          description="Complete your profile for personalized suggestions."
          color="yellow"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {drives.map((drive) => (
            <div key={drive.id} className="bg-white rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-yellow-400 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{drive.company_name}</h3>
                  <p className="text-sm text-gray-500">{drive.role}</p>
                </div>
                {drive.recommendation_score !== undefined && (
                  <span className="flex items-center gap-1 text-xs bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 border border-yellow-200 px-2.5 py-1 rounded-full font-medium">
                    <HiOutlineStar className="h-3 w-3 text-yellow-500" />
                    {Math.round(drive.recommendation_score)}% match
                  </span>
                )}
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <HiOutlineCalendar className="h-4 w-4 text-gray-400" />
                  <span>Drive Date: {drive.drive_date || 'TBD'}</span>
                </div>
                <p className="text-xs text-gray-500">Min GPA: {drive.min_gpa} | Max Backlogs: {drive.allowed_backlogs}</p>
                {drive.required_skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {drive.required_skills.map((skill) => (
                      <span key={skill} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleApply(drive.id)}
                disabled={drive.already_applied || applyingTo === drive.id}
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all ${
                  drive.already_applied
                    ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm disabled:opacity-50'
                }`}
              >
                {drive.already_applied ? 'Applied' : applyingTo === drive.id ? 'Applying...' : 'Apply Now'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
