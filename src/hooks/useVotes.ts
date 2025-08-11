import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export const useVotes = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const voteOnPost = async (postId: string, voteType: 1 | -1) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if user has already voted on this post
      const { data: existingVote } = await supabase
        .from("votes")
        .select("*")
        .eq("user_id", user.id)
        .eq("post_id", postId)
        .single();

      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          // Remove vote if clicking same vote
          await supabase
            .from("votes")
            .delete()
            .eq("user_id", user.id)
            .eq("post_id", postId);
        } else {
          // Update vote if different
          await supabase
            .from("votes")
            .update({ vote_type: voteType })
            .eq("user_id", user.id)
            .eq("post_id", postId);
        }
      } else {
        // Create new vote
        await supabase
          .from("votes")
          .insert({
            user_id: user.id,
            post_id: postId,
            vote_type: voteType,
          });
      }

      // Update post vote counts
      const { data: votes } = await supabase
        .from("votes")
        .select("vote_type")
        .eq("post_id", postId);

      const upvotes = votes?.filter(v => v.vote_type === 1).length || 0;
      const downvotes = votes?.filter(v => v.vote_type === -1).length || 0;

      await supabase
        .from("posts")
        .update({ upvotes, downvotes })
        .eq("id", postId);

    } catch (error) {
      console.error("Error voting on post:", error);
      toast({
        title: "Error",
        description: "Failed to register vote",
        variant: "destructive",
      });
    }
  };

  const voteOnComment = async (commentId: string, voteType: 1 | -1 | 0) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if user has already voted on this comment
      const { data: existingVote } = await supabase
        .from("votes")
        .select("*")
        .eq("user_id", user.id)
        .eq("comment_id", commentId)
        .single();

      if (existingVote) {
        if (voteType === 0) {
          // Remove vote
          await supabase
            .from("votes")
            .delete()
            .eq("user_id", user.id)
            .eq("comment_id", commentId);
        } else {
          // Update vote if different
          await supabase
            .from("votes")
            .update({ vote_type: voteType })
            .eq("user_id", user.id)
            .eq("comment_id", commentId);
        }
      } else if (voteType !== 0) {
        // Create new vote
        await supabase
          .from("votes")
          .insert({
            user_id: user.id,
            comment_id: commentId,
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

    } catch (error) {
      console.error("Error voting on comment:", error);
      toast({
        title: "Error",
        description: "Failed to register vote",
        variant: "destructive",
      });
    }
  };

  const getUserVote = async (postId?: string, commentId?: string): Promise<1 | -1 | null> => {
    if (!user || (!postId && !commentId)) return null;

    try {
      let query = supabase
        .from("votes")
        .select("vote_type")
        .eq("user_id", user.id);

      if (postId) {
        query = query.eq("post_id", postId);
      } else if (commentId) {
        query = query.eq("comment_id", commentId);
      }

      const { data } = await query.single();
      return (data?.vote_type as 1 | -1) || null;
    } catch (error) {
      return null;
    }
  };

  return {
    voteOnPost,
    voteOnComment,
    getUserVote,
  };
};