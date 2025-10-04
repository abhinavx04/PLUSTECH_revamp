export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  featured: boolean;
  imageUrl?: string;
  tags: string[];
}

export interface CreateNewsData {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  published: boolean;
  featured: boolean;
  imageUrl?: string;
  tags: string[];
}

export interface UpdateNewsData extends Partial<CreateNewsData> {
  id: string;
}
