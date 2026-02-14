import { useState, useEffect } from 'react';
import { tpoService } from '../../services/tpoService';
import { PendingStudent } from '../../types';
import toast from 'react-hot-toast';
import { HiOutlineCheck, HiOutlineX, HiOutlineClock } from 'react-icons/hi';
import PageHeader from '../ui/PageHeader';
import EmptyState from '../ui/EmptyState';
import LoadingSpinner from '../common/LoadingSpinner';

export default function PendingApprovals() {
  const [students, setStudents] = useState<PendingStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchPending = async () => {
    try {
      const res = await tpoService.getPendingStudents();
      if (res.success) {
        setStudents(res.students);
      }
    } catch {
      toast.error('Failed to load pending students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id: string) => {
    setProcessing(id);
    try {
      const res = await tpoService.approveStudent(id);
      if (res.success) {
        toast.success(res.message);
        setStudents(students.filter((s) => s.id !== id));
      }
    } catch {
      toast.error('Failed to approve student');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessing(id);
    try {
      const res = await tpoService.rejectStudent(id);
      if (res.success) {
        toast.success(res.message);
        setStudents(students.filter((s) => s.id !== id));
      }
    } catch {
      toast.error('Failed to reject student');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="Pending Approvals"
        subtitle={`${students.length} student${students.length !== 1 ? 's' : ''} awaiting approval`}
      />

      {students.length === 0 ? (
        <EmptyState
          icon={HiOutlineClock}
          title="No Pending Registrations"
          description="All student registrations have been processed."
          color="green"
        />
      ) : (
        <div className="space-y-3">
          {students.map((student) => {
            const initial = student.name?.charAt(0)?.toUpperCase() || '?';
            return (
              <div
                key={student.id}
                className="bg-white rounded-xl border border-gray-200 border-l-4 border-l-amber-400 p-5 flex items-center justify-between hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                    {initial}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-500">{student.email}</p>
                    <div className="flex gap-3 mt-1">
                      {student.department && (
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium">
                          {student.department}
                        </span>
                      )}
                      {student.roll_number && (
                        <span className="text-xs text-gray-500">
                          Roll: <span className="font-medium">{student.roll_number}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleApprove(student.id)}
                    disabled={processing === student.id}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 shadow-sm"
                  >
                    <HiOutlineCheck className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(student.id)}
                    disabled={processing === student.id}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    <HiOutlineX className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
