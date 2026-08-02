export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      donations: {
        Row: {
          amount_cents: number
          certificate_path: string | null
          created_at: string
          currency: string
          donor_id: string
          event_id: number | null
          frequency: Database["public"]["Enums"]["donation_frequency"] | null
          id: number
          kind: Database["public"]["Enums"]["donation_kind"]
          note: string | null
          status: Database["public"]["Enums"]["donation_status"]
        }
        Insert: {
          amount_cents: number
          certificate_path?: string | null
          created_at?: string
          currency?: string
          donor_id: string
          event_id?: number | null
          frequency?: Database["public"]["Enums"]["donation_frequency"] | null
          id?: never
          kind: Database["public"]["Enums"]["donation_kind"]
          note?: string | null
          status: Database["public"]["Enums"]["donation_status"]
        }
        Update: {
          amount_cents?: number
          certificate_path?: string | null
          created_at?: string
          currency?: string
          donor_id?: string
          event_id?: number | null
          frequency?: Database["public"]["Enums"]["donation_frequency"] | null
          id?: never
          kind?: Database["public"]["Enums"]["donation_kind"]
          note?: string | null
          status?: Database["public"]["Enums"]["donation_status"]
        }
        Relationships: [
          {
            foreignKeyName: "donations_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_guest_signups: {
        Row: {
          created_at: string
          event_id: number
          guest_email: string
          guest_name: string
          id: number
          interest: string | null
          status: Database["public"]["Enums"]["participation_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_id: number
          guest_email: string
          guest_name: string
          id?: never
          interest?: string | null
          status?: Database["public"]["Enums"]["participation_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_id?: number
          guest_email?: string
          guest_name?: string
          id?: never
          interest?: string | null
          status?: Database["public"]["Enums"]["participation_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_guest_signups_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_participations: {
        Row: {
          certificate_path: string | null
          created_at: string
          event_id: number
          hours_logged: number | null
          id: number
          interest: string | null
          status: Database["public"]["Enums"]["participation_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          certificate_path?: string | null
          created_at?: string
          event_id: number
          hours_logged?: number | null
          id?: never
          interest?: string | null
          status?: Database["public"]["Enums"]["participation_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          certificate_path?: string | null
          created_at?: string
          event_id?: number
          hours_logged?: number | null
          id?: never
          interest?: string | null
          status?: Database["public"]["Enums"]["participation_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_participations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_participations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          audience: Database["public"]["Enums"]["event_audience"]
          created_at: string
          date: string | null
          description: string | null
          description_cn: string | null
          description_zh: string | null
          ends_at: string | null
          id: number
          image: string | null
          location: string | null
          location_cn: string | null
          location_link: string | null
          location_zh: string | null
          starts_at: string
          status: Database["public"]["Enums"]["event_status"]
          subtype: string | null
          title: string
          title_cn: string | null
          title_zh: string | null
          type: Database["public"]["Enums"]["event_type"] | null
          updated_at: string
        }
        Insert: {
          audience?: Database["public"]["Enums"]["event_audience"]
          created_at?: string
          date?: string | null
          description?: string | null
          description_cn?: string | null
          description_zh?: string | null
          ends_at?: string | null
          id?: never
          image?: string | null
          location?: string | null
          location_cn?: string | null
          location_link?: string | null
          location_zh?: string | null
          starts_at: string
          status?: Database["public"]["Enums"]["event_status"]
          subtype?: string | null
          title: string
          title_cn?: string | null
          title_zh?: string | null
          type?: Database["public"]["Enums"]["event_type"] | null
          updated_at?: string
        }
        Update: {
          audience?: Database["public"]["Enums"]["event_audience"]
          created_at?: string
          date?: string | null
          description?: string | null
          description_cn?: string | null
          description_zh?: string | null
          ends_at?: string | null
          id?: never
          image?: string | null
          location?: string | null
          location_cn?: string | null
          location_link?: string | null
          location_zh?: string | null
          starts_at?: string
          status?: Database["public"]["Enums"]["event_status"]
          subtype?: string | null
          title?: string
          title_cn?: string | null
          title_zh?: string | null
          type?: Database["public"]["Enums"]["event_type"] | null
          updated_at?: string
        }
        Relationships: []
      }
      instagram_posts: {
        Row: {
          caption: string
          created_at: string
          id: string
          image_url: string
          media_type: string
          permalink: string
          timestamp: string
          updated_at: string
        }
        Insert: {
          caption?: string
          created_at?: string
          id: string
          image_url: string
          media_type?: string
          permalink: string
          timestamp?: string
          updated_at?: string
        }
        Update: {
          caption?: string
          created_at?: string
          id?: string
          image_url?: string
          media_type?: string
          permalink?: string
          timestamp?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonial_translations: {
        Row: {
          attribution: string | null
          body: string
          image_alt: string | null
          locale: Database["public"]["Enums"]["testimonial_locale"]
          quote: string | null
          story_label: string
          testimonial_id: number
        }
        Insert: {
          attribution?: string | null
          body: string
          image_alt?: string | null
          locale: Database["public"]["Enums"]["testimonial_locale"]
          quote?: string | null
          story_label: string
          testimonial_id: number
        }
        Update: {
          attribution?: string | null
          body?: string
          image_alt?: string | null
          locale?: Database["public"]["Enums"]["testimonial_locale"]
          quote?: string | null
          story_label?: string
          testimonial_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "testimonial_translations_testimonial_id_fkey"
            columns: ["testimonial_id"]
            isOneToOne: false
            referencedRelation: "testimonials"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          created_at: string
          created_by: string | null
          id: number
          image_path: string
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["testimonial_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: never
          image_path: string
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["testimonial_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: never
          image_path?: string
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["testimonial_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          about: string | null
          address: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          name_cn: string | null
          name_zh: string | null
          phone_number: string | null
          profile_image: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          about?: string | null
          address?: string | null
          created_at?: string
          email?: string | null
          id: string
          name: string
          name_cn?: string | null
          name_zh?: string | null
          phone_number?: string | null
          profile_image?: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          about?: string | null
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          name_cn?: string | null
          name_zh?: string | null
          phone_number?: string | null
          profile_image?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      volunteer_applications: {
        Row: {
          age_group: string | null
          bio: string | null
          created_at: string
          gender: string | null
          id: number
          parental_consent_path: string | null
          referral_source: string | null
          rejection_reason: string | null
          rejection_reason_visible: boolean
          reviewed_at: string | null
          reviewed_by: string | null
          scrc_path: string | null
          status:
            | Database["public"]["Enums"]["volunteer_application_status"]
            | null
          submitted_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age_group?: string | null
          bio?: string | null
          created_at?: string
          gender?: string | null
          id?: never
          parental_consent_path?: string | null
          referral_source?: string | null
          rejection_reason?: string | null
          rejection_reason_visible?: boolean
          reviewed_at?: string | null
          reviewed_by?: string | null
          scrc_path?: string | null
          status?:
            | Database["public"]["Enums"]["volunteer_application_status"]
            | null
          submitted_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age_group?: string | null
          bio?: string | null
          created_at?: string
          gender?: string | null
          id?: never
          parental_consent_path?: string | null
          referral_source?: string | null
          rejection_reason?: string | null
          rejection_reason_visible?: boolean
          reviewed_at?: string | null
          reviewed_by?: string | null
          scrc_path?: string | null
          status?:
            | Database["public"]["Enums"]["volunteer_application_status"]
            | null
          submitted_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "volunteer_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
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
      donation_frequency: "monthly" | "quarterly" | "yearly"
      donation_kind: "one_time" | "recurring"
      donation_status: "completed" | "active" | "paused" | "cancelled"
      event_audience: "members" | "volunteers" | "everyone"
      event_status: "published" | "cancelled"
      event_type: "sport" | "nutrition" | "family_support"
      participation_status:
        | "accepted"
        | "attended"
        | "no_show"
        | "cancelled"
        | "pending"
        | "rejected"
      testimonial_locale: "en" | "zh" | "cn"
      testimonial_status: "draft" | "published"
      user_role: "member" | "contributor" | "staff"
      volunteer_application_status:
        | "submitted"
        | "under_review"
        | "approved"
        | "rejected"
        | "withdrawn"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Relationships: []
      }
      buckets_analytics: {
        Row: {
          created_at: string
          deleted_at: string | null
          format: string
          id: string
          name: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          format?: string
          id?: string
          name: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          format?: string
          id?: string
          name?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      buckets_vectors: {
        Row: {
          created_at: string
          id: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          metadata: Json | null
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          metadata?: Json | null
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          metadata?: Json | null
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      vector_indexes: {
        Row: {
          bucket_id: string
          created_at: string
          data_type: string
          dimension: number
          distance_metric: string
          id: string
          metadata_configuration: Json | null
          name: string
          updated_at: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          data_type: string
          dimension: number
          distance_metric: string
          id?: string
          metadata_configuration?: Json | null
          name: string
          updated_at?: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          data_type?: string
          dimension?: number
          distance_metric?: string
          id?: string
          metadata_configuration?: Json | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vector_indexes_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets_vectors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      allow_any_operation: {
        Args: { expected_operations: string[] }
        Returns: boolean
      }
      allow_only_operation: {
        Args: { expected_operation: string }
        Returns: boolean
      }
      can_insert_object: {
        Args: { bucketid: string; metadata: Json; name: string; owner: string }
        Returns: undefined
      }
      extension: { Args: { name: string }; Returns: string }
      filename: { Args: { name: string }; Returns: string }
      foldername: { Args: { name: string }; Returns: string[] }
      get_common_prefix: {
        Args: { p_delimiter: string; p_key: string; p_prefix: string }
        Returns: string
      }
      get_size_by_bucket: {
        Args: never
        Returns: {
          bucket_id: string
          size: number
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
          prefix_param: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          _bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_token?: string
          prefix_param: string
          sort_order?: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      operation: { Args: never; Returns: string }
      search: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_by_timestamp: {
        Args: {
          p_bucket_id: string
          p_level: number
          p_limit: number
          p_prefix: string
          p_sort_column: string
          p_sort_column_after: string
          p_sort_order: string
          p_start_after: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_v2: {
        Args: {
          bucket_name: string
          levels?: number
          limits?: number
          prefix: string
          sort_column?: string
          sort_column_after?: string
          sort_order?: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
    }
    Enums: {
      buckettype: "STANDARD" | "ANALYTICS" | "VECTOR"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      donation_frequency: ["monthly", "quarterly", "yearly"],
      donation_kind: ["one_time", "recurring"],
      donation_status: ["completed", "active", "paused", "cancelled"],
      event_audience: ["members", "volunteers", "everyone"],
      event_status: ["published", "cancelled"],
      event_type: ["sport", "nutrition", "family_support"],
      participation_status: [
        "accepted",
        "attended",
        "no_show",
        "cancelled",
        "pending",
        "rejected",
      ],
      user_role: ["member", "contributor", "staff"],
      volunteer_application_status: [
        "submitted",
        "under_review",
        "approved",
        "rejected",
        "withdrawn",
      ],
    },
  },
  storage: {
    Enums: {
      buckettype: ["STANDARD", "ANALYTICS", "VECTOR"],
    },
  },
} as const
