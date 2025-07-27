import { Users, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface SubredditCardProps {
  subreddit: {
    name: string;
    description: string;
    members: number;
    activeMembers: number;
    createdAt: string;
    category: string;
    isNSFW?: boolean;
    isJoined?: boolean;
    bannerUrl?: string;
    iconUrl?: string;
  };
}

export const SubredditCard = ({ subreddit }: SubredditCardProps) => {
  const formatMemberCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const createdYear = new Date(subreddit.createdAt).getFullYear();

  return (
    <Card className="hover:shadow-md transition-shadow">
      {/* Banner */}
      {subreddit.bannerUrl && (
        <div 
          className="h-20 bg-cover bg-center rounded-t-lg"
          style={{ backgroundImage: `url(${subreddit.bannerUrl})` }}
        />
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={subreddit.iconUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${subreddit.name}`} />
            <AvatarFallback>{subreddit.name.slice(2, 4).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-lg">{subreddit.name}</h3>
              {subreddit.isNSFW && (
                <Badge variant="destructive" className="text-xs">
                  NSFW
                </Badge>
              )}
            </div>
            
            <Badge variant="outline" className="mt-1 text-xs">
              {subreddit.category}
            </Badge>
          </div>

          <Button
            variant={subreddit.isJoined ? "outline" : "default"}
            size="sm"
            className={subreddit.isJoined ? "" : "bg-reddit-orange hover:bg-reddit-orange/90"}
          >
            {subreddit.isJoined ? "Joined" : "Join"}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {subreddit.description}
        </p>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center space-x-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {formatMemberCount(subreddit.members)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Members</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center space-x-1">
              <TrendingUp className="h-4 w-4 text-online" />
              <span className="text-sm font-medium">
                {formatMemberCount(subreddit.activeMembers)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center space-x-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{createdYear}</span>
            </div>
            <p className="text-xs text-muted-foreground">Created</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};