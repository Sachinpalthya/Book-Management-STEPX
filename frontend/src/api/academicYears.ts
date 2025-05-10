import axiosInstance from './axiosInstance';
import { AcademicYear } from '../types/academicYear';

export const getAcademicYears = async (): Promise<AcademicYear[]> => {
  console.log(axiosInstance.getUri());
  const response = await axiosInstance.get('/academic-years');
  return response.data;
};

export const createAcademicYear = async (label: string): Promise<AcademicYear> => {
  const response = await axiosInstance.post('/academic-years', { label });
  return response.data;
};

export const updateAcademicYear = async (id: number, label: string): Promise<AcademicYear> => {
  const response = await axiosInstance.put(`/academic-years/${id}`, { label });
  return response.data;
};

export const deleteAcademicYear = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/academic-years/${id}`);
}; 