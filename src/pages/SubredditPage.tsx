import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Users, TrendingUp, Calendar, Settings, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/post/PostCard";
import { CreatePost } from "@/components/post/CreatePost";
import { useSubreddits } from "@/hooks/useSubreddits";
import { usePosts } from "@/hooks/usePosts";
import { Skeleton } from "@/components/ui/skeleton";

export const SubredditPage = () => {
  const { subreddit: subredditName } = useParams();
  const [isJoined, setIsJoined] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  
  const { subreddits, loading: subredditsLoading } = useSubreddits();
  const { posts, loading: postsLoading } = usePosts();
  
  const subreddit = subreddits.find(s => s.name === subredditName);
  const subredditPosts = posts.filter(post => post.subreddits?.name === subredditName);
  
  const formatMemberCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  if (subredditsLoading || postsLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <Skeleton className="h-48 w-full mb-6" />
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
          <div className="lg:w-80 space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!subreddit) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold mb-2">Subreddit not found</h1>
        <p className="text-muted-foreground">The community you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Subreddit Header */}
      <div className="bg-card border-b mb-6">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={subreddit.icon_url || `https://api.dicebear.com/7.x/initials/svg?seed=${subreddit.name}`} />
              <AvatarFallback className="text-2xl">{subreddit.display_name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold">r/{subreddit.name}</h1>
                {subreddit.is_nsfw && (
                  <Badge variant="destructive">NSFW</Badge>
                )}
              </div>
              
              <p className="text-muted-foreground text-lg">{subreddit.description || "No description available"}</p>
              
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{formatMemberCount(subreddit.members || 0)} members</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-online" />
                  <span>{formatMemberCount(subreddit.active_members || 0)} online</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Created {new Date(subreddit.created_at).getFullYear()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={() => setIsJoined(!isJoined)}
                variant={isJoined ? "outline" : "default"}
                className={!isJoined ? "bg-reddit-orange hover:bg-reddit-orange/90" : ""}
              >
                {isJoined ? "Joined" : "Join"}
              </Button>
              
              {isJoined && (
                <>
                  <Button variant="outline" size="icon">
                    <Bell className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Create Post */}
          {isJoined && (
            <div className="lg:hidden">
              <Button 
                onClick={() => setShowCreatePost(!showCreatePost)}
                className="w-full bg-reddit-orange hover:bg-reddit-orange/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </div>
          )}
          
          {showCreatePost && <CreatePost />}

          {/* Posts */}
          <Tabs defaultValue="hot">
            <TabsList>
              <TabsTrigger value="hot">Hot</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
              <TabsTrigger value="top">Top</TabsTrigger>
              <TabsTrigger value="rising">Rising</TabsTrigger>
            </TabsList>
            
            <TabsContent value="hot" className="space-y-4 mt-6">
              {subredditPosts.map((post) => (
                <PostCard key={post.id} post={{
                  id: post.id,
                  title: post.title,
                  content: post.content,
                  author_id: post.author_id,
                  subreddit_id: post.subreddit_id,
                  created_at: post.created_at,
                  upvotes: post.upvotes || 0,
                  downvotes: post.downvotes || 0,
                  comment_count: post.comment_count || 0,
                  type: post.type as "text" | "image" | "link" | "video",
                  image_url: post.image_url,
                  link_url: post.link_url,
                  flair: post.flair,
                  awards: post.awards || 0,
                  is_stickied: post.is_stickied || false,
                }} />
              ))}
            </TabsContent>
            
            <TabsContent value="new" className="space-y-4 mt-6">
              {[...subredditPosts].sort((a, b) => 
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
              ).map((post) => (
                <PostCard key={post.id} post={{
                  id: post.id,
                  title: post.title,
                  content: post.content,
                  author_id: post.author_id,
                  subreddit_id: post.subreddit_id,
                  created_at: post.created_at,
                  upvotes: post.upvotes || 0,
                  downvotes: post.downvotes || 0,
                  comment_count: post.comment_count || 0,
                  type: post.type as "text" | "image" | "link" | "video",
                  image_url: post.image_url,
                  link_url: post.link_url,
                  flair: post.flair,
                  awards: post.awards || 0,
                  is_stickied: post.is_stickied || false,
                }} />
              ))}
            </TabsContent>
            
            <TabsContent value="top" className="space-y-4 mt-6">
              {[...subredditPosts].sort((a, b) => 
                ((b.upvotes || 0) - (b.downvotes || 0)) - ((a.upvotes || 0) - (a.downvotes || 0))
              ).map((post) => (
                <PostCard key={post.id} post={{
                  id: post.id,
                  title: post.title,
                  content: post.content,
                  author_id: post.author_id,
                  subreddit_id: post.subreddit_id,
                  created_at: post.created_at,
                  upvotes: post.upvotes || 0,
                  downvotes: post.downvotes || 0,
                  comment_count: post.comment_count || 0,
                  type: post.type as "text" | "image" | "link" | "video",
                  image_url: post.image_url,
                  link_url: post.link_url,
                  flair: post.flair,
                  awards: post.awards || 0,
                  is_stickied: post.is_stickied || false,
                }} />
              ))}
            </TabsContent>
            
            <TabsContent value="rising" className="space-y-4 mt-6">
              {subredditPosts.map((post) => (
                <PostCard key={post.id} post={{
                  id: post.id,
                  title: post.title,
                  content: post.content,
                  author_id: post.author_id,
                  subreddit_id: post.subreddit_id,
                  created_at: post.created_at,
                  upvotes: post.upvotes || 0,
                  downvotes: post.downvotes || 0,
                  comment_count: post.comment_count || 0,
                  type: post.type as "text" | "image" | "link" | "video",
                  image_url: post.image_url,
                  link_url: post.link_url,
                  flair: post.flair,
                  awards: post.awards || 0,
                  is_stickied: post.is_stickied || false,
                }} />
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="lg:w-80 space-y-4">
          {/* About Community */}
          <Card>
            <CardHeader>
              <CardTitle>About Community</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {subreddit.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Members</span>
                  <span className="text-sm font-medium">{formatMemberCount(subreddit.members)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Online</span>
                  <span className="text-sm font-medium">{formatMemberCount(subreddit.active_members || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm font-medium">
                    {new Date(subreddit.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              {isJoined && (
                <Button 
                  className="w-full bg-reddit-orange hover:bg-reddit-orange/90"
                  onClick={() => setShowCreatePost(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Rules */}
          <Card>
            <CardHeader>
              <CardTitle>Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="font-medium">1. Be respectful</div>
                  <div className="text-muted-foreground">Treat others with respect and kindness.</div>
                </div>
                <div>
                  <div className="font-medium">2. Stay on topic</div>
                  <div className="text-muted-foreground">Keep posts relevant to the community.</div>
                </div>
                <div>
                  <div className="font-medium">3. No spam</div>
                  <div className="text-muted-foreground">Don't post promotional content excessively.</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Moderators */}
          <Card>
            <CardHeader>
              <CardTitle>Moderators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback>M</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">u/moderator1</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">u/admin_user</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};