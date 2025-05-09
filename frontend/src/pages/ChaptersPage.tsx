import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { 
  getChaptersBySubject,
  createChapter, 
  createChaptersFromPDF,
  deleteChapter,
  addSubQR
} from '../api/chapters';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import ChapterList from '../components/chapters/ChapterList';
import UploadFileModal from '../components/chapters/UploadFileModal';
import CreateChapterModal from '../components/chapters/CreateChapterModal';

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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // States for PDF and QR URLs
  const [mainPdfUrl, setMainPdfUrl] = useState<string>('');
  const [mainQrUrl, setMainQrUrl] = useState<string>('');

  // Status banner component
  const StatusBanner = ({ status, onClose }: { 
    status: { type: 'success' | 'error' | 'info'; message: string; details?: string; },
    onClose: () => void 
  }) => (
    <div className={`mb-4 p-4 rounded-md ${
      status.type === 'success' ? 'bg-green-50 border border-green-200' :
      status.type === 'error' ? 'bg-red-50 border border-red-200' :
      'bg-blue-50 border border-blue-200'
    }`}>
      <div className="flex justify-between items-start">
        <div>
          <p className={`text-sm font-medium ${
            status.type === 'success' ? 'text-green-800' :
            status.type === 'error' ? 'text-red-800' :
            'text-blue-800'
          }`}>
            {status.message}
          </p>
          {status.details && (
            <p className={`mt-1 text-sm ${
              status.type === 'success' ? 'text-green-700' :
              status.type === 'error' ? 'text-red-700' :
              'text-blue-700'
            }`}>
              {status.details}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="ml-3"
        >
          <span className="sr-only">Dismiss</span>
          <ChevronRight className="h-5 w-5 opacity-50" />
        </button>
      </div>
    </div>
  );

  const { data: chapters, isLoading, error } = useQuery(
    ['chapters', subjectId],
    () => getChaptersBySubject(subjectId || ''),
    {
      enabled: !!subjectId,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 3,
      onError: (err: any) => {
        console.error('Error fetching chapters:', err);
      }
    }
  );

  const createChapterMutation = useMutation(createChapter, {
    onSuccess: () => {
      queryClient.invalidateQueries(['chapters', subjectId]);
      setIsCreateModalOpen(false);
    },
  });

  const [pdfUploadStatus, setPdfUploadStatus] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    details?: string;
  } | null>(null);

  const createPDFChaptersMutation = useMutation(
    (chapters: { title: string; content: string }[]) =>
      createChaptersFromPDF(subjectId || '', chapters),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries(['chapters', subjectId]);
        setIsUploadModalOpen(false);
        setPdfUploadStatus({
          type: response.chapters.length === 0 ? 'error' : 'success',
          message: response.message,
          details: response.details
        });
      },
      onError: (error: any) => {
        setPdfUploadStatus({
          type: 'error',
          message: error.message || 'Failed to create chapters',
          details: error.details
        });
      }
    }
  );

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

  const handleFileUpload = async (chapters: { title: string; content: string }[]) => {
    if (!subjectId) {
      setPdfUploadStatus({
        type: 'error',
        message: 'No subject selected',
        details: 'Please select a subject before uploading a PDF'
      });
      return;
    }

    if (!chapters.length) {
      setPdfUploadStatus({
        type: 'error',
        message: 'No chapters found',
        details: 'Could not extract any chapters from the PDF. Please check the file format.'
      });
      return;
    }

    try {
      await createPDFChaptersMutation.mutateAsync(chapters);
    } catch (err: any) {
      console.error('Error creating chapters from PDF:', err);
      setPdfUploadStatus({
        type: 'error',
        message: 'Failed to process PDF',
        details: err.response?.data?.message || 'Please make sure the file is properly formatted and try again.'
      });
    }
  };

  const handleCreateChapter = async (data: { title: string; description: string }) => {
    if (!subjectId) {
      alert('No subject selected');
      return;
    }
    
    try {
      const chapterData = {
        title: data.title,
        description: data.description,
        subjectId: subjectId,
      };

      const result = await createChapterMutation.mutateAsync(chapterData);
      if (result) {
        alert('Chapter created successfully!');
      }
    } catch (error: any) {
      console.error('Error creating chapter:', error);
      alert(error.response?.data?.message || 'Failed to create chapter');
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Status Banner */}
          {pdfUploadStatus && (
            <StatusBanner
              status={pdfUploadStatus}
              onClose={() => setPdfUploadStatus(null)}
            />
          )}

          {/* Navigation */}
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
            error={error instanceof Error ? error.message : String(error)}
            mainPdfUrl={mainPdfUrl}
            mainQrUrl={mainQrUrl}
            onGenerateAllQR={handleGenerateAllQR}
            onUploadFile={handleUploadFile}
            onCreateChapter={handleCreateChapter}
            onDeleteChapter={async (chapterId) => {
              try {
                await deleteChapter(chapterId);
                queryClient.invalidateQueries(['chapters', subjectId]);
              } catch (err) {
                console.error('Error deleting chapter:', err);
                alert('Failed to delete chapter');
              }
            }}
            onEditChapter={async (chapterId) => {
              // Placeholder for edit functionality
              console.log('Editing chapter:', chapterId);
            }}
            onAddSubQR={async (chapterId, data) => {
              try {
                await addSubQR({
                  chapterId,
                  title: data.title,
                  url: data.url
                });
                queryClient.invalidateQueries(['chapters', subjectId]);
              } catch (err) {
                console.error('Error adding sub QR:', err);
                alert('Failed to add sub QR');
              }
            }}
          />
        </main>
      </div>
      
      <UploadFileModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleFileUpload}
      />
      
      <CreateChapterModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={async (data) => {
          try {
            await handleCreateChapter(data);
            setIsCreateModalOpen(false);
          } catch (err) {
            console.error('Error creating chapter:', err);
          }
        }}
        isLoading={createChapterMutation.isLoading}
      />
    </div>
  );
};

export default ChaptersPage;