import axiosInstance from './axiosInstance';
import { Branch, CreateBranchData } from '../types/branch';

export const getBranches = async (academicYearcode?: string): Promise<Branch[]> => {
  const response = await axiosInstance.get('/branches', {
    params: { academicYearcode }
  });
  return response.data;
};

export const createBranch = async (data: CreateBranchData): Promise<Branch> => {
  const response = await axiosInstance.post('/branches', data);
  return response.data;
};

export const updateBranch = async (id: number, data: CreateBranchData): Promise<Branch> => {
  const response = await axiosInstance.put(`/branches/${id}`, data);
  return response.data;
};

export const deleteBranch = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/branches/${id}`);
}; 