import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSidebar } from '../../contexts/SidebarContext';
import { HiOutlineAcademicCap, HiOutlineMenu } from 'react-icons/hi';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { toggle } = useSidebar();

  const initial = user?.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <nav className="bg-gradient-to-r from-blue-800 via-blue-900 to-indigo-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle sidebar"
            >
              <HiOutlineMenu className="h-6 w-6" />
            </button>
            <Link to={`/${user?.role || ''}`} className="flex items-center gap-2">
              <HiOutlineAcademicCap className="h-8 w-8" />
              <span className="font-bold text-lg hidden sm:block">PlacementTracker</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user && <NotificationBell />}
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-blue-200 capitalize">{user.role}</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                  {initial}
                </div>
                <button
                  onClick={logout}
                  className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-sm transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
