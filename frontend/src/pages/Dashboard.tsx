import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import SubjectGrid from '../components/dashboard/SubjectGrid';
import { YearType } from '../types/subject';

const Dashboard: React.FC = () => {
  const { state } = useAuth();
  const { year = '1st' } = useParams<{ year: YearType }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Validate that year is one of the allowed values
  const validYears: YearType[] = ['1st', '2nd', 'Masters'];
  const selectedYear = validYears.includes(year as YearType) ? year as YearType : '1st';

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <SubjectGrid year={selectedYear} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;