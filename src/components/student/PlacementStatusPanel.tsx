import { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { StudentProfile, Application } from '../../types';
import StatusBadge from '../common/StatusBadge';
import { HiOutlineDocumentText, HiOutlineStar, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi';

export default function PlacementStatusPanel() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    studentService.getProfile().then((res) => {
      if (res.success) setProfile(res.profile);
    });
    studentService.getApplications().then((res) => {
      if (res.success) setApplications(res.applications);
    });
  }, []);

  const totalApplied = applications.length;
  const shortlisted = applications.filter((a) => a.status === 'SHORTLISTED').length;
  const selected = applications.filter((a) => a.status === 'SELECTED').length;
  const rejected = applications.filter((a) => a.status === 'REJECTED').length;

  const miniStats = [
    { label: 'Applied', value: totalApplied, icon: HiOutlineDocumentText, bg: 'from-blue-50 to-blue-100/50', text: 'text-blue-700', iconBg: 'bg-blue-100' },
    { label: 'Shortlisted', value: shortlisted, icon: HiOutlineStar, bg: 'from-yellow-50 to-yellow-100/50', text: 'text-yellow-700', iconBg: 'bg-yellow-100' },
    { label: 'Selected', value: selected, icon: HiOutlineCheckCircle, bg: 'from-green-50 to-green-100/50', text: 'text-green-700', iconBg: 'bg-green-100' },
    { label: 'Rejected', value: rejected, icon: HiOutlineXCircle, bg: 'from-red-50 to-red-100/50', text: 'text-red-700', iconBg: 'bg-red-100' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Placement Status</h2>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm text-gray-600">Current Status:</span>
        <StatusBadge status={profile?.placement_status || 'NOT_APPLIED'} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {miniStats.map((stat) => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.bg} rounded-xl p-4 flex items-center gap-3`}>
            <div className={`p-2 rounded-lg ${stat.iconBg}`}>
              <stat.icon className={`h-5 w-5 ${stat.text}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${stat.text}`}>{stat.value}</p>
              <p className={`text-xs ${stat.text} opacity-80`}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
