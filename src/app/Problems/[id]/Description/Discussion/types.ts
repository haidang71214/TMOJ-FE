export interface CommentData {
  id: number;
  user: string;
  date: string;
  content: string;
  likes: number;
  isLiked: boolean;
  isDisliked: boolean;
  color: string;
  repliesCount?: number;
  replies?: CommentData[];
}
