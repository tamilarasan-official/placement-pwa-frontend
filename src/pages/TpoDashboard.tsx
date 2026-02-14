import { Routes, Route } from 'react-router-dom';
import { SidebarProvider } from '../contexts/SidebarContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import AnalyticsPanel from '../components/tpo/AnalyticsPanel';
import CompanyDriveList from '../components/tpo/CompanyDriveList';
import StudentManagementTable from '../components/tpo/StudentManagementTable';
import PlacementTracker from '../components/tpo/PlacementTracker';
import PendingApprovals from '../components/tpo/PendingApprovals';
import RecruiterAccountsList from '../components/tpo/RecruiterAccountsList';

export default function TpoDashboard() {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 max-w-7xl animate-fade-in">
            <Routes>
              <Route index element={<AnalyticsPanel />} />
              <Route path="pending" element={<PendingApprovals />} />
              <Route path="drives" element={<CompanyDriveList />} />
              <Route path="recruiters" element={<RecruiterAccountsList />} />
              <Route path="students" element={<StudentManagementTable />} />
              <Route path="applications" element={<PlacementTracker />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
