import React, { useState } from 'react';
import { FileText, Upload, X, Loader2, Check } from 'lucide-react';
import Button from '../common/Button';
import { uploadSubjectFile } from '../../api/subjects';

interface UploadSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
  year: string;
}

interface ProcessingStatus {
  stage: 'uploading' | 'extracting' | 'creating' | 'complete';
  message: string;
  progress: number;
}

const UploadSubjectModal: React.FC<UploadSubjectModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  year
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    stage: 'uploading',
    message: '',
    progress: 0
  });

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
      if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        setFile(file);
      } else {
        alert('Please upload a PDF or Excel file');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        setFile(file);
      } else {
        alert('Please upload a PDF or Excel file');
      }
    }
  };

  const getStatusMessage = (stage: ProcessingStatus['stage']) => {
    switch (stage) {
      case 'uploading':
        return 'Uploading file...';
      case 'extracting':
        return 'Extracting chapters from file...';
      case 'creating':
        return 'Creating subject and chapters...';
      case 'complete':
        return 'Processing complete!';
      default:
        return 'Processing...';
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please upload a file');
      return;
    }

    setIsProcessing(true);
    setProcessingStatus({
      stage: 'uploading',
      message: 'Uploading file...',
      progress: 0
    });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('year', year);

      const data = await uploadSubjectFile(formData);
      
      setProcessingStatus({
        stage: 'complete',
        message: `Successfully created subject with ${data.chapters?.length || 0} chapters`,
        progress: 100
      });

      setTimeout(() => {
        onSuccess(data);
        onClose();
      }, 1500);

    } catch (error: any) {
      console.error('Error uploading file:', error);
      alert(error.response?.data?.message || 'Failed to process file. Please try again.');
      setIsProcessing(false);
    }
  };

  const renderProcessingStatus = () => (
    <div className="text-center py-8">
      <div className="mb-4">
        {processingStatus.stage === 'complete' ? (
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
            <Check className="h-6 w-6 text-green-600" />
          </div>
        ) : (
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
        )}
      </div>

      <p className="text-sm font-medium text-gray-900 mb-2">
        {getStatusMessage(processingStatus.stage)}
      </p>
      
      <p className="text-sm text-gray-500 mb-4">
        {processingStatus.message}
      </p>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${
            processingStatus.stage === 'complete' ? 'bg-green-500' : 'bg-blue-500'
          }`}
          style={{ width: `${processingStatus.progress}%` }}
        />
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Upload Subject File</h3>
            {!isProcessing && (
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          {isProcessing ? (
            renderProcessingStatus()
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
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept=".pdf,.xlsx"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF or Excel files only</p>
                </div>
              </div>
              
              {file && (
                <div className="mt-4 p-3 bg-gray-50 border rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
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
                  Upload and Process
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadSubjectModal;
