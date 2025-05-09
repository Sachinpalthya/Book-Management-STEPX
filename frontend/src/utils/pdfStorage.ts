import axiosInstance from '../api/axiosInstance';

export const uploadPDF = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post('/upload/pdf', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.url;
};

export const getPDFPageUrl = (pdfUrl: string, pageNumber: number): string => {
  const baseUrl = process.env.VITE_API_URL || 'http://localhost:5000';
  return `${baseUrl}/pdf-viewer?file=${pdfUrl}&page=${pageNumber}`;
};

export const generateChapterUrl = (pdfUrl: string, startPage: number): string => {
  return getPDFPageUrl(pdfUrl, startPage);
};