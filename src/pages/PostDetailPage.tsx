import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share, Award, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PostCard } from "@/components/post/PostCard";
import { CommentCard } from "@/components/comment/CommentCard";
import { usePosts } from "@/hooks/usePosts";
import { useComments } from "@/hooks/useComments";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [sortComments, setSortComments] = useState("best");
  
  const { posts, loading: postsLoading } = usePosts();
  const { comments, loading: commentsLoading, createComment } = useComments(id || "");
  
  const post = posts.find(p => p.id === id);
  
  const handleAddComment = async () => {
    if (!commentText.trim() || !user) return;
    
    try {
      await createComment(commentText);
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (postsLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-32 w-full" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold mb-2">Post not found</h1>
        <p className="text-muted-foreground mb-4">The post you're looking for doesn't exist.</p>
        <Button onClick={handleBack}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Button variant="ghost" className="mb-4" onClick={handleBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to feed
      </Button>

      {/* Post */}
      <PostCard post={{
        id: post.id,
        title: post.title,
        content: post.content,
        author: post.profiles?.username || "Unknown",
        subreddit: `r/${post.subreddits?.name || "unknown"}`,
        createdAt: post.created_at,
        upvotes: post.upvotes || 0,
        downvotes: post.downvotes || 0,
        commentCount: post.comment_count || 0,
        type: post.type as "text" | "image" | "link" | "video",
        imageUrl: post.image_url || undefined,
        linkUrl: post.link_url || undefined,
        flair: post.flair || undefined,
        awards: post.awards || 0,
        isStickied: post.is_stickied || false,
      }} />

      {/* Post Actions */}
      <div className="flex items-center justify-between py-4 border-y">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Award className="h-4 w-4 mr-2" />
            Give Award
          </Button>
          <Button variant="outline" size="sm">
            <Flag className="h-4 w-4 mr-2" />
            Report
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {post.comment_count} comments
        </div>
      </div>

      {/* Add Comment */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {user ? `Comment as u/${user.email?.split('@')[0]}` : "Sign in to comment"}
          </label>
          <Textarea
            placeholder={user ? "What are your thoughts?" : "Sign in to add a comment"}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={4}
            disabled={!user}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button 
            size="sm" 
            onClick={handleAddComment}
            disabled={!commentText.trim() || !user}
          >
            Comment
          </Button>
        </div>
      </div>

      {/* Comments Sort */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Sort by:</span>
        <select 
          value={sortComments} 
          onChange={(e) => setSortComments(e.target.value)}
          className="text-sm bg-transparent border-none focus:outline-none"
        >
          <option value="best">Best</option>
          <option value="top">Top</option>
          <option value="new">New</option>
          <option value="controversial">Controversial</option>
          <option value="old">Old</option>
        </select>
      </div>

      {/* Comments */}
      <div className="space-y-4">
        {commentsLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <CommentCard key={comment.id} comment={{
              id: comment.id,
              author: comment.profiles?.username || "Unknown",
              content: comment.content,
              createdAt: comment.created_at,
              upvotes: comment.upvotes || 0,
              downvotes: comment.downvotes || 0,
              awards: comment.awards || 0,
              depth: comment.depth || 0,
              replies: (comment.replies || []).map((reply: any) => ({
                id: reply.id,
                author: reply.profiles?.username || "Unknown",
                content: reply.content,
                createdAt: reply.created_at,
                upvotes: reply.upvotes || 0,
                downvotes: reply.downvotes || 0,
                awards: reply.awards || 0,
                depth: reply.depth || 0,
                replies: [],
              })),
            }} />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
};