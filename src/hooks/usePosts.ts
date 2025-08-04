import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Post = Database["public"]["Tables"]["posts"]["Row"] & {
  profiles: Database["public"]["Tables"]["profiles"]["Row"];
  subreddits: Database["public"]["Tables"]["subreddits"]["Row"];
};

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles:author_id(username, display_name, avatar_url),
          subreddits:subreddit_id(name, display_name, icon_url)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data as Post[]);
    } catch (error: any) {
      toast({
        title: "Error loading posts",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: {
    title: string;
    content?: string;
    type: "text" | "image" | "link" | "video";
    subreddit_id: string;
    link_url?: string;
    image_url?: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("posts")
        .insert({
          ...postData,
          author_id: user.id,
        })
        .select(`
          *,
          profiles:author_id(username, display_name, avatar_url),
          subreddits:subreddit_id(name, display_name, icon_url)
        `)
        .single();

      if (error) throw error;

      setPosts(prev => [data as Post, ...prev]);
      toast({
        title: "Post created successfully!",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating post",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const votePost = async (postId: string, voteType: 1 | -1 | 0) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Check if user already voted
      const { data: existingVote } = await supabase
        .from("votes")
        .select("*")
        .eq("post_id", postId)
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
            post_id: postId,
            user_id: user.id,
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

      // Update local state
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, upvotes, downvotes }
          : post
      ));

    } catch (error: any) {
      toast({
        title: "Error voting",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    createPost,
    votePost,
    refetch: fetchPosts,
  };
};