import React, { useState, useEffect } from 'react';
import { createSubject } from '../../api/subjects';
import { Subject } from '../../types/subject';
import { getAcademicYears } from '../../api/academicYears';
import { getBranches } from '../../api/branches';
import { AcademicYear } from '../../types/academicYear';
import { Branch } from '../../types/branch';

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: Subject) => void;
  year: string;
}

const AddSubjectModal: React.FC<AddSubjectModalProps> = ({ isOpen, onClose, onSuccess, year }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedBranches, setSelectedBranches] = useState<number[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [years, branchList] = await Promise.all([
          getAcademicYears(),
          getBranches()
        ]);
        setAcademicYears(years);
        setBranches(branchList);
      } catch (err) {
        setError('Failed to load academic years and branches');
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAcademicYear || selectedBranches.length === 0) {
      setError('Please select both academic year and at least one branch');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newSubject = await createSubject({
        name,
        description,
        academicYearId: selectedAcademicYear,
        branchIds: selectedBranches,
      });
      onSuccess(newSubject);
      onClose();
    } catch (err) {
      setError('Failed to create subject. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBranchChange = (branchId: number) => {
    setSelectedBranches(prev => 
      prev.includes(branchId)
        ? prev.filter(id => id !== branchId)
        : [...prev, branchId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add New Subject</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Academic Year <span className="text-red-500">*</span></label>
            <select
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Academic Year</option>
              {academicYears.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Branches <span className="text-red-500">*</span></label>
            <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
              {branches.map((branch) => (
                <div key={branch.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`branch-${branch.id}`}
                    checked={selectedBranches.includes(branch.id)}
                    onChange={() => handleBranchChange(branch.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`branch-${branch.id}`} className="ml-2 block text-sm text-gray-900">
                    {branch.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubjectModal; 