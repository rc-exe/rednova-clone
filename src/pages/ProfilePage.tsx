import { useParams } from "react-router-dom";
import { UserProfile } from "@/components/user/UserProfile";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const ProfilePage = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [targetUserId, setTargetUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Get user ID from username
  useEffect(() => {
    const fetchUserByUsername = async () => {
      if (!username) {
        setTargetUserId(currentUser?.id || null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("user_id")
          .eq("username", username)
          .single();

        if (error) throw error;
        setTargetUserId(data.user_id);
      } catch (error) {
        console.error("Error fetching user:", error);
        setTargetUserId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserByUsername();
  }, [username, currentUser?.id]);

  const { profile, loading: profileLoading } = useProfile(targetUserId || undefined);

  if (loading || profileLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-64 w-full" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">User not found</h1>
          <p className="text-muted-foreground">The user you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Transform profile data to match UserProfile interface
  const userProfileData = {
    username: profile.username,
    displayName: profile.display_name || profile.username,
    bio: profile.bio || undefined,
    joinDate: profile.created_at,
    location: profile.location || undefined,
    website: profile.website || undefined,
    karma: profile.karma || 0,
    postKarma: profile.post_karma || 0,
    commentKarma: profile.comment_karma || 0,
    awards: 0, // We'll add this functionality later
    isOnline: profile.is_online || false,
    isPremium: profile.is_premium || false,
    followers: 0, // We'll add this functionality later
    following: 0, // We'll add this functionality later
    avatarUrl: profile.avatar_url || undefined,
    bannerUrl: undefined, // We'll add this functionality later
  };

  return (
    <div className="container mx-auto py-6">
      <UserProfile user={userProfileData} />
    </div>
  );
};