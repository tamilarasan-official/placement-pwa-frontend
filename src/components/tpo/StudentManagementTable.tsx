import { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { StudentProfile } from '../../types';
import StatusBadge from '../common/StatusBadge';
import toast from 'react-hot-toast';
import { HiOutlineSearch } from 'react-icons/hi';
import PageHeader from '../ui/PageHeader';
import Skeleton from '../ui/Skeleton';

export default function StudentManagementTable() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    analyticsService.getAllStudents()
      .then((res) => { if (res.success) setStudents(res.students); })
      .catch(() => toast.error('Failed to load students'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.department?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Skeleton />;

  return (
    <div>
      <PageHeader
        title="Student Management"
        action={
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        }
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dept</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">GPA</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Backlogs</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Skills</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Links</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((student, i) => (
                <tr key={student.id || student.user_id} className={`hover:bg-blue-50/40 transition-colors ${i % 2 === 1 ? 'bg-gray-50/30' : ''}`}>
                  <td className="py-3 px-4 font-medium text-gray-900">{student.name || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium">
                      {student.department || 'N/A'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{student.gpa}</td>
                  <td className="py-3 px-4 text-gray-600">{student.backlogs}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {student.skills?.slice(0, 3).map((skill) => (
                        <span key={skill} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{skill}</span>
                      ))}
                      {student.skills?.length > 3 && (
                        <span className="text-xs text-gray-400">+{student.skills.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={student.placement_status || 'NOT_APPLIED'} />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      {student.resume_url && (
                        <a href={student.resume_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">
                          Resume
                        </a>
                      )}
                      {student.github && (
                        <a href={`https://${student.github}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">
                          GitHub
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">No students found</div>
        )}
      </div>
    </div>
  );
}
