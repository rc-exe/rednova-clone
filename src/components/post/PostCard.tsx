import { ArrowUp, ArrowDown, MessageCircle, Share, Award, BookmarkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content?: string;
    author: string;
    subreddit: string;
    createdAt: string;
    upvotes: number;
    downvotes: number;
    commentCount: number;
    type: "text" | "link" | "image" | "video";
    imageUrl?: string;
    linkUrl?: string;
    flair?: string;
    awards: number;
    isStickied?: boolean;
  };
}

export const PostCard = ({ post }: PostCardProps) => {
  const [voteState, setVoteState] = useState<"up" | "down" | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleVote = (type: "up" | "down") => {
    if (voteState === type) {
      setVoteState(null);
    } else {
      setVoteState(type);
    }
  };

  const getPostTypeColor = () => {
    switch (post.type) {
      case "text": return "text-post-text";
      case "link": return "text-post-link";
      case "image": return "text-post-image";
      case "video": return "text-post-video";
      default: return "text-foreground";
    }
  };

  const timeAgo = new Date(post.createdAt).toLocaleTimeString();

  return (
    <Card className={`mb-4 ${post.isStickied ? "border-reddit-orange" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Avatar className="w-6 h-6">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.subreddit}`} />
            <AvatarFallback>{post.subreddit[2]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-foreground">{post.subreddit}</span>
          <span>•</span>
          <span>Posted by u/{post.author}</span>
          <span>•</span>
          <span>{timeAgo}</span>
          {post.isStickied && (
            <Badge variant="outline" className="border-reddit-orange text-reddit-orange">
              Pinned
            </Badge>
          )}
        </div>
        {post.flair && (
          <Badge variant="secondary" className="w-fit mt-2">
            {post.flair}
          </Badge>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="flex space-x-3">
          {/* Voting */}
          <div className="flex flex-col items-center space-y-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              className={`p-1 h-auto ${voteState === "up" ? "text-upvote hover:text-upvote-hover" : "text-muted-foreground"}`}
              onClick={() => handleVote("up")}
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
            <span className={`text-sm font-medium ${
              voteState === "up" ? "text-upvote" : 
              voteState === "down" ? "text-downvote" : "text-foreground"
            }`}>
              {post.upvotes - post.downvotes + (voteState === "up" ? 1 : voteState === "down" ? -1 : 0)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className={`p-1 h-auto ${voteState === "down" ? "text-downvote hover:text-downvote-hover" : "text-muted-foreground"}`}
              onClick={() => handleVote("down")}
            >
              <ArrowDown className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h2 className={`text-lg font-semibold mb-2 ${getPostTypeColor()}`}>
              {post.title}
            </h2>
            
            {post.content && (
              <p className="text-foreground mb-3 text-sm leading-relaxed">
                {post.content}
              </p>
            )}

            {post.imageUrl && (
              <div className="mb-3">
                <img 
                  src={post.imageUrl} 
                  alt="Post content" 
                  className="rounded-md max-w-full h-auto"
                />
              </div>
            )}

            {post.linkUrl && (
              <div className="mb-3 p-3 border rounded-md bg-muted/50">
                <a 
                  href={post.linkUrl} 
                  className="text-post-link hover:underline text-sm"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {post.linkUrl}
                </a>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-4 text-muted-foreground">
              <Button variant="ghost" size="sm" className="h-auto p-1">
                <MessageCircle className="h-4 w-4 mr-1" />
                <span className="text-sm">{post.commentCount} Comments</span>
              </Button>
              
              <Button variant="ghost" size="sm" className="h-auto p-1">
                <Share className="h-4 w-4 mr-1" />
                <span className="text-sm">Share</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto p-1"
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <BookmarkIcon className={`h-4 w-4 mr-1 ${isBookmarked ? "fill-current" : ""}`} />
                <span className="text-sm">Save</span>
              </Button>

              {post.awards > 0 && (
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-1 text-gold" />
                  <span className="text-sm">{post.awards}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};