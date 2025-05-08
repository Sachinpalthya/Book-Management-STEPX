import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Loader2, Plus, BookOpen } from 'lucide-react';
import SubjectCard from './SubjectCard';
import Button from '../common/Button';
import CreateBookModal from './CreateBookModal';
import { Subject, SUBJECT_COLORS, YearType } from '../../types/subject';
import { getSubjectsByYear, createSubject } from '../../api/subjects';
import { getBooks } from '../../api/books';

interface SubjectGridProps {
  year: YearType;
}

const SubjectGrid: React.FC<SubjectGridProps> = ({ year }) => {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreateBookModal, setShowCreateBookModal] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: '',
    description: '',
    book: '',
  });

  const { data: subjects, isLoading, error } = useQuery(
    ['subjects', year],
    () => getSubjectsByYear(year),
    {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    }
  );

  const { data: books, isLoading: loadingBooks } = useQuery(
    'books',
    getBooks,
    {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    }
  );

  const createMutation = useMutation(
    (data: { name: string; description: string; year: string; book: string }) =>
      createSubject(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['subjects', year]);
        setShowCreateForm(false);
        setNewSubject({ name: '', description: '', book: '' });
      },
    }
  );

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.book) {
      alert('Please select a book');
      return;
    }
    createMutation.mutate({
      ...newSubject,
      year,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Failed to load subjects. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {year === 'Masters' ? 'Masters' : `${year} Year`} Subjects
        </h2>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowCreateBookModal(true)}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Add Book
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowCreateForm(true)}
            disabled={!books || books.length === 0}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Subject
          </Button>
        </div>
      </div>

      {(!books || books.length === 0) && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">
            Please create a book first before adding subjects.
          </p>
        </div>
      )}

      {showCreateForm && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <form onSubmit={handleCreateSubject} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Subject Name
              </label>
              <input
                type="text"
                id="name"
                value={newSubject.name}
                onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={newSubject.description}
                onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div>
              <label htmlFor="book" className="block text-sm font-medium text-gray-700">
                Select Book
              </label>
              <select
                id="book"
                value={newSubject.book}
                onChange={(e) => setNewSubject({ ...newSubject, book: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                required
              >
                <option value="">Select a book...</option>
                {books?.map((book) => (
                  <option key={book._id} value={book._id}>
                    {book.title}
                  </option>
                ))}
              </select>
              {loadingBooks && <p className="mt-1 text-sm text-gray-500">Loading books...</p>}
              {!loadingBooks && (!books || books.length === 0) && (
                <p className="mt-1 text-sm text-red-500">
                  No books available. Please create a book first.
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={createMutation.isLoading || !books || books.length === 0}
              >
                {createMutation.isLoading ? 'Creating...' : 'Create Subject'}
              </Button>
            </div>
          </form>
        </div>
      )}
      
      {subjects && subjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {subjects.map((subject, index) => (
            <SubjectCard
              key={subject._id}
              id={subject._id}
              name={subject.name}
              colorClass={SUBJECT_COLORS[index % SUBJECT_COLORS.length]}
              year={year}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-gray-600">No subjects found for this year.</p>
        </div>
      )}

      <CreateBookModal 
        isOpen={showCreateBookModal} 
        onClose={() => setShowCreateBookModal(false)} 
      />
    </div>
  );
};

export default SubjectGrid;