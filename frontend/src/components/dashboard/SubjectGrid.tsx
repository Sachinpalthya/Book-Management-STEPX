import React, { useState } from 'react';
import SubjectCard from './SubjectCard';
import Button from '../common/Button';
import { Upload } from 'lucide-react';
import { SUBJECT_LIST, SUBJECT_COLORS } from '../../types/subject';
import UploadSubjectPDF from './UploadSubjectPDF';

interface SubjectGridProps {
  year: string;
}

const SubjectGrid: React.FC<SubjectGridProps> = ({ year }) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  
  const handleUploadSuccess = (data: any) => {
    // Handle successful upload
    setIsUploadModalOpen(false);
    // Refresh subjects list if needed
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {year === 'Masters' ? 'Masters' : `${year} Year`} Subjects
          </h2>
          <p className="text-gray-600">Manage your academic subjects and course materials</p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Subject
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {SUBJECT_LIST.map((subject, index) => (
          <SubjectCard
            key={index}
            id={`subject-${index}`}
            name={subject}
            colorClass={SUBJECT_COLORS[index % SUBJECT_COLORS.length]}
            year={year}
          />
        ))}
      </div>

      <UploadSubjectPDF
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleUploadSuccess}
        year={year}
      />
    </div>
  );
};

export default SubjectGrid;