import axiosInstance from './axiosInstance';
import { Chapter, CreateChapterPayload } from '../types/chapter';

export const getChapters = async (): Promise<Chapter[]> => {
  const response = await axiosInstance.get('/chapters');
  return response.data;
};

export const getChaptersBySubject = async (subjectId: string): Promise<Chapter[]> => {
  const response = await axiosInstance.get('/chapters', {
    params: { subject: subjectId }
  });
  return response.data;
};

export const createChapter = async (chapterData: CreateChapterPayload): Promise<Chapter> => {
  const response = await axiosInstance.post('/chapters', chapterData);
  return response.data;
};

export const updateChapterUrl = async (chapterId: string, qrUrl: string): Promise<Chapter> => {
  const response = await axiosInstance.patch(`/chapters/${chapterId}/url`, { qrUrl });
  return response.data;
};