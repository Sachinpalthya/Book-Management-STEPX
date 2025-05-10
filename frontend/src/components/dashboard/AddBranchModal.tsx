import React, { useState, useEffect } from 'react';
import { createBranch } from '../../api/branches';
import { getAcademicYears } from '../../api/academicYears';
import { Branch } from '../../types/branch';
import { AcademicYear } from '../../types/academicYear';

interface AddBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: Branch) => void;
}

const AddBranchModal: React.FC<AddBranchModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);

  useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        const years = await getAcademicYears();
        setAcademicYears(years);
      } catch (err) {
        console.error('Failed to fetch academic years:', err);
      }
    };

    if (isOpen) {
      fetchAcademicYears();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const newBranch = await createBranch({ 
        name, 
        location,
        academicYearIds: selectedYears
      });
      onSuccess(newBranch);
      onClose();
    } catch (err) {
      setError('Failed to create branch. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (yearId: number) => {
    setSelectedYears(prev => 
      prev.includes(yearId)
        ? prev.filter(id => id !== yearId)
        : [...prev, yearId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add New Branch</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Branch Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Academic Years</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {academicYears.map((year) => (
                <div key={year.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`year-${year.id}`}
                    checked={selectedYears.includes(year.id)}
                    onChange={() => handleYearChange(year.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`year-${year.id}`} className="ml-2 block text-sm text-gray-900">
                    {year.label}
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
              {loading ? 'Creating...' : 'Create Branch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBranchModal; 