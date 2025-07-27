import { useState } from "react";
import { Users, TrendingUp, Calendar, Settings, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/post/PostCard";
import { CreatePost } from "@/components/post/CreatePost";
import { mockPosts, mockSubreddits } from "@/data/mockData";

export const SubredditPage = () => {
  const [isJoined, setIsJoined] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  
  // For demo purposes, using the first subreddit
  const subreddit = mockSubreddits[0];
  
  // Filter posts for this subreddit
  const subredditPosts = mockPosts.filter(post => post.subreddit === subreddit.name);
  
  const formatMemberCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Subreddit Header */}
      <div className="bg-card border-b mb-6">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={subreddit.iconUrl} />
              <AvatarFallback className="text-2xl">{subreddit.name.slice(2, 4).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold">{subreddit.name}</h1>
                {subreddit.isNSFW && (
                  <Badge variant="destructive">NSFW</Badge>
                )}
              </div>
              
              <p className="text-muted-foreground text-lg">{subreddit.description}</p>
              
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{formatMemberCount(subreddit.members)} members</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-online" />
                  <span>{formatMemberCount(subreddit.activeMembers)} online</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Created {new Date(subreddit.createdAt).getFullYear()}</span>
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
                <PostCard key={post.id} post={post} />
              ))}
            </TabsContent>
            
            <TabsContent value="new" className="space-y-4 mt-6">
              {[...subredditPosts].sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              ).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </TabsContent>
            
            <TabsContent value="top" className="space-y-4 mt-6">
              {[...subredditPosts].sort((a, b) => 
                (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)
              ).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </TabsContent>
            
            <TabsContent value="rising" className="space-y-4 mt-6">
              {subredditPosts.map((post) => (
                <PostCard key={post.id} post={post} />
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
                  <span className="text-sm font-medium">{formatMemberCount(subreddit.activeMembers)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm font-medium">
                    {new Date(subreddit.createdAt).toLocaleDateString()}
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