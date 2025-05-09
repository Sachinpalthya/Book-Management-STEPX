export interface Chapter {
  _id: string;
  title: string;
  description?: string;
  qrContent?: string;
  qrUrl?: string;
  subject: string;
  pageStart?: number;
  pageEnd?: number;
  subQRs: SubQR[];
  createdAt: string;
}

export interface SubQR {
  _id: string;
  title: string;
  qrContent: string;
  qrUrl: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateChapterPayload {
  title: string;
  description: string;
  subjectId: string;
}

export interface AddSubQRPayload {
  title: string;
  url: string;
  chapterId: string;
}

export interface ChapterCreationResponse {
  message: string;
  details?: string;
  chapters: Chapter[];
}

export interface APIErrorResponse {
  message: string;
  details?: string;
}