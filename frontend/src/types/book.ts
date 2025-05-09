export interface Book {
  _id: string;
  title: string;
  description: string;
  publisher: string;
  year: string;
  user: string;
  createdAt: string;
}

export interface CreateBookPayload {
  title: string;
  description: string;
  publisher: string;
  year: string;
}

export interface UploadPDFResponse {
  subject: {
    _id: string;
    name: string;
    description: string;
    year: string;
    book: string;
  };
  chapters: Array<{
    _id: string;
    title: string;
    pageStart: number;
    pageEnd: number;
    qrUrl: string;
  }>;
  pdfUrl: string;
  mainQrUrl: string;
}

export interface SubQRCode {
  title: string;
  url: string;
  qrUrl: string;
  createdAt: string;
}