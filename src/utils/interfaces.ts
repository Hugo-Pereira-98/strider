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
  retweetFrom?: number | null;
  comments: Comment[];
  tagged: Pick<User, 'userId' | 'userName' | 'email'>[];
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
