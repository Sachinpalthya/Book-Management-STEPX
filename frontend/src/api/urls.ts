import axiosInstance from './axiosInstance';

export interface WhitelistedUrl {
  id: number;
  url: string;
}

export interface BlockedUrl {
  id: number;
  url: string;
}

export const getWhitelistedUrls = async (): Promise<WhitelistedUrl[]> => {
  const response = await axiosInstance.get('/urls/whitelisted');
  return response.data;
};

export const addWhitelistedUrl = async (url: string): Promise<WhitelistedUrl> => {
  const response = await axiosInstance.post('/urls/whitelisted', { url });
  return response.data;
};

export const deleteWhitelistedUrl = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/urls/whitelisted/${id}`);
};

export const getBlockedUrls = async (): Promise<BlockedUrl[]> => {
  const response = await axiosInstance.get('/urls/blocked');
  return response.data;
};

export const addBlockedUrl = async (url: string): Promise<BlockedUrl> => {
  const response = await axiosInstance.post('/urls/blocked', { url });
  return response.data;
};

export const deleteBlockedUrl = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/urls/blocked/${id}`);
};

export const checkUrl = async (url: string): Promise<{ allowed: boolean; reason: string }> => {
  const response = await axiosInstance.post('/urls/check', { url });
  return response.data;
}; 