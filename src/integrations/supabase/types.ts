export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chat_messages: {
        Row: {
          id: string
          conversation_id: string
          sender: Database["public"]["Enums"]["message_sender"]
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender: Database["public"]["Enums"]["message_sender"]
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender?: Database["public"]["Enums"]["message_sender"]
          content?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          }
        ]
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          title: string
          created_at: string
          updated_at: string
          message_count: number | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          created_at?: string
          updated_at?: string
          message_count?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          created_at?: string
          updated_at?: string
          message_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      crisis_entries: {
        Row: {
          id: string
          user_id: string
          severity: Database["public"]["Enums"]["crisis_severity"]
          description: string
          coping_strategies: string | null
          support_contacted: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          severity: Database["public"]["Enums"]["crisis_severity"]
          description: string
          coping_strategies?: string | null
          support_contacted?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          severity?: Database["public"]["Enums"]["crisis_severity"]
          description?: string
          coping_strategies?: string | null
          support_contacted?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crisis_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      journal_entries: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          mood: Database["public"]["Enums"]["journal_mood"]
          entry_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          mood: Database["public"]["Enums"]["journal_mood"]
          entry_date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          mood?: Database["public"]["Enums"]["journal_mood"]
          entry_date?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      medication_checkins: {
        Row: {
          id: string
          medication_entry_id: string
          taken: boolean
          checkin_date: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          medication_entry_id: string
          taken: boolean
          checkin_date: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          medication_entry_id?: string
          taken?: boolean
          checkin_date?: string
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medication_checkins_medication_entry_id_fkey"
            columns: ["medication_entry_id"]
            isOneToOne: false
            referencedRelation: "medication_entries"
            referencedColumns: ["id"]
          }
        ]
      }
      medication_entries: {
        Row: {
          id: string
          user_id: string
          medication_name: string
          dosage: string
          frequency: string
          start_date: string
          end_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          medication_name: string
          dosage: string
          frequency: string
          start_date: string
          end_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          medication_name?: string
          dosage?: string
          frequency?: string
          start_date?: string
          end_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medication_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      mood_entries: {
        Row: {
          id: string
          user_id: string
          mood_level: Database["public"]["Enums"]["mood_level"]
          entry_date: string
          additional_thoughts: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mood_level: Database["public"]["Enums"]["mood_level"]
          entry_date: string
          additional_thoughts?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          mood_level?: Database["public"]["Enums"]["mood_level"]
          entry_date?: string
          additional_thoughts?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mood_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string
          phone: string | null
          location: string | null
          bio: string | null
          date_of_birth: string | null
          profile_picture_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email: string
          phone?: string | null
          location?: string | null
          bio?: string | null
          date_of_birth?: string | null
          profile_picture_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string
          phone?: string | null
          location?: string | null
          bio?: string | null
          date_of_birth?: string | null
          profile_picture_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      recovery_entries: {
        Row: {
          id: string
          user_id: string
          entry_date: string
          recovery_status: string
          mood_score: number | null
          energy_level: number | null
          sleep_quality: number | null
          medication_adherence: boolean
          therapy_session: boolean
          exercise_completed: boolean
          social_connection: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          entry_date: string
          recovery_status: string
          mood_score?: number | null
          energy_level?: number | null
          sleep_quality?: number | null
          medication_adherence?: boolean
          therapy_session?: boolean
          exercise_completed?: boolean
          social_connection?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          entry_date?: string
          recovery_status?: string
          mood_score?: number | null
          energy_level?: number | null
          sleep_quality?: number | null
          medication_adherence?: boolean
          therapy_session?: boolean
          exercise_completed?: boolean
          social_connection?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recovery_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      recovery_goals: {
        Row: {
          id: string
          user_id: string
          goal_type: string
          title: string
          description: string | null
          target_value: number
          current_value: number
          unit: string | null
          start_date: string
          end_date: string
          is_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          goal_type: string
          title: string
          description?: string | null
          target_value: number
          current_value?: number
          unit?: string | null
          start_date: string
          end_date: string
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          goal_type?: string
          title?: string
          description?: string | null
          target_value?: number
          current_value?: number
          unit?: string | null
          start_date?: string
          end_date?: string
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recovery_goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      recovery_milestones: {
        Row: {
          id: string
          user_id: string
          milestone_type: string
          title: string
          description: string | null
          achieved_date: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          milestone_type: string
          title: string
          description?: string | null
          achieved_date: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          milestone_type?: string
          title?: string
          description?: string | null
          achieved_date?: string
          metadata?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recovery_milestones_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      resources: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          url: string | null
          phone: string | null
          language: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          url?: string | null
          phone?: string | null
          language: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          url?: string | null
          phone?: string | null
          language?: string
          created_at?: string
        }
        Relationships: []
      }
      user_resource_bookmarks: {
        Row: {
          id: string
          user_id: string
          resource_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          resource_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          resource_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_resource_bookmarks_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_resource_bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      crisis_severity: "low" | "moderate" | "high" | "critical"
      journal_mood: "very_happy" | "happy" | "neutral" | "sad" | "very_sad"
      message_sender: "user" | "ai"
      mood_level: "very_happy" | "happy" | "neutral" | "sad" | "very_sad"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          preferred_language: string | null
          timezone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          preferred_language?: string | null
          timezone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          preferred_language?: string | null
          timezone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      mood_entries: {
        Row: {
          id: string
          user_id: string
          mood_level: number
          emotions: string[]
          triggers: string[]
          additional_thoughts: string | null
          entry_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mood_level: number
          emotions?: string[]
          triggers?: string[]
          additional_thoughts?: string | null
          entry_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          mood_level?: number
          emotions?: string[]
          triggers?: string[]
          additional_thoughts?: string | null
          entry_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      journal_entries: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          mood: 'happy' | 'good' | 'okay' | 'low' | 'sad'
          entry_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          mood?: 'happy' | 'good' | 'okay' | 'low' | 'sad'
          entry_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          mood?: 'happy' | 'good' | 'okay' | 'low' | 'sad'
          entry_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          title: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          conversation_id: string
          sender: 'user' | 'ai'
          content: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender: 'user' | 'ai'
          content: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender?: 'user' | 'ai'
          content?: string
          metadata?: Json
          created_at?: string
        }
      }
      crisis_entries: {
        Row: {
          id: string
          user_id: string
          severity: 'low' | 'medium' | 'high' | 'critical'
          description: string | null
          coping_strategies: string[]
          emergency_contacts_notified: boolean
          resolved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          severity: 'low' | 'medium' | 'high' | 'critical'
          description?: string | null
          coping_strategies?: string[]
          emergency_contacts_notified?: boolean
          resolved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          severity?: 'low' | 'medium' | 'high' | 'critical'
          description?: string | null
          coping_strategies?: string[]
          emergency_contacts_notified?: boolean
          resolved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      resources: {
        Row: {
          id: string
          title: string
          description: string | null
          url: string | null
          category: string
          language: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          url?: string | null
          category: string
          language?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          url?: string | null
          category?: string
          language?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_resource_bookmarks: {
        Row: {
          id: string
          user_id: string
          resource_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          resource_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          resource_id?: string
          created_at?: string
        }
      }
      medication_entries: {
        Row: {
          id: string
          user_id: string
          medication_name: string
          dosage: string | null
          frequency: string | null
          notes: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          medication_name: string
          dosage?: string | null
          frequency?: string | null
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          medication_name?: string
          dosage?: string | null
          frequency?: string | null
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      medication_checkins: {
        Row: {
          id: string
          medication_entry_id: string
          taken_at: string
          notes: string | null
          side_effects: string[]
        }
        Insert: {
          id?: string
          medication_entry_id: string
          taken_at?: string
          notes?: string | null
          side_effects?: string[]
        }
        Update: {
          id?: string
          medication_entry_id?: string
          taken_at?: string
          notes?: string | null
          side_effects?: string[]
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      mood_level: 'very_low' | 'low' | 'okay' | 'good' | 'excellent'
      journal_mood: 'happy' | 'good' | 'okay' | 'low' | 'sad'
      message_sender: 'user' | 'ai'
      crisis_severity: 'low' | 'medium' | 'high' | 'critical'
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
    Enums: {},
  },
} as const
