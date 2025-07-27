import { useState } from "react";
import { TrendingUp, Flame, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/post/PostCard";
import { CreatePost } from "@/components/post/CreatePost";
import { mockPosts } from "@/data/mockData";

export const HomePage = () => {
  const [sortBy, setSortBy] = useState("hot");
  const [showCreatePost, setShowCreatePost] = useState(false);

  const getSortIcon = (type: string) => {
    switch (type) {
      case "hot": return <Flame className="h-4 w-4" />;
      case "new": return <Clock className="h-4 w-4" />;
      case "top": return <TrendingUp className="h-4 w-4" />;
      case "rising": return <Star className="h-4 w-4" />;
      default: return null;
    }
  };

  // Sort posts based on selected criteria
  const sortedPosts = [...mockPosts].sort((a, b) => {
    switch (sortBy) {
      case "new":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "top":
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      case "rising":
        // Simple rising algorithm: newer posts with good vote ratio
        const aScore = (a.upvotes - a.downvotes) / Math.max(1, Date.now() - new Date(a.createdAt).getTime());
        const bScore = (b.upvotes - b.downvotes) / Math.max(1, Date.now() - new Date(b.createdAt).getTime());
        return bScore - aScore;
      case "hot":
      default:
        // Hot algorithm: mix of votes and recency
        const aHot = (a.upvotes - a.downvotes + a.commentCount) / Math.pow(Date.now() - new Date(a.createdAt).getTime(), 0.8);
        const bHot = (b.upvotes - b.downvotes + b.commentCount) / Math.pow(Date.now() - new Date(b.createdAt).getTime(), 0.8);
        return bHot - aHot;
    }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Create Post Button - Mobile */}
      <div className="md:hidden">
        <Button 
          onClick={() => setShowCreatePost(!showCreatePost)}
          className="w-full bg-reddit-orange hover:bg-reddit-orange/90"
        >
          Create Post
        </Button>
      </div>

      {/* Create Post Form */}
      {showCreatePost && <CreatePost />}

      {/* Sort Options */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Home Feed</h1>
        
        <Tabs value={sortBy} onValueChange={setSortBy}>
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="hot" className="flex items-center space-x-1">
              {getSortIcon("hot")}
              <span className="hidden sm:inline">Hot</span>
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center space-x-1">
              {getSortIcon("new")}
              <span className="hidden sm:inline">New</span>
            </TabsTrigger>
            <TabsTrigger value="top" className="flex items-center space-x-1">
              {getSortIcon("top")}
              <span className="hidden sm:inline">Top</span>
            </TabsTrigger>
            <TabsTrigger value="rising" className="flex items-center space-x-1">
              {getSortIcon("rising")}
              <span className="hidden sm:inline">Rising</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {sortedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        
        {/* Load More */}
        <div className="text-center py-8">
          <Button variant="outline" size="lg">
            Load More Posts
          </Button>
        </div>
      </div>
    </div>
  );
};