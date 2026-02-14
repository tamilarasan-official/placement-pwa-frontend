import { Routes, Route } from 'react-router-dom';
import { SidebarProvider } from '../contexts/SidebarContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import ProfileEditor from '../components/student/ProfileEditor';
import PlacementStatusPanel from '../components/student/PlacementStatusPanel';
import EligibleDrivesList from '../components/student/EligibleDrivesList';
import RecommendedDrives from '../components/student/RecommendedDrives';
import ApplicationHistory from '../components/student/ApplicationHistory';
import InterviewSchedule from '../components/student/InterviewSchedule';

function StudentHome() {
  return (
    <div className="space-y-6">
      <PlacementStatusPanel />
      <ProfileEditor />
    </div>
  );
}

export default function StudentDashboard() {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 max-w-6xl animate-fade-in">
            <Routes>
              <Route index element={<StudentHome />} />
              <Route path="eligible-drives" element={<EligibleDrivesList />} />
              <Route path="recommended" element={<RecommendedDrives />} />
              <Route path="applications" element={<ApplicationHistory />} />
              <Route path="interviews" element={<InterviewSchedule />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
