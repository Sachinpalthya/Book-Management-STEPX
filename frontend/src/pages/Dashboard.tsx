import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import SubjectGrid from '../components/Dashboard/SubjectGrid';
import BranchGrid from '../components/Dashboard/BranchGrid';

const Dashboard: React.FC = () => {
  const { state,isAuthenticated } = useAuth();
  const { year = '1_year' } = useParams<{ year: '1_year' }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Validate that year is one of the allowed values
  const selectedYear = year;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <BranchGrid year={selectedYear} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;