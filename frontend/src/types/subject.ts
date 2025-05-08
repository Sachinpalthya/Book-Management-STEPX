export interface Subject {
  _id: string;
  name: string;
  description: string;
  year: string;
  book: string;
  createdAt: string;
}

export interface CreateSubjectPayload {
  name: string;
  description: string;
  year: string;
  book: string;
}

export type YearType = '1st' | '2nd' | 'Masters';

// List of available subjects for demonstration
export const SUBJECT_LIST = [
  'English',
  'Telugu',
  'Hindi',
  'Sanskrit',
  'Mathematics',
  'Physics',
  'Biology',
  'Zoology',
  'Chemistry'
];

// Colors for subject cards
export const SUBJECT_COLORS = [
  'bg-blue-100 border-blue-300',
  'bg-green-100 border-green-300',
  'bg-purple-100 border-purple-300',
  'bg-yellow-100 border-yellow-300',
  'bg-red-100 border-red-300',
  'bg-indigo-100 border-indigo-300',
  'bg-pink-100 border-pink-300',
  'bg-teal-100 border-teal-300',
  'bg-orange-100 border-orange-300',
];