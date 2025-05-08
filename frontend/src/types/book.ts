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