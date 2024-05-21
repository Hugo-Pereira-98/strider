# Posterr - A Simple Twitter-Like App

## Overview

Posterr is a simple social media application built with Next.js, Tailwind CSS, and TypeScript. It mimics core Twitter features like creating posts, liking, retweeting, and commenting. All data is stored locally using IndexedDB, and user sessions are managed with cookies

## Features

- **User Authentication**: Local sign-up and login system with Base64-encoded passwords
- **Data Storage**: All data is stored locally using IndexedDB
- **User Sessions**: Managed using cookies
- **Post Creation**: Users can create posts and tag others using "@"
- **Interactions**: Like, retweet, and comment on posts
- **Discover Users**: Explore the network and visit user profiles
- **Profile Posting**: Create posts on behalf of other users
- **Settings**: Sign out or change the theme

## Getting Started

1. Unzip the provided folder
2. Create a `.env.local` file with the following content: NEXT_PUBLIC_AUTH0_CLIENT_SECRET=your_random_string
3. Run the application with:

```bash
npm install
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Authentication Flow

- Click "Join Us" on the sign-in page to create an account
- Provide a username, email, and password. The password is stored in IndexedDB using Base64 encoding
- New users get fake followers and followings to simulate a real account experience

## Initial Data

- The app generates fake users and posts on the first run to populate the feed

## User Guide

### Feed

- **All Posts**: View all posts in the network
- **Following**: View posts from users you follow
- **Create Posts**: Share your thoughts and tag other users

### User Interaction

- **Like**: Like posts from other users
- **Retweet**: Retweet posts to share them with your followers
- **Comment**: Leave comments on posts

### Discover

- **User Profiles**: Browse and discover other users
- **Profile Posting**: Visit profiles and create posts on their behalf

### Settings

- **Sign Out**: Log out of the app
- **Theme Change**: Switch between light and dark themes

Enjoy using Posterr!

---

## Planning

Questions I would make to implement the new feature (I had this partially done, you can check when creating
or editing a post, you can type @ to tag someone)

1. Should the reply posts have any special formatting or styling to distinguish them from regular posts?
2. Can a post have multiple replies, and if so, how should they be displayed (e.g., threaded view)?
3. Will there be any notification mechanism for users when their post gets a reply?
4. Should there be any specific validation for the replies?
5. Will the "Posts and Replies" feed show only replies created by the user, or also replies received on the user's posts?

#### Database Changes

- **Posts Object**: Modify the existing post object to include a new field, `replyToPostId`, which will store the ID of the post being replied to

  ```json
  {
    "id": "string",
    "userId": "string",
    "content": "string",
    "replyToPostId": "string", // New field
    "postDate": "Date",
    "likes": ["array of userIds"],
    "retweets": ["array of userIds"],
    "comments": ["array of comment objects"]
  }
  ```

## Critique

Areas that I would consider for improvement:

- **Design Sharpening**: Enhance the user interface for better usability think more about the components and pages
- **Response Times**: Optimize data fetching and state management to improve responsiveness
- **Data Management**: IndexedDB has limitations, I would migrate to MongoDB and Redis
- **Testing**: Implement Cypress for testing
- **Component Documentation**: Use Storybook to document the components and bring to the design sessions

### Scaling Considerations

If this project were to grow, these would be my attention points:

- **Database**: Transition to a server-side database like MongoDB (similar to what I did with indexedDB)
- **API Performance**: Use SSR or SSG with Next.js
- **Load Balancing**: Use load balancers to distribute traffic
- **Caching**: Use Redis to cache non-sensitive data
