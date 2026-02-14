import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SidebarProvider } from '../contexts/SidebarContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import DriveOverview from '../components/recruiter/DriveOverview';
import EligibleStudentsTable from '../components/recruiter/EligibleStudentsTable';
import ShortlistPanel from '../components/recruiter/ShortlistPanel';
import InterviewResultsPanel from '../components/recruiter/InterviewResultsPanel';
import { CompanyDrive } from '../types';

function RecruiterHome() {
  const [selectedDrive, setSelectedDrive] = useState<CompanyDrive | null>(null);

  return (
    <div className="space-y-6">
      <DriveOverview
        onSelectDrive={setSelectedDrive}
        selectedDriveId={selectedDrive?.id}
      />
      <ShortlistPanel selectedDrive={selectedDrive} />
    </div>
  );
}

function RecruiterStudents() {
  const [selectedDrive, setSelectedDrive] = useState<CompanyDrive | null>(null);

  return (
    <div className="space-y-6">
      <DriveOverview
        onSelectDrive={setSelectedDrive}
        selectedDriveId={selectedDrive?.id}
      />
      <EligibleStudentsTable selectedDrive={selectedDrive} />
    </div>
  );
}

function RecruiterShortlisted() {
  const [selectedDrive, setSelectedDrive] = useState<CompanyDrive | null>(null);

  return (
    <div className="space-y-6">
      <DriveOverview
        onSelectDrive={setSelectedDrive}
        selectedDriveId={selectedDrive?.id}
      />
      <ShortlistPanel selectedDrive={selectedDrive} />
    </div>
  );
}

function RecruiterInterviews() {
  const [selectedDrive, setSelectedDrive] = useState<CompanyDrive | null>(null);

  return (
    <div className="space-y-6">
      <DriveOverview
        onSelectDrive={setSelectedDrive}
        selectedDriveId={selectedDrive?.id}
      />
      <InterviewResultsPanel selectedDrive={selectedDrive} />
    </div>
  );
}

export default function RecruiterDashboard() {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 max-w-7xl animate-fade-in">
            <Routes>
              <Route index element={<RecruiterHome />} />
              <Route path="students" element={<RecruiterStudents />} />
              <Route path="shortlisted" element={<RecruiterShortlisted />} />
              <Route path="interviews" element={<RecruiterInterviews />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
