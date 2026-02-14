import { useState, useEffect } from 'react';
import { companyService } from '../../services/companyService';
import { interviewService } from '../../services/interviewService';
import { Application, CompanyDrive } from '../../types';
import StatusBadge from '../common/StatusBadge';
import toast from 'react-hot-toast';
import { HiOutlineClipboardList } from 'react-icons/hi';
import EmptyState from '../ui/EmptyState';
import PageHeader from '../ui/PageHeader';
import Skeleton from '../ui/Skeleton';

interface Props {
  selectedDrive: CompanyDrive | null;
}

export default function ShortlistPanel({ selectedDrive }: Props) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [scheduling, setScheduling] = useState<string | null>(null);
  const [interviewForm, setInterviewForm] = useState({
    date: '',
    time: '',
    mode: 'online',
  });

  const fetchApplications = () => {
    if (!selectedDrive?.id) return;
    setLoading(true);
    companyService.getDriveApplications(selectedDrive.id)
      .then((res) => { if (res.success) setApplications(res.applications); })
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchApplications(); }, [selectedDrive?.id]);

  const handleStatusUpdate = async (appId: string, status: string) => {
    try {
      await companyService.updateApplicationStatus(appId, status);
      toast.success('Status updated!');
      fetchApplications();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleScheduleInterview = async (studentId: string) => {
    if (!selectedDrive?.id || !interviewForm.date) {
      toast.error('Please fill in interview date');
      return;
    }
    try {
      await interviewService.scheduleInterview({
        student_id: studentId,
        company_id: selectedDrive.id,
        interview_date: interviewForm.date,
        interview_time: interviewForm.time,
        mode: interviewForm.mode,
      });
      toast.success('Interview scheduled!');
      setScheduling(null);
      setInterviewForm({ date: '', time: '', mode: 'online' });
    } catch {
      toast.error('Failed to schedule interview');
    }
  };

  if (!selectedDrive) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-indigo-400 p-8 text-center text-gray-500">
        Select a drive to view applications
      </div>
    );
  }

  if (loading) return <Skeleton />;

  return (
    <div>
      <PageHeader title={`Applications - ${selectedDrive.company_name}`} />

      {applications.length === 0 ? (
        <EmptyState
          icon={HiOutlineClipboardList}
          title="No Applications"
          description="No applications received for this drive yet."
          color="blue"
        />
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app.id} className="bg-white rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-indigo-400 p-4 hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{app.student?.name || 'Unknown Student'}</h3>
                  <p className="text-sm text-gray-500">
                    {app.student?.department} | GPA: {app.student?.gpa}
                  </p>
                  <div className="flex gap-2 mt-1 text-xs">
                    {app.student?.resume_url && (
                      <a href={app.student.resume_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Resume</a>
                    )}
                    {app.student?.github && (
                      <a href={`https://${app.student.github}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">GitHub</a>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={app.status} />
                  <div className="flex gap-1.5">
                    {app.status === 'APPLIED' && (
                      <button
                        onClick={() => handleStatusUpdate(app.id, 'SHORTLISTED')}
                        className="px-3 py-1.5 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg text-xs font-medium hover:bg-yellow-100 transition-colors"
                      >
                        Shortlist
                      </button>
                    )}
                    {app.status === 'SHORTLISTED' && (
                      <>
                        <button
                          onClick={() => setScheduling(scheduling === app.id ? null : app.id)}
                          className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-xs font-medium hover:bg-purple-100 transition-colors"
                        >
                          Schedule
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(app.id, 'INTERVIEWED')}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                        >
                          Interviewed
                        </button>
                      </>
                    )}
                    {app.status === 'INTERVIEWED' && (
                      <button
                        onClick={() => handleStatusUpdate(app.id, 'SELECTED')}
                        className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors"
                      >
                        Select
                      </button>
                    )}
                    {['APPLIED', 'SHORTLISTED', 'INTERVIEWED'].includes(app.status) && (
                      <button
                        onClick={() => handleStatusUpdate(app.id, 'REJECTED')}
                        className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {scheduling === app.id && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg animate-fade-in">
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="date"
                      value={interviewForm.date}
                      onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <input
                      type="time"
                      value={interviewForm.time}
                      onChange={(e) => setInterviewForm({ ...interviewForm, time: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <select
                      value={interviewForm.mode}
                      onChange={(e) => setInterviewForm({ ...interviewForm, mode: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>
                  <button
                    onClick={() => handleScheduleInterview(app.student_id)}
                    className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all"
                  >
                    Confirm Schedule
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
