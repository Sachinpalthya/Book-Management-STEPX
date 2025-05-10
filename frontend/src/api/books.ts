import axiosInstance from './axiosInstance';
import { Book, CreateBookPayload, UploadPDFResponse } from '../types/book';

export const getBooks = async (params?: { subjectId?: string; branchId?: string; academicYearId?: string }): Promise<Book[]> => {
  const response = await axiosInstance.get('/books', { params });
  return response.data;
};

export const getBookById = async (id: string): Promise<Book> => {
  const response = await axiosInstance.get(`/books/${id}`);
  return response.data;
};

export const createBook = async (bookData: CreateBookPayload): Promise<Book> => {
  const response = await axiosInstance.post('/books', bookData);
  return response.data;
};

export const updateBook = async (id: string, bookData: CreateBookPayload): Promise<Book> => {
  const response = await axiosInstance.put(`/books/${id}`, bookData);
  return response.data;
};

export const deleteBook = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/books/${id}`);
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