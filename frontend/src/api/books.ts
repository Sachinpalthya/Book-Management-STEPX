import axiosInstance from './axiosInstance';
import { Book, CreateBookPayload } from '../types/book';

export const getBooks = async (): Promise<Book[]> => {
  const response = await axiosInstance.get('/books');
  return response.data;
};

export const createBook = async (bookData: CreateBookPayload): Promise<Book> => {
  const response = await axiosInstance.post('/books', bookData);
  return response.data;
};