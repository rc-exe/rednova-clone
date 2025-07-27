import { ArrowLeft, Share, Award, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PostCard } from "@/components/post/PostCard";
import { CommentCard } from "@/components/comment/CommentCard";
import { mockPosts, mockComments } from "@/data/mockData";
import { useState } from "react";

export const PostDetailPage = () => {
  const [commentText, setCommentText] = useState("");
  const [sortComments, setSortComments] = useState("best");
  
  // For demo purposes, using the first post
  const post = mockPosts[0];
  
  const handleAddComment = () => {
    console.log("Adding comment:", commentText);
    setCommentText("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Button variant="ghost" className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to feed
      </Button>

      {/* Post */}
      <PostCard post={post} />

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
          {post.commentCount} comments
        </div>
      </div>

      {/* Add Comment */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Comment as u/developer_mike</label>
          <Textarea
            placeholder="What are your thoughts?"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={4}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button 
            size="sm" 
            onClick={handleAddComment}
            disabled={!commentText.trim()}
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
        {mockComments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
        
        {/* Load More Comments */}
        <div className="text-center py-6">
          <Button variant="outline">
            Load more comments
          </Button>
        </div>
      </div>
    </div>
  );
};