import React, { useState } from 'react';
import { FileText, QrCode, Download, Edit2, Trash2, Plus, ExternalLink } from 'lucide-react';
import Button from '../common/Button';
import QRCode from 'qrcode.react';
import { downloadQRCodeAsImage, downloadQRCodeAsPDF } from '../../utils/qrcode';
import CreateChapterModal from './CreateChapterModal';
import { Chapter as APIChapter } from '../../types/chapter';

interface SubQRCode {
  title: string;
  url: string;
  qrUrl: string;
  createdAt: string;
}

interface DisplayChapter {
  id: string;
  title: string;
  description?: string;
  qrUrl?: string;
  pageStart?: number;
  pageEnd?: number;
  subQRCodes?: SubQRCode[];
}

interface ChapterListProps {
  subjectName: string;
  chapters: APIChapter[];
  isLoading?: boolean;
  error?: string;
  mainPdfUrl?: string;
  mainQrUrl?: string;
  onGenerateAllQR: () => void;
  onUploadFile: () => void;
  onCreateChapter: (data: { title: string; description: string }) => Promise<void>;
  onDeleteChapter: (chapterId: string) => void;
  onEditChapter: (chapterId: string) => void;
  onAddSubQR: (chapterId: string, data: { title: string; url: string }) => void;
}

const mapChapterToDisplay = (chapter: APIChapter): DisplayChapter => ({
  id: chapter._id,
  title: chapter.title,
  description: chapter.description,
  qrUrl: chapter.qrUrl,
  pageStart: chapter.pageStart,
  pageEnd: chapter.pageEnd,
  subQRCodes: chapter.subQRs?.map(qr => ({
    title: qr.title,
    url: qr.qrUrl,
    qrUrl: qr.qrUrl,
    createdAt: qr.createdAt
  })) || []
});

const ChapterList: React.FC<ChapterListProps> = ({
  subjectName,
  chapters,
  isLoading,
  error,
  mainPdfUrl,
  mainQrUrl,
  onGenerateAllQR,
  onUploadFile,
  onCreateChapter,
  onDeleteChapter,
  onEditChapter,
  onAddSubQR,
}) => {
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSubQR, setNewSubQR] = useState<{ title: string; url: string }>({
    title: '',
    url: '',
  });

  const handleDeleteClick = (chapterId: string) => {
    setDeleteConfirmation(chapterId);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmation) {
      onDeleteChapter(deleteConfirmation);
      setDeleteConfirmation(null);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading chapters...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Main PDF QR Section */}
      {mainPdfUrl && mainQrUrl && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete PDF Access</h3>
          <div className="flex items-start space-x-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              {mainQrUrl ? (
                <QRCode
                  id="main-qr-code"
                  value={mainQrUrl}
                  size={150}
                  level="H"
                  includeMargin={true}
                />
              ) : (
                <div className="w-[150px] h-[150px] bg-gray-100 flex items-center justify-center text-gray-400">
                  No QR Code
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">
                Scan this QR code to access the complete PDF document
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadQRCodeAsImage('main-qr-code', `${subjectName}-complete`)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download QR
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadQRCodeAsPDF('main-qr-code', `${subjectName}-complete`, subjectName)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(mainPdfUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chapter Controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{subjectName} Chapters</h2>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onUploadFile}>
            <FileText className="h-4 w-4 mr-2" />
            Upload File
          </Button>
          <Button variant="outline" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Chapter
          </Button>
          <Button variant="primary" onClick={onGenerateAllQR}>
            <QrCode className="h-4 w-4 mr-2" />
            Generate All QRs
          </Button>
        </div>
      </div>

      {/* Chapters Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chapter
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pages
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                QR Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sub QR Codes
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {chapters.map((apiChapter) => {
              const chapter = mapChapterToDisplay(apiChapter);
              return (
                <React.Fragment key={chapter.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">{chapter.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {chapter.pageStart} - {chapter.pageEnd}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)}
                      >
                        <QrCode className="h-4 w-4 mr-1" />
                        View QR
                      </Button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {chapter.subQRCodes?.length || 0} additional QR codes
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditChapter(chapter.id)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(chapter.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded QR Section */}
                  {expandedChapter === chapter.id && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Main Chapter QR */}
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Chapter QR Code</h4>
                            <div className="flex items-start space-x-4">
                              {chapter.qrUrl ? (
                                <QRCode
                                  id={`chapter-qr-${chapter.id}`}
                                  value={chapter.qrUrl}
                                  size={120}
                                  level="H"
                                  includeMargin={true}
                                />
                              ) : (
                                <div className="w-[120px] h-[120px] bg-gray-100 flex items-center justify-center text-gray-400">
                                  No QR Code
                                </div>
                              )}
                              <div className="flex-1">
                                {chapter.description && (
                                  <p className="text-sm text-gray-600 mb-2">
                                    {chapter.description}
                                  </p>
                                )}
                                <div className="flex flex-wrap gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => downloadQRCodeAsImage(`chapter-qr-${chapter.id}`, `${subjectName}-${chapter.title}`)}
                                  >
                                    <Download className="h-4 w-4 mr-1" />
                                    Download QR
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Add Sub QR Form */}
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Add Additional QR Code</h4>
                            <div className="space-y-3">
                              <input
                                type="text"
                                placeholder="Title"
                                className="w-full px-3 py-2 border rounded-md"
                                value={newSubQR.title}
                                onChange={(e) => setNewSubQR({ ...newSubQR, title: e.target.value })}
                              />
                              <input
                                type="url"
                                placeholder="URL"
                                className="w-full px-3 py-2 border rounded-md"
                                value={newSubQR.url}
                                onChange={(e) => setNewSubQR({ ...newSubQR, url: e.target.value })}
                              />
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                  onAddSubQR(chapter.id, newSubQR);
                                  setNewSubQR({ title: '', url: '' });
                                }}
                                disabled={!newSubQR.title || !newSubQR.url}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add QR Code
                              </Button>
                            </div>
                          </div>

                          {/* Sub QR Codes List */}
                          {chapter.subQRCodes && chapter.subQRCodes.length > 0 && (
                            <div className="col-span-2">
                              <h4 className="text-sm font-medium text-gray-900 mb-3">Additional QR Codes</h4>
                              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Title</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">URL</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Created</th>
                                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {chapter.subQRCodes.map((subQR, index) => (
                                      <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 text-sm text-gray-900">{subQR.title}</td>
                                        <td className="px-4 py-2 text-sm text-gray-500">
                                          <a href={subQR.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            {subQR.url}
                                          </a>
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-500">
                                          {new Date(subQR.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => downloadQRCodeAsImage(`sub-qr-${index}`, `${subQR.title}`)}
                                          >
                                            <Download className="h-4 w-4" />
                                          </Button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Chapter</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this chapter? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setDeleteConfirmation(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleConfirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Chapter Modal */}
      <CreateChapterModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={async (data) => {
          try {
            await onCreateChapter(data);
            setIsCreateModalOpen(false);
          } catch (err) {
            console.error('Error creating chapter:', err);
            alert('Failed to create chapter');
          }
        }}
        isLoading={false}
      />
    </div>
  );
};

export default ChapterList;