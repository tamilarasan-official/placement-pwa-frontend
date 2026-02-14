import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSidebar } from '../../contexts/SidebarContext';
import { IconType } from 'react-icons';
import {
  HiOutlineUser, HiOutlineBriefcase, HiOutlineDocumentText,
  HiOutlineChartBar, HiOutlineCalendar, HiOutlineUsers,
  HiOutlineClipboardList, HiOutlineStar, HiOutlineOfficeBuilding,
  HiOutlineUserAdd, HiOutlineShieldCheck, HiOutlineX
} from 'react-icons/hi';

interface SidebarItem {
  label: string;
  to: string;
  icon: IconType;
}

const studentLinks: SidebarItem[] = [
  { label: 'Profile', to: '/student', icon: HiOutlineUser },
  { label: 'Eligible Drives', to: '/student/eligible-drives', icon: HiOutlineBriefcase },
  { label: 'Recommended', to: '/student/recommended', icon: HiOutlineStar },
  { label: 'My Applications', to: '/student/applications', icon: HiOutlineDocumentText },
  { label: 'Interviews', to: '/student/interviews', icon: HiOutlineCalendar },
];

const tpoLinks: SidebarItem[] = [
  { label: 'Analytics', to: '/tpo', icon: HiOutlineChartBar },
  { label: 'Pending Approvals', to: '/tpo/pending', icon: HiOutlineShieldCheck },
  { label: 'Company Drives', to: '/tpo/drives', icon: HiOutlineOfficeBuilding },
  { label: 'Recruiters', to: '/tpo/recruiters', icon: HiOutlineUserAdd },
  { label: 'Students', to: '/tpo/students', icon: HiOutlineUsers },
  { label: 'Applications', to: '/tpo/applications', icon: HiOutlineClipboardList },
];

const recruiterLinks: SidebarItem[] = [
  { label: 'Drive Overview', to: '/recruiter', icon: HiOutlineBriefcase },
  { label: 'Eligible Students', to: '/recruiter/students', icon: HiOutlineUsers },
  { label: 'Shortlisted', to: '/recruiter/shortlisted', icon: HiOutlineClipboardList },
  { label: 'Interviews', to: '/recruiter/interviews', icon: HiOutlineCalendar },
];

const roleLabels: Record<string, string> = {
  student: 'Student Portal',
  tpo: 'TPO Dashboard',
  recruiter: 'Recruiter Panel',
};

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth();

  const links = user?.role === 'student' ? studentLinks
    : user?.role === 'tpo' ? tpoLinks
    : recruiterLinks;

  return (
    <nav className="p-4 space-y-1">
      <div className="px-3 py-2 mb-2">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
          {roleLabels[user?.role || ''] || 'Dashboard'}
        </p>
      </div>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === `/${user?.role}`}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-l-[3px] border-blue-600 -ml-[3px]'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <link.icon className="h-5 w-5" />
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function Sidebar() {
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] hidden md:block">
        <SidebarNav />
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={close} />
          <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white shadow-xl z-50 animate-slide-in-left">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <span className="font-bold text-gray-900">Menu</span>
              <button onClick={close} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>
            <SidebarNav onNavigate={close} />
          </aside>
        </div>
      )}
    </>
  );
}
