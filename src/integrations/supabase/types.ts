export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      comments: {
        Row: {
          author_id: string
          awards: number | null
          content: string
          created_at: string | null
          depth: number | null
          downvotes: number | null
          id: string
          parent_id: string | null
          post_id: string
          updated_at: string | null
          upvotes: number | null
        }
        Insert: {
          author_id: string
          awards?: number | null
          content: string
          created_at?: string | null
          depth?: number | null
          downvotes?: number | null
          id?: string
          parent_id?: string | null
          post_id: string
          updated_at?: string | null
          upvotes?: number | null
        }
        Update: {
          author_id?: string
          awards?: number | null
          content?: string
          created_at?: string | null
          depth?: number | null
          downvotes?: number | null
          id?: string
          parent_id?: string | null
          post_id?: string
          updated_at?: string | null
          upvotes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string
          awards: number | null
          comment_count: number | null
          content: string | null
          created_at: string | null
          downvotes: number | null
          flair: string | null
          id: string
          image_url: string | null
          is_locked: boolean | null
          is_stickied: boolean | null
          link_url: string | null
          subreddit_id: string
          title: string
          type: Database["public"]["Enums"]["post_type"]
          updated_at: string | null
          upvotes: number | null
        }
        Insert: {
          author_id: string
          awards?: number | null
          comment_count?: number | null
          content?: string | null
          created_at?: string | null
          downvotes?: number | null
          flair?: string | null
          id?: string
          image_url?: string | null
          is_locked?: boolean | null
          is_stickied?: boolean | null
          link_url?: string | null
          subreddit_id: string
          title: string
          type?: Database["public"]["Enums"]["post_type"]
          updated_at?: string | null
          upvotes?: number | null
        }
        Update: {
          author_id?: string
          awards?: number | null
          comment_count?: number | null
          content?: string | null
          created_at?: string | null
          downvotes?: number | null
          flair?: string | null
          id?: string
          image_url?: string | null
          is_locked?: boolean | null
          is_stickied?: boolean | null
          link_url?: string | null
          subreddit_id?: string
          title?: string
          type?: Database["public"]["Enums"]["post_type"]
          updated_at?: string | null
          upvotes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "posts_subreddit_id_fkey"
            columns: ["subreddit_id"]
            isOneToOne: false
            referencedRelation: "subreddits"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          comment_karma: number | null
          created_at: string | null
          display_name: string | null
          id: string
          is_online: boolean | null
          is_premium: boolean | null
          karma: number | null
          location: string | null
          post_karma: number | null
          updated_at: string | null
          user_id: string
          username: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          comment_karma?: number | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          is_online?: boolean | null
          is_premium?: boolean | null
          karma?: number | null
          location?: string | null
          post_karma?: number | null
          updated_at?: string | null
          user_id: string
          username: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          comment_karma?: number | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          is_online?: boolean | null
          is_premium?: boolean | null
          karma?: number | null
          location?: string | null
          post_karma?: number | null
          updated_at?: string | null
          user_id?: string
          username?: string
          website?: string | null
        }
        Relationships: []
      }
      subreddit_memberships: {
        Row: {
          id: string
          joined_at: string | null
          subreddit_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          subreddit_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          subreddit_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subreddit_memberships_subreddit_id_fkey"
            columns: ["subreddit_id"]
            isOneToOne: false
            referencedRelation: "subreddits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subreddit_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      subreddits: {
        Row: {
          active_members: number | null
          banner_url: string | null
          category: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          display_name: string
          icon_url: string | null
          id: string
          is_nsfw: boolean | null
          members: number | null
          name: string
          updated_at: string | null
        }
        Insert: {
          active_members?: number | null
          banner_url?: string | null
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          display_name: string
          icon_url?: string | null
          id?: string
          is_nsfw?: boolean | null
          members?: number | null
          name: string
          updated_at?: string | null
        }
        Update: {
          active_members?: number | null
          banner_url?: string | null
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          display_name?: string
          icon_url?: string | null
          id?: string
          is_nsfw?: boolean | null
          members?: number | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subreddits_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          subreddit_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          subreddit_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          subreddit_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_subreddit_id_fkey"
            columns: ["subreddit_id"]
            isOneToOne: false
            referencedRelation: "subreddits"
            referencedColumns: ["id"]
          },
        ]
      }
      votes: {
        Row: {
          comment_id: string | null
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string
          vote_type: number
        }
        Insert: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id: string
          vote_type: number
        }
        Update: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string
          vote_type?: number
        }
        Relationships: [
          {
            foreignKeyName: "votes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      increment_comment_count: {
        Args: { post_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      post_type: "text" | "link" | "image" | "video"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      post_type: ["text", "link", "image", "video"],
    },
  },
} as const
