import UserDB from "./UserDB";
export interface Forum {
  id: number;
  uuid: string;
  category: string;
  title: string;
  description: string;
  created_at: string;
  user: string;
  likes: number;
  forum_likes_count?: number;
  comment_count: number;
  users: UserDB;
}

export default Forum;
