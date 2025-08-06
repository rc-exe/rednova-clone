import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Notification {
  id: string;
  user_id: string;
  type: 'post_reply' | 'comment_reply' | 'mention' | 'follow' | 'award';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  related_post_id?: string;
  related_comment_id?: string;
  actor_user_id?: string;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      // For now, use mock data since notifications table needs to be properly configured
      const mockNotifications: Notification[] = [
        {
          id: "1",
          user_id: user.id,
          type: 'comment_reply',
          title: 'New reply to your comment',
          message: 'Someone replied to your comment on "React Best Practices"',
          is_read: false,
          created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          related_post_id: '1'
        },
        {
          id: "2",
          user_id: user.id,
          type: 'follow',
          title: 'New follower',
          message: 'JohnDev started following you',
          is_read: true,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        }
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // For now, just update locally
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      // For now, just update locally
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Set up real-time subscription (disabled for now)
    const channel = null;

    return () => {
      // Cleanup if needed
    };
  }, [user?.id]);

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications
  };
};