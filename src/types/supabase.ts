export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          cover_image: string | null;
          status: "draft" | "published";
          tags: string[];
          view_count: number;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content?: string;
          cover_image?: string | null;
          status?: "draft" | "published";
          tags?: string[];
          view_count?: number;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string;
          cover_image?: string | null;
          status?: "draft" | "published";
          tags?: string[];
          view_count?: number;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          parent_id: string | null;
          author_name: string;
          author_email: string;
          content: string;
          is_admin: boolean;
          status: "approved" | "hidden";
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          parent_id?: string | null;
          author_name: string;
          author_email: string;
          content: string;
          is_admin?: boolean;
          status?: "approved" | "hidden";
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          parent_id?: string | null;
          author_name?: string;
          author_email?: string;
          content?: string;
          is_admin?: boolean;
          status?: "approved" | "hidden";
          created_at?: string;
        };
      };
    };
    Functions: {
      increment_post_view: {
        Args: { post_slug: string };
        Returns: void;
      };
    };
  };
}

// Exported type aliases for convenience
export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];
export type PostUpdate = Database["public"]["Tables"]["posts"]["Update"];
export type Comment = Database["public"]["Tables"]["comments"]["Row"];
export type CommentInsert = Database["public"]["Tables"]["comments"]["Insert"];
export type CommentUpdate = Database["public"]["Tables"]["comments"]["Update"];

// Extended types
export type CommentWithReplies = Comment & {
  replies?: Comment[];
};
