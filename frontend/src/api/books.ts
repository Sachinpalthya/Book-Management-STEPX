import axiosInstance from './axiosInstance';
import { Book, CreateBookPayload, UploadPDFResponse } from '../types/book';

export const getBooks = async (): Promise<Book[]> => {
  const response = await axiosInstance.get('/books');
  return response.data;
};

export const createBook = async (bookData: CreateBookPayload): Promise<Book> => {
  const response = await axiosInstance.post('/books', bookData);
  return response.data;
};

export const uploadSubjectPDF = async (
  file: File,
  year: string,
  bookId: string
): Promise<UploadPDFResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('year', year);
  formData.append('book', bookId);

  const response = await axiosInstance.post('/subjects/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};