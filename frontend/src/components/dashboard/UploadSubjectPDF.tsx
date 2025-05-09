import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import Button from '../common/Button';
import { YearType } from '../../types/subject';

interface UploadSubjectPDFProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
  year: YearType;
}

const UploadSubjectPDF: React.FC<UploadSubjectPDFProps> = ({
  isOpen,
  onClose,
  onSuccess,
  year
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    try {
      // Here you would typically upload the file to your backend
      // For now, we'll just simulate a successful upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSuccess({ success: true });
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Upload Subject PDF</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 text-center mb-2">
                Drag and drop your PDF here, or click to select
              </p>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
          </div>

          {file && (
            <p className="text-sm text-gray-600">
              Selected file: {file.name}
            </p>
          )}

          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={onClose}
              className="px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={!file || loading}
            >
              {loading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadSubjectPDF;