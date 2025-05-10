export interface Subject {
  id: string;
  name: string;
  description?: string;
  userId: number;
  branchId?: number;
  academicYearId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubjectPayload {
  name: string;
  description?: string;
  academicYearId?: string;
  branchId?: number;
}

// List of available subjects for demonstration
export const SUBJECT_LIST = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'English',
  'History',
  'Geography',
];

// Colors for subject cards
export const SUBJECT_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-gray-500',
];