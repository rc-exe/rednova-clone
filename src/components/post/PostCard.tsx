import { ArrowUp, ArrowDown, MessageCircle, Share, Award, BookmarkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useVotes } from "@/hooks/useVotes";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content?: string | null;
    author_id: string;
    subreddit_id: string;
    created_at: string;
    upvotes: number;
    downvotes: number;
    comment_count: number;
    type: "text" | "link" | "image" | "video";
    image_url?: string | null;
    link_url?: string | null;
    flair?: string | null;
    awards: number;
    is_stickied?: boolean | null;
  };
}

export const PostCard = ({ post }: PostCardProps) => {
  const [voteState, setVoteState] = useState<1 | -1 | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { voteOnPost, getUserVote } = useVotes();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      getUserVote(post.id).then((vote) => {
        setVoteState(vote as 1 | -1 | null);
      });
    }
  }, [user, post.id, getUserVote]);

  const handleVote = async (type: 1 | -1) => {
    await voteOnPost(post.id, type);
    setVoteState(voteState === type ? null : type);
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

  const timeAgo = new Date(post.created_at).toLocaleTimeString();

  return (
    <Card className={`mb-4 ${post.is_stickied ? "border-reddit-orange" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Posted {timeAgo}</span>
          {post.is_stickied && (
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
              className={`p-1 h-auto ${voteState === 1 ? "text-reddit-orange hover:text-reddit-orange" : "text-muted-foreground"}`}
              onClick={() => handleVote(1)}
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
            <span className={`text-sm font-medium ${
              voteState === 1 ? "text-reddit-orange" : 
              voteState === -1 ? "text-blue-500" : "text-foreground"
            }`}>
              {(post.upvotes || 0) - (post.downvotes || 0)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className={`p-1 h-auto ${voteState === -1 ? "text-blue-500 hover:text-blue-600" : "text-muted-foreground"}`}
              onClick={() => handleVote(-1)}
            >
              <ArrowDown className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h2 
              className={`text-lg font-semibold mb-2 cursor-pointer hover:text-reddit-orange ${getPostTypeColor()}`}
              onClick={() => navigate(`/post/${post.id}`)}
            >
              {post.title}
            </h2>
            
            {post.content && (
              <p className="text-foreground mb-3 text-sm leading-relaxed">
                {post.content}
              </p>
            )}

            {post.image_url && (
              <div className="mb-3">
                <img 
                  src={post.image_url} 
                  alt="Post content" 
                  className="rounded-md max-w-full h-auto"
                />
              </div>
            )}

            {post.link_url && (
              <div className="mb-3 p-3 border rounded-md bg-muted/50">
                <a 
                  href={post.link_url} 
                  className="text-post-link hover:underline text-sm"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {post.link_url}
                </a>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-4 text-muted-foreground">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto p-1"
                onClick={() => navigate(`/post/${post.id}`)}
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                <span className="text-sm">{post.comment_count} Comments</span>
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
                  <Award className="h-4 w-4 mr-1 text-yellow-500" />
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