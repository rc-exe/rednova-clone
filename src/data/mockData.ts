// Mock data for Reddit clone - this will be replaced with real data from Supabase

export const mockPosts = [
  {
    id: "1",
    title: "Just launched my new React app! What do you think?",
    content: "After months of development, I finally launched my personal project. It's a task management app built with React, TypeScript, and Tailwind CSS. Would love to hear your feedback!",
    author: "developer_mike",
    subreddit: "r/reactjs",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    upvotes: 245,
    downvotes: 12,
    commentCount: 34,
    type: "text" as const,
    flair: "Project",
    awards: 3,
    isStickied: false,
  },
  {
    id: "2", 
    title: "CSS Grid vs Flexbox: When to use which?",
    content: "",
    author: "css_guru",
    subreddit: "r/webdev",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    upvotes: 1234,
    downvotes: 45,
    commentCount: 156,
    type: "link" as const,
    linkUrl: "https://css-tricks.com/quick-whats-the-difference-between-flexbox-and-grid/",
    flair: "Tutorial",
    awards: 12,
    isStickied: true,
  },
  {
    id: "3",
    title: "My workspace setup for 2024",
    content: "Finally got my dream setup! Took me years to save up for this.",
    author: "workspace_lover",
    subreddit: "r/webdev",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    upvotes: 567,
    downvotes: 23,
    commentCount: 89,
    type: "image" as const,
    imageUrl: "https://images.unsplash.com/photo-1586953983027-d7508a64f4bb?w=800&auto=format&fit=crop&q=60",
    flair: "Setup",
    awards: 5,
    isStickied: false,
  },
  {
    id: "4",
    title: "Why JavaScript is eating the world",
    content: "An in-depth analysis of how JavaScript has become the most popular programming language and why it continues to dominate. From web development to mobile apps, from server-side to desktop applications, JavaScript is everywhere.",
    author: "js_enthusiast",
    subreddit: "r/javascript",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    upvotes: 892,
    downvotes: 67,
    commentCount: 203,
    type: "text" as const,
    flair: "Discussion",
    awards: 8,
    isStickied: false,
  },
  {
    id: "5",
    title: "Building a full-stack app with Next.js 14",
    content: "",
    author: "nextjs_ninja",
    subreddit: "r/reactjs",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    upvotes: 456,
    downvotes: 18,
    commentCount: 67,
    type: "video" as const,
    flair: "Tutorial",
    awards: 2,
    isStickied: false,
  }
];

export const mockComments = [
  {
    id: "c1",
    author: "react_fan",
    content: "This looks amazing! I love the clean design. What state management library did you use?",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    upvotes: 45,
    downvotes: 2,
    awards: 1,
    depth: 0,
    replies: [
      {
        id: "c1r1",
        author: "developer_mike",
        content: "Thanks! I used Zustand for state management. It's much simpler than Redux for smaller projects.",
        createdAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
        upvotes: 23,
        downvotes: 0,
        awards: 0,
        depth: 1,
        replies: [
          {
            id: "c1r1r1",
            author: "state_master",
            content: "Zustand is definitely underrated! Great choice for this type of project.",
            createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
            upvotes: 12,
            downvotes: 1,
            awards: 0,
            depth: 2,
          }
        ]
      }
    ]
  },
  {
    id: "c2",
    author: "ui_designer",
    content: "The typography and spacing look really professional. Did you use a design system?",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    upvotes: 34,
    downvotes: 1,
    awards: 0,
    depth: 0,
    replies: []
  },
  {
    id: "c3",
    author: "code_reviewer",
    content: "Would love to see the source code if it's open source! Always interested in learning from well-built React apps.",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    upvotes: 28,
    downvotes: 0,
    awards: 0,
    depth: 0,
    replies: []
  }
];

export const mockSubreddits = [
  {
    name: "r/reactjs",
    description: "A community for learning and developing React applications. Share your projects, ask questions, and discuss best practices.",
    members: 245000,
    activeMembers: 1234,
    createdAt: "2015-06-15T00:00:00Z",
    category: "Technology",
    isNSFW: false,
    isJoined: true,
    iconUrl: "https://api.dicebear.com/7.x/initials/svg?seed=reactjs",
  },
  {
    name: "r/webdev",
    description: "A community dedicated to all things web development. From front-end to back-end, we discuss tools, frameworks, and career advice.",
    members: 890000,
    activeMembers: 3456,
    createdAt: "2012-03-20T00:00:00Z",
    category: "Technology",
    isNSFW: false,
    isJoined: true,
    iconUrl: "https://api.dicebear.com/7.x/initials/svg?seed=webdev",
  },
  {
    name: "r/javascript",
    description: "The largest community for JavaScript developers. Discuss ES6+, frameworks, libraries, and everything JavaScript.",
    members: 2100000,
    activeMembers: 8901,
    createdAt: "2008-01-01T00:00:00Z",
    category: "Programming",
    isNSFW: false,
    isJoined: false,
    iconUrl: "https://api.dicebear.com/7.x/initials/svg?seed=javascript",
  },
  {
    name: "r/css",
    description: "Cascading Style Sheets community. Share your CSS tips, tricks, and beautiful designs.",
    members: 156000,
    activeMembers: 567,
    createdAt: "2009-05-10T00:00:00Z",
    category: "Design",
    isNSFW: false,
    isJoined: false,
    iconUrl: "https://api.dicebear.com/7.x/initials/svg?seed=css",
  }
];

export const mockUser = {
  username: "developer_mike",
  displayName: "Mike Johnson",
  bio: "Full-stack developer passionate about React and modern web technologies. Building cool stuff one component at a time! 🚀",
  joinDate: "2020-03-15T00:00:00Z",
  location: "San Francisco, CA",
  website: "https://mikejohnson.dev",
  karma: 12450,
  postKarma: 8230,
  commentKarma: 4220,
  awards: 23,
  isOnline: true,
  isPremium: true,
  followers: 1234,
  following: 567,
  avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=developer_mike",
};