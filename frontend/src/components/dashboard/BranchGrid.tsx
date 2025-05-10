import React, { useEffect, useState } from 'react';
import SubjectCard from './SubjectCard';
import Button from '../common/Button';
import { Upload } from 'lucide-react';
import { SUBJECT_COLORS } from '../../types/subject';
import UploadSubjectPDF from './UploadSubjectPDF';
import { getBranches } from '../../api/branches';
import { getSubjects } from '../../api/subjects';
import { Branch } from '../../types/branch';
import { Subject } from '../../types/subject';
import AddBranchModal from './AddBranchModal';
import AddSubjectModal from './AddSubjectModal';

interface BranchGridProps {
  year: string;
}

const BranchGrid: React.FC<BranchGridProps> = ({ year }) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);

  const handleUploadSuccess = (data: any) => {
    setIsUploadModalOpen(false);
  };

  const handleBranchSuccess = (newBranch: Branch) => {
    setBranches(prev => [...prev, newBranch]);
    setIsAddBranchModalOpen(false);
  };

  const handleSubjectSuccess = (newSubject: Subject) => {
    if (selectedBranch) {
      setSubjects(prev => [...prev, newSubject]);
    }
    setIsAddSubjectModalOpen(false);
  };

  const fetchBranches = async () => {
    try {
      const branchList = await getBranches(year);
      setBranches(branchList);
    } catch (error) {
      console.error('Failed to fetch branches:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async (branchId: number) => {
    try {
      const subjectList = await getSubjects({ branchId: branchId.toString() });
      setSubjects(subjectList);
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
    }
  };

  const handleBranchClick = async (branch: Branch) => {
    setSelectedBranch(branch);
    await fetchSubjects(branch.id);
  };

  useEffect(() => {
    fetchBranches();
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
          {selectedBranch && (
            <Button
              variant="primary"
              onClick={() => setIsAddSubjectModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              Add Subject to {selectedBranch.name}
            </Button>
          )}
        </div>
      </div>
      
      {!selectedBranch ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {branches.map((branch, index) => (
            <div
              key={branch.id}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onClick={() => handleBranchClick(branch)}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Upload className="h-10 w-10 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{branch.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">Click to view subjects</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div className="flex items-center mb-6">
            <button
              onClick={() => setSelectedBranch(null)}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <span className="mr-2">←</span> Back to Branches
            </button>
            <h3 className="text-2xl font-bold text-gray-800 ml-4">
              Subjects in {selectedBranch.name}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {subjects.map((subject, index) => (
              <SubjectCard
                key={subject.id}
                id={subject.id}
                name={subject.name}
                colorClass={SUBJECT_COLORS[index % SUBJECT_COLORS.length]}
                year={year}
              />
            ))}
          </div>
        </div>
      )}

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