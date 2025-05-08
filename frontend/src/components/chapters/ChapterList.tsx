import React, { useState } from 'react';
import { FileText, QrCode, Download } from 'lucide-react';
import Button from '../common/Button';
import QRCode from 'qrcode.react';
import { downloadQRCodeAsImage, downloadQRCodeAsPDF } from '../../utils/qrcode';

interface Chapter {
  id: string;
  title: string;
  qrUrl: string;
}

interface ChapterListProps {
  subjectName: string;
  chapters: Chapter[];
  onGenerateAllQR: () => void;
  onUploadFile: () => void;
}

const ChapterList: React.FC<ChapterListProps> = ({ 
  subjectName, 
  chapters, 
  onGenerateAllQR,
  onUploadFile
}) => {
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [urlInputs, setUrlInputs] = useState<Record<string, string>>({});

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {subjectName}
        </h2>
        <div className="flex space-x-3">
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
          >
            <QrCode className="h-4 w-4 mr-2" />
            Generate QR for All
          </Button>
  
        </div>
      </div>
      
      <div className="space-y-4">
        {chapters.map((chapter) => (
          <div 
            key={chapter.id}
            className="border rounded-lg overflow-hidden bg-white shadow-sm"
          >
            <div 
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleExpand(chapter.id)}
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
                    toggleExpand(chapter.id);
                  }}
                >
                  <QrCode className="h-4 w-4 mr-1" />
                  QR Code
                </Button>
              </div>
            </div>
            
            {expandedChapter === chapter.id && (
              <div className="p-4 bg-gray-50 border-t">
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                  <div className="flex-shrink-0">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <QRCode
                        id={`qr-code-${chapter.id}`}
                        value={urlInputs[chapter.id] || chapter.qrUrl || 'https://example.com'}
                        size={150}
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                  </div>
                  
                  <div className="flex-grow space-y-3 w-full">
                    <div>
                      <label htmlFor={`url-${chapter.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                        QR Code URL
                      </label>
                      <input
                        id={`url-${chapter.id}`}
                        type="url"
                        className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter URL for QR code"
                        value={urlInputs[chapter.id] || chapter.qrUrl || ''}
                        onChange={(e) => handleUrlChange(chapter.id, e.target.value)}
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadQRImage(chapter.id, chapter.title)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download QR
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadQRPDF(chapter.id, chapter.title)}
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
    </div>
  );
};

export default ChapterList;