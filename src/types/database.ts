export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          location: string | null
          bio: string | null
          is_public: boolean
          availability: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          location?: string | null
          bio?: string | null
          is_public?: boolean
          availability?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          location?: string | null
          bio?: string | null
          is_public?: boolean
          availability?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          category: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string | null
          created_at?: string
        }
      }
      user_skills_offered: {
        Row: {
          id: string
          user_id: string
          skill_id: string
          proficiency_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skill_id: string
          proficiency_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          skill_id?: string
          proficiency_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          description?: string | null
          created_at?: string
        }
      }
      user_skills_wanted: {
        Row: {
          id: string
          user_id: string
          skill_id: string
          urgency: 'low' | 'medium' | 'high'
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skill_id: string
          urgency: 'low' | 'medium' | 'high'
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          skill_id?: string
          urgency?: 'low' | 'medium' | 'high'
          description?: string | null
          created_at?: string
        }
      }
      swap_requests: {
        Row: {
          id: string
          requester_id: string
          provider_id: string
          requested_skill_id: string
          offered_skill_id: string
          status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled'
          message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          requester_id: string
          provider_id: string
          requested_skill_id: string
          offered_skill_id: string
          status?: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled'
          message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          requester_id?: string
          provider_id?: string
          requested_skill_id?: string
          offered_skill_id?: string
          status?: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled'
          message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ratings: {
        Row: {
          id: string
          swap_request_id: string
          rater_id: string
          rated_id: string
          rating: number
          feedback: string | null
          created_at: string
        }
        Insert: {
          id?: string
          swap_request_id: string
          rater_id: string
          rated_id: string
          rating: number
          feedback?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          swap_request_id?: string
          rater_id?: string
          rated_id?: string
          rating?: number
          feedback?: string | null
          created_at?: string
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
      [_ in never]: never
    }
  }
}
