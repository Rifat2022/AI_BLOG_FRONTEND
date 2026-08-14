export interface Blog {
  id: string;
  title: string;
  content: string;
  topic: string;
  platform: string;
  status: 'draft' | 'published' | 'archived';
  categoryId: string;
  categoryName?: string;
  imageUrl?: string;
  authorId: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}