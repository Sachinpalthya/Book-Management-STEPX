import axiosInstance from './axiosInstance';
import { Subject, CreateSubjectPayload } from '../types/subject';

export const getSubjects = async (): Promise<Subject[]> => {
  const response = await axiosInstance.get('/subjects');
  return response.data;
};

export const getSubjectsByYear = async (year: string): Promise<Subject[]> => {
  const response = await axiosInstance.get('/subjects', {
    params: { year }
  });
  return response.data;
};

export const createSubject = async (subjectData: CreateSubjectPayload): Promise<Subject> => {
  const response = await axiosInstance.post('/subjects', subjectData);
  return response.data;
};