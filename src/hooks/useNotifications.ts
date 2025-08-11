import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface Notification {
  id: string;
  user_id: string;
  type: "comment_reply" | "mention" | "post_reply" | "system";
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  data?: any;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  // Mock notifications for demo since we don't have the table yet
  const mockNotifications: Notification[] = [
    {
      id: "1",
      user_id: user?.id || "",
      type: "comment_reply",
      title: "New reply to your comment",
      message: "Someone replied to your comment in 'What's your favorite programming language?'",
      read: false,
      created_at: new Date(Date.now() - 3600000).toISOString(),
      data: { post_id: "123", comment_id: "456" }
    },
    {
      id: "2", 
      user_id: user?.id || "",
      type: "mention",
      title: "You were mentioned",
      message: "u/developer123 mentioned you in a post about React best practices",
      read: false,
      created_at: new Date(Date.now() - 7200000).toISOString(),
      data: { post_id: "789" }
    },
    {
      id: "3",
      user_id: user?.id || "",
      type: "system",
      title: "Welcome to Reddit Clone!",
      message: "Thanks for joining our community. Start by exploring some communities!",
      read: true,
      created_at: new Date(Date.now() - 86400000).toISOString(),
    }
  ];

  useEffect(() => {
    if (user) {
      // For now, use mock data
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
      setLoading(false);
    }
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    try {
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // In a real implementation, you would update the database here
      toast({
        title: "Notification marked as read",
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
      
      toast({
        title: "All notifications marked as read",
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const notification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      toast({
        title: "Notification deleted",
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const createNotification = async (notification: Omit<Notification, "id" | "user_id" | "created_at">) => {
    if (!user) return;
    
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      user_id: user.id,
      created_at: new Date().toISOString(),
    };

    setNotifications(prev => [newNotification, ...prev]);
    if (!notification.read) {
      setUnreadCount(prev => prev + 1);
    }
  };

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
  };
};