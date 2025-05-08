import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useMutation, useQueryClient } from 'react-query';
import Button from '../common/Button';
import InputField from '../common/InputField';
import { createBook } from '../../api/books';

interface CreateBookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateBookModal: React.FC<CreateBookModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [bookData, setBookData] = useState({
    title: '',
    description: '',
    publisher: '',
    year: new Date().getFullYear().toString()
  });

  const createMutation = useMutation(createBook, {
    onSuccess: () => {
      queryClient.invalidateQueries('books');
      onClose();
      setBookData({
        title: '',
        description: '',
        publisher: '',
        year: new Date().getFullYear().toString()
      });
    }
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(bookData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Create New Book</h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              id="title"
              label="Book Title"
              value={bookData.title}
              onChange={(e) => setBookData({ ...bookData, title: e.target.value })}
              required
            />
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={bookData.description}
                onChange={(e) => setBookData({ ...bookData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                rows={3}
                required
                minLength={10}
              />
            </div>
            
            <InputField
              id="publisher"
              label="Publisher"
              value={bookData.publisher}
              onChange={(e) => setBookData({ ...bookData, publisher: e.target.value })}
            />
            
            <InputField
              id="year"
              label="Year"
              type="number"
              value={bookData.year}
              onChange={(e) => setBookData({ ...bookData, year: e.target.value })}
            />
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={createMutation.isLoading}
              >
                {createMutation.isLoading ? 'Creating...' : 'Create Book'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBookModal;