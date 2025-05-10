import { AcademicYear } from './academicYear';

export interface Branch {
  id: number;
  name: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  years?: AcademicYear[];
}

export interface CreateBranchData {
  name: string;
  location: string;
  academicYearIds?: number[];
} 