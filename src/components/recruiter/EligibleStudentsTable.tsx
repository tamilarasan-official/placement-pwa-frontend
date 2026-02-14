import { useState, useEffect } from 'react';
import { companyService } from '../../services/companyService';
import { StudentProfile, CompanyDrive } from '../../types';
import toast from 'react-hot-toast';
import { HiOutlineUsers } from 'react-icons/hi';
import EmptyState from '../ui/EmptyState';
import Skeleton from '../ui/Skeleton';
import PageHeader from '../ui/PageHeader';

interface Props {
  selectedDrive: CompanyDrive | null;
}

export default function EligibleStudentsTable({ selectedDrive }: Props) {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedDrive?.id) return;
    setLoading(true);
    companyService.getEligibleStudents(selectedDrive.id)
      .then((res) => { if (res.success) setStudents(res.students); })
      .catch(() => toast.error('Failed to load eligible students'))
      .finally(() => setLoading(false));
  }, [selectedDrive?.id]);

  if (!selectedDrive) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-blue-400 p-8 text-center text-gray-500">
        Select a drive to view eligible students
      </div>
    );
  }

  if (loading) return <Skeleton />;

  return (
    <div>
      <PageHeader title={`Eligible Students - ${selectedDrive.company_name}`} />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dept</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">GPA</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Skills</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Links</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((student, i) => (
                <tr key={student.id || student.user_id} className={`hover:bg-blue-50/40 transition-colors ${i % 2 === 1 ? 'bg-gray-50/30' : ''}`}>
                  <td className="py-3 px-4 font-medium text-gray-900">{student.name || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium">
                      {student.department || 'N/A'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{student.gpa}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {student.skills?.slice(0, 4).map((skill) => (
                        <span key={skill} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{skill}</span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2 text-xs">
                      {student.resume_url && (
                        <a href={student.resume_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Resume</a>
                      )}
                      {student.github && (
                        <a href={`https://${student.github}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">GitHub</a>
                      )}
                      {student.linkedin && (
                        <a href={`https://${student.linkedin}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {students.length === 0 && (
          <EmptyState
            icon={HiOutlineUsers}
            title="No Eligible Students"
            description="No students match the eligibility criteria for this drive."
            color="blue"
          />
        )}
      </div>
    </div>
  );
}
