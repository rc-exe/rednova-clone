import { useState } from "react";
import { TrendingUp, Flame, Clock, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/post/PostCard";
import { usePosts } from "@/hooks/usePosts";

export const AllPage = () => {
  const [sortBy, setSortBy] = useState("hot");
  const { posts, loading } = usePosts();

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
  const sortedPosts = [...posts].sort((a, b) => {
    switch (sortBy) {
      case "new":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "top":
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      case "rising":
        // Simple rising algorithm: newer posts with good vote ratio
        const aScore = (a.upvotes - a.downvotes) / Math.max(1, Date.now() - new Date(a.created_at).getTime());
        const bScore = (b.upvotes - b.downvotes) / Math.max(1, Date.now() - new Date(b.created_at).getTime());
        return bScore - aScore;
      case "hot":
      default:
        // Hot algorithm: mix of votes and recency
        const aHot = (a.upvotes - a.downvotes + a.comment_count) / Math.pow(Date.now() - new Date(a.created_at).getTime(), 0.8);
        const bHot = (b.upvotes - b.downvotes + b.comment_count) / Math.pow(Date.now() - new Date(b.created_at).getTime(), 0.8);
        return bHot - aHot;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">All Posts</h1>
                  <p className="text-muted-foreground">Browse posts from all communities</p>
                </div>
                
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
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-card rounded-lg p-6 animate-pulse">
                      <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                  
                  {sortedPosts.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No posts found</p>
                    </div>
                  )}
                </div>
              )}
      </div>
    </div>
  );
};