import axiosInstance from './axiosInstance';

export interface Setting {
  key: string;
  value: string | boolean | number | object;
  type: 'string' | 'boolean' | 'number' | 'json';
}

export const getAllSettings = async (): Promise<Setting[]> => {
  const response = await axiosInstance.get('/settings');
  return response.data;
};

export const getSettingByKey = async (key: string): Promise<Setting> => {
  const response = await axiosInstance.get(`/settings/${key}`);
  return response.data;
};

export const createOrUpdateSetting = async (setting: Setting): Promise<Setting> => {
  const response = await axiosInstance.post('/settings', setting);
  return response.data;
};

export const deleteSetting = async (key: string): Promise<void> => {
  await axiosInstance.delete(`/settings/${key}`);
}; 