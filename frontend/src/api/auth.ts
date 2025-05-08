import axiosInstance from './axiosInstance';
import { LoginCredentials, RegisterCredentials, User } from '../types/auth';

export const login = async (credentials: LoginCredentials): Promise<User> => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};

export const register = async (credentials: RegisterCredentials): Promise<User> => {
  const response = await axiosInstance.post('/auth/register', credentials);
  return response.data;
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const response = await axiosInstance.post('/auth/forgot-password', { email });
  return response.data;
};