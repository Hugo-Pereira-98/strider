export interface User {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  themePreference: string;
}

export interface Following {
  id?: number;
  following: string;
  followed: string;
}

export interface Post {
  id?: number;
  email: string;
  post: string;
  tagged: string[];
  postDate: Date;
  retweets?: number;
  likes?: number;
}

export interface Retweet {
  id?: number;
  userId: string;
  postId: number;
  retweetedDate: Date;
}

export interface Like {
  id?: number;
  userId: string;
  postId: number;
  likeDate: Date;
}

export interface Comment {
  id?: number;
  userId: string;
  postId: number;
  comment: string;
  commentDate: Date;
}
