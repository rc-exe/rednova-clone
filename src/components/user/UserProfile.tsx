import { Calendar, MapPin, Link as LinkIcon, Award, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UserProfileProps {
  user: {
    username: string;
    displayName?: string;
    bio?: string;
    joinDate: string;
    location?: string;
    website?: string;
    karma: number;
    postKarma: number;
    commentKarma: number;
    awards: number;
    isOnline: boolean;
    isPremium: boolean;
    followers: number;
    following: number;
    avatarUrl?: string;
    bannerUrl?: string;
  };
}

export const UserProfile = ({ user }: UserProfileProps) => {
  const joinYear = new Date(user.joinDate).getFullYear();
  const joinMonth = new Date(user.joinDate).toLocaleDateString('en-US', { month: 'long' });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        {/* Banner */}
        {user.bannerUrl && (
          <div 
            className="h-32 bg-cover bg-center rounded-t-lg"
            style={{ backgroundImage: `url(${user.bannerUrl})` }}
          />
        )}
        
        <CardHeader className="pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} />
                <AvatarFallback className="text-2xl">{user.username[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              {user.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-online rounded-full border-2 border-card"></div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold">u/{user.username}</h1>
                {user.isPremium && (
                  <Badge className="bg-gold text-white">Premium</Badge>
                )}
              </div>
              
              {user.displayName && (
                <p className="text-lg text-muted-foreground">{user.displayName}</p>
              )}
              
              {user.bio && (
                <p className="text-foreground">{user.bio}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {joinMonth} {joinYear}</span>
                </div>
                
                {user.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                
                {user.website && (
                  <div className="flex items-center space-x-1">
                    <LinkIcon className="h-4 w-4" />
                    <a 
                      href={user.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-reddit-blue hover:underline"
                    >
                      {user.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline">Follow</Button>
              <Button variant="outline">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-reddit-orange">{user.karma.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Total Karma</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold">{user.postKarma.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Post Karma</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold">{user.commentKarma.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Comment Karma</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex items-center justify-center space-x-1">
              <Award className="h-5 w-5 text-gold" />
              <div className="text-2xl font-bold">{user.awards}</div>
            </div>
            <p className="text-sm text-muted-foreground">Awards</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="awards">Awards</TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts" className="p-6">
              <div className="text-center py-8 text-muted-foreground">
                <p>No posts yet. Be the first to share something!</p>
              </div>
            </TabsContent>
            
            <TabsContent value="comments" className="p-6">
              <div className="text-center py-8 text-muted-foreground">
                <p>No comments yet.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="saved" className="p-6">
              <div className="text-center py-8 text-muted-foreground">
                <p>No saved posts yet.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="awards" className="p-6">
              <div className="text-center py-8 text-muted-foreground">
                <p>No awards received yet.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};