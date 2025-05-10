import React, { useEffect, useState } from 'react';
import SubjectCard from './SubjectCard';
import Button from '../common/Button';
import { Upload } from 'lucide-react';
import { SUBJECT_LIST, SUBJECT_COLORS } from '../../types/subject';
import UploadSubjectPDF from './UploadSubjectPDF';
import { getAcademicYears } from '../../api/academicYears';
import { getBranches } from '../../api/branches';
import { Branch } from '../../types/branch';
import AddBranchModal from './AddBranchModal';
import AddSubjectModal from './AddSubjectModal';

interface BranchGridProps {
  year: string;
}

const BranchGrid: React.FC<BranchGridProps> = ({ year }) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [branch, setBranch] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  const handleUploadSuccess = (data: any) => {
    setIsUploadModalOpen(false);
  };

  const handleBranchSuccess = (newBranch: Branch) => {
    setBranch(prev => [...prev, newBranch]);
    setIsAddBranchModalOpen(false);
  };

  const handleSubjectSuccess = (newSubject: any) => {
    // Refresh the branch list to show the new subject
    fetchBranchs();
    setIsAddSubjectModalOpen(false);
  };

  const fetchBranchs = async () => {
    try {
      const years = await getBranches(year);
      setBranch(years);
    } catch (error) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranchs();
  }, [year]);
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {year} Branches
          </h2>
          <p className="text-gray-600">Manage your academic subjects and course materials</p>
        </div>
        
        <div className="space-x-4">
          <Button
            variant="primary"
            onClick={() => setIsAddBranchModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            Add Branch
          </Button>
          <Button
            variant="primary"
            onClick={() => setIsAddSubjectModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            Add Subject
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {branch.map((subject, index) => (
          <SubjectCard
            key={index}
            id={`subject-${index}`}
            name={subject.name}
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

      <AddBranchModal
        isOpen={isAddBranchModalOpen}
        onClose={() => setIsAddBranchModalOpen(false)}
        onSuccess={handleBranchSuccess}
      />

      <AddSubjectModal
        isOpen={isAddSubjectModalOpen}
        onClose={() => setIsAddSubjectModalOpen(false)}
        onSuccess={handleSubjectSuccess}
        year={year}
      />
    </div>
  );
};

export default BranchGrid;