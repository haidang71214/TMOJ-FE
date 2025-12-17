export interface CommentData {
  id: number;
  user: string;
  date: string;
  title?: string;
  content: string;
  code?: string;
  likes: number;
  isLiked: boolean;
  isDisliked: boolean;
  repliesCount?: number;
  replies?: CommentData[];
  color: string;
}
