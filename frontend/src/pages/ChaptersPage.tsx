import React, { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import ChapterList from '../components/chapters/ChapterList';
import UploadFileModal from '../components/chapters/UploadFileModal';

// Mock chapters data
const mockChapters = [
  { id: '1', title: 'Chapter 1: Introduction', qrUrl: 'https://example.com/chapter1' },
  { id: '2', title: 'Chapter 2: Basic Concepts', qrUrl: 'https://example.com/chapter2' },
  { id: '3', title: 'Chapter 3: Advanced Topics', qrUrl: 'https://example.com/chapter3' },
  { id: '4', title: 'Chapter 4: Applications', qrUrl: 'https://example.com/chapter4' },
  { id: '5', title: 'Chapter 5: Case Studies', qrUrl: 'https://example.com/chapter5' },
];

const ChaptersPage: React.FC = () => {
  const { state } = useAuth();
  const { year, subject, subjectId } = useParams<{ year: string; subject: string; subjectId: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleGenerateAllQR = () => {
    alert('Generating QR codes for all chapters...');
    // In a real app, we would make an API call to generate QR codes
  };

  const handleUploadFile = () => {
    setIsUploadModalOpen(true);
  };

  const handleFileUpload = (file: File) => {
    console.log('Uploading file:', file);
    // In a real app, we would make an API call to upload the file
    alert(`File "${file.name}" uploaded successfully!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Breadcrumbs */}
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  to={`/dashboard/${year}`}
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Subjects
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                    {subject}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
          
          <ChapterList
            subjectName={subject || 'Subject'}
            chapters={mockChapters}
            onGenerateAllQR={handleGenerateAllQR}
            onUploadFile={handleUploadFile}
          />
        </main>
      </div>
      
      <UploadFileModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleFileUpload}
      />
    </div>
  );
};

export default ChaptersPage;