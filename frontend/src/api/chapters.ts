import axiosInstance from './axiosInstance';
import { Chapter, CreateChapterPayload, AddSubQRPayload } from '../types/chapter';

export const getChaptersBySubject = async (subjectId: string): Promise<Chapter[]> => {
  try {
    const response = await axiosInstance.get('/chapters', {
      params: { subject: subjectId }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching chapters:', error);
    throw error.response?.data || error;
  }
};

export const createChapter = async (chapterData: CreateChapterPayload): Promise<Chapter> => {
  try {
    const response = await axiosInstance.post('/chapters', chapterData);
    return response.data;
  } catch (error: any) {
    console.error('Error creating chapter:', error);
    throw error.response?.data || error;
  }
};

export const addSubQR = async (data: AddSubQRPayload): Promise<Chapter> => {
  try {
    const response = await axiosInstance.post(`/chapters/${data.chapterId}/sub-qr`, {
      title: data.title,
      qrUrl: data.url
    });
    return response.data;
  } catch (error: any) {
    console.error('Error adding sub QR:', error);
    throw error.response?.data || error;
  }
};

export const deleteChapter = async (chapterId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/chapters/${chapterId}`);
  } catch (error: any) {
    console.error('Error deleting chapter:', error);
    throw error.response?.data || error;
  }
};

export interface ChapterCreationResponse {
  message: string;
  details?: string;
  chapters: Chapter[];
}

export const createChaptersFromPDF = async (
  subjectId: string, 
  chapters: { title: string; content: string }[]
): Promise<ChapterCreationResponse> => {
  try {
    const response = await axiosInstance.post('/chapters/pdf', {
      subjectId,
      chapters
    });
    
    // If we got a 207 status, some chapters failed but others succeeded
    if (response.status === 207) {
      return {
        message: response.data.message,
        details: response.data.details,
        chapters: response.data.chapters
      };
    }

    return {
      message: response.data.message,
      chapters: response.data.chapters
    };
  } catch (error: any) {
    console.error('Error creating chapters from PDF:', error);
    throw {
      message: error.response?.data?.message || 'Failed to create chapters from PDF',
      details: error.response?.data?.details || error.message,
      chapters: []
    };
  }
};