import { useState, useEffect } from 'react';
import { interviewService } from '../../services/interviewService';
import { Interview, CompanyDrive } from '../../types';
import toast from 'react-hot-toast';
import { HiOutlineVideoCamera, HiOutlineOfficeBuilding, HiOutlineCalendar } from 'react-icons/hi';
import EmptyState from '../ui/EmptyState';
import PageHeader from '../ui/PageHeader';
import Skeleton from '../ui/Skeleton';

interface Props {
  selectedDrive: CompanyDrive | null;
}

export default function InterviewResultsPanel({ selectedDrive }: Props) {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const promise = selectedDrive?.id
      ? interviewService.getAllInterviews(selectedDrive.id)
      : interviewService.getAllInterviews();

    promise
      .then((res) => { if (res.success) setInterviews(res.interviews); })
      .catch(() => toast.error('Failed to load interviews'))
      .finally(() => setLoading(false));
  }, [selectedDrive?.id]);

  if (loading) return <Skeleton />;

  return (
    <div>
      <PageHeader title="Scheduled Interviews" />
      {interviews.length === 0 ? (
        <EmptyState
          icon={HiOutlineCalendar}
          title="No Interviews Scheduled"
          description="Schedule interviews from the shortlist panel."
          color="blue"
        />
      ) : (
        <div className="space-y-3">
          {interviews.map((interview) => {
            const dateObj = interview.interview_date ? new Date(interview.interview_date) : null;
            return (
              <div key={interview.id} className="bg-white rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-purple-400 p-4 hover:shadow-md transition-all duration-200">
                <div className="flex gap-4">
                  {dateObj && (
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg flex flex-col items-center justify-center border border-purple-100">
                      <span className="text-xs font-medium text-purple-600 uppercase">
                        {dateObj.toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-lg font-bold text-purple-800 leading-tight">
                        {dateObj.getDate()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {interview.student?.name || 'Unknown Student'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {interview.company?.company_name} - {interview.company?.role}
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        interview.mode === 'online'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {interview.mode === 'online' ? <HiOutlineVideoCamera className="h-3 w-3" /> : <HiOutlineOfficeBuilding className="h-3 w-3" />}
                        {interview.mode}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <span>{interview.interview_date}</span>
                      {interview.interview_time && <span> at {interview.interview_time}</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
