import React, { useState } from 'react';
import { FileText, QrCode, Download, Loader2, Plus } from 'lucide-react';
import Button from '../common/Button';
import QRCode from 'qrcode.react';
import { downloadQRCodeAsImage, downloadQRCodeAsPDF } from '../../utils/qrcode';
import { Chapter } from '../../types/chapter';
import CreateChapterModal from './CreateChapterModal';
import { updateChapterUrl } from '../../api/chapters';
import { useMutation, useQueryClient } from 'react-query';

interface ChapterListProps {
  subjectName: string;
  chapters: Chapter[];
  isLoading: boolean;
  error: any;
  onGenerateAllQR: () => void;
  onUploadFile: () => void;
  onCreateChapter: (data: { title: string; description: string; }) => Promise<void>;
}

const ChapterList: React.FC<ChapterListProps> = ({ 
  subjectName, 
  chapters, 
  isLoading,
  error,
  onGenerateAllQR,
  onUploadFile,
  onCreateChapter
}) => {
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [urlInputs, setUrlInputs] = useState<Record<string, string>>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();

  const urlUpdateMutation = useMutation(
    ({ chapterId, url }: { chapterId: string; url: string }) =>
      updateChapterUrl(chapterId, url),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['chapters']);
      },
    }
  );

  const handleCreateChapter = async (data: { title: string; description: string; }) => {
    setIsCreating(true);
    try {
      await onCreateChapter(data);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating chapter:', error);
      alert('Failed to create chapter. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUrlSubmit = async (chapterId: string, url: string) => {
    try {
      await urlUpdateMutation.mutateAsync({ chapterId, url });
    } catch (error) {
      console.error('Error updating URL:', error);
      alert('Failed to update URL. Please try again.');
    }
  };

  const toggleExpand = (chapterId: string) => {
    setExpandedChapter(expandedChapter === chapterId ? null : chapterId);
  };

  const handleUrlChange = (chapterId: string, url: string) => {
    setUrlInputs({
      ...urlInputs,
      [chapterId]: url
    });
  };

  const handleDownloadQRImage = (chapterId: string, chapterTitle: string) => {
    downloadQRCodeAsImage(`qr-code-${chapterId}`, `${subjectName}-${chapterTitle}`);
  };

  const handleDownloadQRPDF = (chapterId: string, chapterTitle: string) => {
    downloadQRCodeAsPDF(
      `qr-code-${chapterId}`, 
      `${subjectName}-${chapterTitle}`,
      `${subjectName} - ${chapterTitle}`
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Loading chapters...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Failed to load chapters. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {subjectName}
        </h2>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Chapter
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onUploadFile}
          >
            <FileText className="h-4 w-4 mr-2" />
            Upload File
          </Button>
          
          <Button 
            variant="primary" 
            onClick={onGenerateAllQR}
            disabled={chapters.length === 0}
          >
            <QrCode className="h-4 w-4 mr-2" />
            Generate QR for All
          </Button>
        </div>
      </div>
      
      {chapters.length === 0 ? (
        <div className="text-center p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-gray-600">No chapters found. Create a chapter or upload a file to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {chapters.map((chapter) => (
            <div 
              key={chapter._id}
              className="border rounded-lg overflow-hidden bg-white shadow-sm"
            >
              <div 
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedChapter(chapter._id)}
              >
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-500 mr-3" />
                  <h3 className="font-medium text-gray-800">{chapter.title}</h3>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setExpandedChapter(chapter._id === expandedChapter ? null : chapter._id);
                    }}
                  >
                    <QrCode className="h-4 w-4 mr-1" />
                    QR Code
                  </Button>
                </div>
              </div>
              
              {expandedChapter === chapter._id && (
                <div className="p-4 bg-gray-50 border-t">
                  <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                    <div className="flex-shrink-0">
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <QRCode
                          id={`qr-code-${chapter._id}`}
                          value={chapter.qrContent} // Use static QR content
                          size={150}
                          level="H"
                          includeMargin={true}
                        />
                      </div>
                    </div>
                    
                    <div className="flex-grow space-y-3 w-full">
                      <div>
                        <label htmlFor={`url-${chapter._id}`} className="block text-sm font-medium text-gray-700 mb-1">
                          QR Code URL
                        </label>
                        <div className="flex space-x-2">
                          <input
                            id={`url-${chapter._id}`}
                            type="url"
                            className="flex-1 rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter URL for QR code"
                            value={urlInputs[chapter._id] || chapter.qrUrl || ''}
                            onChange={(e) => setUrlInputs({
                              ...urlInputs,
                              [chapter._id]: e.target.value
                            })}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const url = urlInputs[chapter._id] || '';
                              if (url) {
                                handleUrlSubmit(chapter._id, url);
                              }
                            }}
                            disabled={!urlInputs[chapter._id] || urlInputs[chapter._id] === chapter.qrUrl}
                          >
                            Update URL
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadQRImage(chapter._id, chapter.title)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download QR
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadQRPDF(chapter._id, chapter.title)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <CreateChapterModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateChapter}
        isLoading={isCreating}
      />
    </div>
  );
};

export default ChapterList;