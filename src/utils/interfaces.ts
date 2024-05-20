export interface User {
  userId: number;
  userName: string;
  email: string;
  password: string;
  dateJoined: Date;
  themePreference: string;
  following: Pick<User, 'userId' | 'userName' | 'email'>[];
  followers: Pick<User, 'userId' | 'userName' | 'email'>[];
}

export interface Post {
  id?: number;
  userId: number;
  post: string;
  postDate: Date;
  retweets: number[];
  likes: number[];
  retweetFrom?: RetweetFrom | null;
  comments: Comment[];
  tagged: Pick<User, 'userId' | 'userName' | 'email'>[];
}

export interface RetweetFrom {
  postId: number;
  postDate: Date;
  tagged: Pick<User, 'userId' | 'userName' | 'email'>[];
  post: string;
  userId: number;
  userName: string;
  email: string;
}

export interface Comment {
  id: number;
  userId: number;
  userName: string;
  email: string;
  comment: string;
  commentDate: Date;
}

export type ThemePreference = 'LIGHT' | 'DARK' | 'SYSTEM';
