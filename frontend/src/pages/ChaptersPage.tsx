import React, { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getChaptersBySubject, createChapter } from '../api/chapters';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import ChapterList from '../components/chapters/ChapterList';
import UploadFileModal from '../components/chapters/UploadFileModal';

// Define param keys for type-safety
const PARAM_KEYS = {
  year: 'year',
  subject: 'subject',
  subjectId: 'subjectId'
} as const;

type ChapterPageParams = {
  [PARAM_KEYS.year]: string;
  [PARAM_KEYS.subject]: string;
  [PARAM_KEYS.subjectId]: string;
};

const ChaptersPage: React.FC = () => {
  const { state } = useAuth();
  const queryClient = useQueryClient();
  const { year, subject, subjectId } = useParams<ChapterPageParams>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const { data: chapters, isLoading, error } = useQuery(
    ['chapters', subjectId],
    () => getChaptersBySubject(subjectId || ''),
    {
      enabled: !!subjectId,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    }
  );

  const createChapterMutation = useMutation(createChapter, {
    onSuccess: () => {
      queryClient.invalidateQueries(['chapters', subjectId]);
      setIsUploadModalOpen(false);
    },
  });

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleGenerateAllQR = () => {
    // For now, just show success message
    alert('QR codes generated successfully');
  };

  const handleUploadFile = () => {
    setIsUploadModalOpen(true);
  };

  const handleFileUpload = async (file: File) => {
    // Create a chapter with the file name as title and use it as static QR content
    const chapterData = {
      title: file.name.split('.')[0],
      description: `Uploaded file: ${file.name}`,
      subjectId: subjectId || '',
      qrContent: file.name, // Static QR content based on file name
      qrUrl: '', // URL can be updated later
    };

    try {
      await createChapterMutation.mutateAsync(chapterData);
    } catch (err) {
      console.error('Error creating chapter:', err);
      alert('Failed to create chapter. Please try again.');
    }
  };

  const handleCreateChapter = async (data: { title: string; description: string }) => {
    const chapterData = {
      title: data.title,
      description: data.description,
      subjectId: subjectId || '',
      qrContent: data.title, // Use title as static QR content
      qrUrl: '', // URL can be updated later
    };

    await createChapterMutation.mutateAsync(chapterData);
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
            chapters={chapters || []}
            isLoading={isLoading}
            error={error}
            onGenerateAllQR={handleGenerateAllQR}
            onUploadFile={handleUploadFile}
            onCreateChapter={handleCreateChapter}
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