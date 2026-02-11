export interface SolutionData {
  id: number;
  author: string;
  avatar: string;
  title: string;
  tags: string[];
  upvotes: number;
  views: string;
  comments: number;
  date: string;
  isEditorial?: boolean;
  content?: string;
}
