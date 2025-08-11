import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, MessageCircle, Award, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useVotes } from "@/hooks/useVotes";
import { useAuth } from "@/hooks/useAuth";

interface CommentData {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  awards: number;
  depth: number;
  replies?: CommentData[];
}

interface CommentCardProps {
  comment: CommentData;
  maxDepth?: number;
  onReply?: (content: string, parentId: string) => Promise<void>;
}

export const CommentCard = ({ comment, maxDepth = 5, onReply }: CommentCardProps) => {
  const [userVote, setUserVote] = useState<1 | -1 | null>(null);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { voteOnComment, getUserVote } = useVotes();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      getUserVote(undefined, comment.id).then(setUserVote);
    }
  }, [user, comment.id, getUserVote]);

  const handleVote = async (voteType: 1 | -1) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const newVoteType = userVote === voteType ? null : voteType;
      await voteOnComment(comment.id, newVoteType === null ? 0 : newVoteType);
      setUserVote(newVoteType);
    } catch (error) {
      console.error("Error voting on comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = async () => {
    if (!onReply || !replyText.trim()) return;
    
    setIsLoading(true);
    try {
      await onReply(replyText, comment.id);
      setReplyText("");
      setIsReplying(false);
    } catch (error) {
      console.error("Error replying to comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const score = comment.upvotes - comment.downvotes;

  const timeAgo = new Date(comment.createdAt).toLocaleTimeString();

  return (
    <div className={`${comment.depth > 0 ? "ml-4" : ""}`}>
      <div className="flex space-x-2 py-2">
        {/* Collapse Line for nested comments */}
        {comment.depth > 0 && (
          <div 
            className="w-0.5 bg-border hover:bg-reddit-orange cursor-pointer transition-colors"
            onClick={() => setIsCollapsed(!isCollapsed)}
          />
        )}
        
        {/* Avatar */}
        <Avatar className="w-6 h-6 mt-1">
          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.author}`} />
          <AvatarFallback>{comment.author[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          {/* Author and timestamp */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
            <span className="font-medium text-foreground">u/{comment.author}</span>
            <span>•</span>
            <span>{timeAgo}</span>
            {comment.awards > 0 && (
              <div className="flex items-center">
                <Award className="h-3 w-3 mr-1 text-gold" />
                <span className="text-xs">{comment.awards}</span>
              </div>
            )}
          </div>

          {/* Comment text */}
          {!isCollapsed && (
            <>
              <p className="text-sm text-foreground mb-2 leading-relaxed">
                {comment.content}
              </p>

              {/* Actions */}
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                {/* Voting */}
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-auto p-1 ${userVote === 1 ? "text-upvote" : ""}`}
                    onClick={() => handleVote(1)}
                    disabled={isLoading || !user}
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <span className={`text-xs font-medium ${
                    userVote === 1 ? "text-upvote" : 
                    userVote === -1 ? "text-downvote" : ""
                  }`}>
                    {score}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-auto p-1 ${userVote === -1 ? "text-downvote" : ""}`}
                    onClick={() => handleVote(-1)}
                    disabled={isLoading || !user}
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>

                {/* Reply */}
                {user && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1 text-xs"
                    onClick={() => setIsReplying(!isReplying)}
                    disabled={isLoading}
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                )}

                {/* More options */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-auto p-1">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Save</DropdownMenuItem>
                    <DropdownMenuItem>Share</DropdownMenuItem>
                    <DropdownMenuItem>Report</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Reply form */}
              {isReplying && (
                <div className="mt-3 space-y-2">
                  <Textarea
                    placeholder="What are your thoughts?"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={3}
                    className="text-sm"
                  />
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={handleReply} 
                      disabled={!replyText.trim() || isLoading}
                    >
                      {isLoading ? "Posting..." : "Reply"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setIsReplying(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Nested replies */}
              {comment.replies && comment.depth < maxDepth && (
                <div className="mt-3">
                  {comment.replies.map((reply) => (
                    <CommentCard
                      key={reply.id}
                      comment={reply}
                      maxDepth={maxDepth}
                      onReply={onReply}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Collapsed indicator */}
          {isCollapsed && comment.replies && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground h-auto p-0"
              onClick={() => setIsCollapsed(false)}
            >
              [+] {comment.replies.length} more repl{comment.replies.length === 1 ? 'y' : 'ies'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};