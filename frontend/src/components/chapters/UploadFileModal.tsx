import React, { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import Button from '../common/Button';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface UploadFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (chapters: { title: string; content: string }[]) => void;
}

interface TextItem {
  str: string;
}

const UploadFileModal: React.FC<UploadFileModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const extractChaptersFromPDF = async (file: File) => {
        setIsProcessing(true);
        setProgress(0);
        
        try {
          // Validate file size
          const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
          if (file.size > MAX_FILE_SIZE) {
            throw new Error('File size too large. Please upload a PDF smaller than 50MB.');
          }

          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          const numPages = pdf.numPages;
          const chapters: { title: string; content: string }[] = [];
          let pageTexts: string[] = [];

          // First pass: collect all page texts with better error handling
          for (let i = 1; i <= numPages; i++) {
            try {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const pageText = (textContent.items as TextItem[])
                .map(item => item.str)
                .join(' ');
              pageTexts.push(pageText);
              setProgress(Math.round((i / numPages) * 50));
            } catch (pageError) {
              console.error(`Error processing page ${i}:`, pageError);
              pageTexts.push(''); // Add empty string for failed page
            }
          }

          if (pageTexts.every(text => !text.trim())) {
            throw new Error('Could not extract any text from the PDF. The file might be scanned or protected.');
          }

          // Join all texts with proper spacing
          const fullText = pageTexts.join('\n\n').trim();
          
          // Try multiple detection patterns
          const sectionPatterns = [
            // Unit patterns
            /(?:Unit|UNIT)\s+(?:\d+|[IVX]+)[.:\s-]*([^\n]+)/gi,
            // Chapter patterns
            /(?:Chapter|CHAPTER)\s+(?:\d+|[IVX]+)[.:\s-]*([^\n]+)/gi,
            // Lesson patterns
            /(?:Lesson|LESSON)\s+(?:\d+|[IVX]+)[.:\s-]*([^\n]+)/gi,
            // Numbered sections
            /^\s*(?:\d+|[IVX]+)\.\s*([^\n]+)/gim,
            // Any heading-like pattern
            /^(?:SECTION|Section|Part|PART)\s+(?:\d+|[IVX]+)[.:\s-]*([^\n]+)/gim,
          ];

          let foundMatches: { title: string, startIndex: number, type: string }[] = [];
          
          // Try each pattern until we find matches
          for (const pattern of sectionPatterns) {
            const matches = Array.from(fullText.matchAll(pattern));
            if (matches.length > 0) {
              // Determine content type from first match
              const firstMatch = matches[0][0].toLowerCase();
              const type = firstMatch.includes('unit') ? 'Unit' :
                          firstMatch.includes('lesson') ? 'Lesson' :
                          firstMatch.includes('chapter') ? 'Chapter' :
                          'Section';

              foundMatches = matches.map((match) => ({
                title: match[1]?.trim() || '',
                startIndex: match.index || 0,
                type
              }));
              break;
            }
          }

          setProgress(75);

          // Create sections based on matches
          if (foundMatches.length > 0) {
            foundMatches.forEach((match, index) => {
              const startPos = match.startIndex;
              const endPos = index < foundMatches.length - 1 
                ? foundMatches[index + 1].startIndex 
                : fullText.length;
              
              const content = fullText.slice(startPos, endPos).trim();
              let title = match.title || `${match.type} ${index + 1}`;
              
              // Clean up the title
              title = title
                .replace(/^\d+[\s.-]*/, '')
                .replace(/^[IVX]+[\s.-]*/, '')
                .trim();
              
              if (content && title) {
                chapters.push({
                  title: `${match.type} ${index + 1} - ${title}`,
                  content: content
                });
              }
            });
          } else {
            // If no sections found, try page-based splitting
            if (pageTexts.length > 1) {
              pageTexts.forEach((text, index) => {
                if (text.trim()) {
                  // Try to extract a title from the first line
                  const lines = text.trim().split('\n');
                  const title = lines[0].trim().replace(/^\d+[\s.-]*/, '');
                  const content = lines.slice(1).join('\n').trim();
                  
                  chapters.push({
                    title: title || `Section ${index + 1}`,
                    content: content || text
                  });
                }
              });
            } else {
              chapters.push({
                title: 'Section 1',
                content: fullText.trim()
              });
            }
          }

          if (chapters.length === 0) {
            throw new Error('No content sections could be extracted from the PDF.');
          }

          setProgress(100);
          return chapters;
        } catch (error) {
          console.error('Error processing PDF:', error);
          if (error instanceof Error) {
            throw new Error(`Failed to process PDF: ${error.message}`);
          }
          throw new Error('Failed to process PDF. Please check the file and try again.');
        } finally {
          setIsProcessing(false);
          setProgress(0);
        }
      };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setFile(file);
      } else {
        alert('Please upload a PDF file');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setFile(file);
      } else {
        alert('Please upload a PDF file');
      }
    }
  };

  const handleUpload = async () => {
    if (file) {
      try {
        const chapters = await extractChaptersFromPDF(file);
        if (chapters.length > 0) {
          onUpload(chapters);
          onClose();
        } else {
          alert('No chapters could be extracted from the PDF. Please check the file format.');
        }
      } catch (error) {
        console.error('Error processing PDF:', error);
        alert('Error processing PDF file. Please try again.');
      }
    }
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setProgress(0);
      setIsProcessing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Upload PDF File</h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {isProcessing ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-sm text-gray-600">Processing PDF...</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <>
              <div
                className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                  isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                    >
                      <span>Upload a PDF file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="application/pdf"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF files only</p>
                </div>
              </div>
              
              {file && (
                <div className="mt-4 p-3 bg-gray-50 border rounded-md">
                  <p className="text-sm font-medium text-gray-700">Selected file:</p>
                  <p className="text-sm text-gray-500 truncate">{file.name}</p>
                </div>
              )}
              
              <div className="mt-5 sm:mt-6 flex justify-end space-x-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleUpload}
                  disabled={!file}
                >
                  Process PDF
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadFileModal;