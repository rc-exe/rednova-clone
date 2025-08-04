import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Subreddit = Database["public"]["Tables"]["subreddits"]["Row"];

export const useSubreddits = () => {
  const [subreddits, setSubreddits] = useState<Subreddit[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSubreddits = async () => {
    try {
      const { data, error } = await supabase
        .from("subreddits")
        .select("*")
        .order("members", { ascending: false });

      if (error) throw error;
      setSubreddits(data);
    } catch (error: any) {
      toast({
        title: "Error loading subreddits",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSubreddit = async (subredditData: {
    name: string;
    display_name: string;
    description?: string;
    category?: string;
    is_nsfw?: boolean;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("subreddits")
        .insert({
          ...subredditData,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setSubreddits(prev => [data, ...prev]);
      toast({
        title: "Subreddit created successfully!",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating subreddit",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const joinSubreddit = async (subredditId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("subreddit_memberships")
        .insert({
          user_id: user.id,
          subreddit_id: subredditId,
        });

      if (error) throw error;

      // Update member count
      const { error: updateError } = await supabase
        .rpc('increment_subreddit_members', { subreddit_id: subredditId });

      if (updateError) throw updateError;

      toast({
        title: "Joined subreddit successfully!",
      });

      fetchSubreddits();
    } catch (error: any) {
      toast({
        title: "Error joining subreddit",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const leaveSubreddit = async (subredditId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("subreddit_memberships")
        .delete()
        .eq("user_id", user.id)
        .eq("subreddit_id", subredditId);

      if (error) throw error;

      // Update member count
      const { error: updateError } = await supabase
        .rpc('decrement_subreddit_members', { subreddit_id: subredditId });

      if (updateError) throw updateError;

      toast({
        title: "Left subreddit successfully!",
      });

      fetchSubreddits();
    } catch (error: any) {
      toast({
        title: "Error leaving subreddit",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSubreddits();
  }, []);

  return {
    subreddits,
    loading,
    createSubreddit,
    joinSubreddit,
    leaveSubreddit,
    refetch: fetchSubreddits,
  };
};