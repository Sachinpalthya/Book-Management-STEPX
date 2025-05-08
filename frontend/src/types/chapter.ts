export interface Chapter {
  _id: string;
  title: string;
  description: string;
  qrId: string;
  qrContent: string;
  qrUrl: string;
  subject: string;
  createdAt: string;
}

export interface CreateChapterPayload {
  title: string;
  description: string;
  qrContent: string;
  qrUrl: string;
  subjectId: string;
}