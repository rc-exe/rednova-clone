import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Comment = Database["public"]["Tables"]["comments"]["Row"] & {
  profiles: Database["public"]["Tables"]["profiles"]["Row"];
  replies?: Comment[];
};

export const useComments = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          profiles:author_id(username, display_name, avatar_url)
        `)
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Build nested comment structure
      const commentMap = new Map();
      const rootComments: Comment[] = [];

      // First pass: create all comment objects
      data.forEach(comment => {
        commentMap.set(comment.id, { ...comment, replies: [] });
      });

      // Second pass: build the tree structure
      data.forEach(comment => {
        const commentObj = commentMap.get(comment.id);
        if (comment.parent_id) {
          const parent = commentMap.get(comment.parent_id);
          if (parent) {
            parent.replies.push(commentObj);
          }
        } else {
          rootComments.push(commentObj);
        }
      });

      setComments(rootComments);
    } catch (error: any) {
      toast({
        title: "Error loading comments",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createComment = async (content: string, parentId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const depth = parentId ? 
        (comments.find(c => c.id === parentId)?.depth || 0) + 1 : 0;

      const { data, error } = await supabase
        .from("comments")
        .insert({
          content,
          post_id: postId,
          parent_id: parentId,
          author_id: user.id,
          depth,
        })
        .select(`
          *,
          profiles:author_id(username, display_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      // Update comment count on post
      await supabase.rpc('increment_comment_count', { post_id: postId });

      toast({
        title: "Comment added successfully!",
      });

      // Refresh comments to get updated structure
      fetchComments();
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating comment",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const voteComment = async (commentId: string, voteType: 1 | -1 | 0) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Check if user already voted
      const { data: existingVote } = await supabase
        .from("votes")
        .select("*")
        .eq("comment_id", commentId)
        .eq("user_id", user.id)
        .single();

      if (existingVote) {
        if (voteType === 0) {
          // Remove vote
          await supabase
            .from("votes")
            .delete()
            .eq("id", existingVote.id);
        } else {
          // Update vote
          await supabase
            .from("votes")
            .update({ vote_type: voteType })
            .eq("id", existingVote.id);
        }
      } else if (voteType !== 0) {
        // Create new vote
        await supabase
          .from("votes")
          .insert({
            comment_id: commentId,
            user_id: user.id,
            vote_type: voteType,
          });
      }

      // Update comment vote counts
      const { data: votes } = await supabase
        .from("votes")
        .select("vote_type")
        .eq("comment_id", commentId);

      const upvotes = votes?.filter(v => v.vote_type === 1).length || 0;
      const downvotes = votes?.filter(v => v.vote_type === -1).length || 0;

      await supabase
        .from("comments")
        .update({ upvotes, downvotes })
        .eq("id", commentId);

      // Refresh comments to show updated votes
      fetchComments();

    } catch (error: any) {
      toast({
        title: "Error voting",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return {
    comments,
    loading,
    createComment,
    voteComment,
    refetch: fetchComments,
  };
};