export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          household_size: number
          has_children: boolean
          income: string
          zip_code: string
          primary_needs: string[]
          language: string
          completed_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          household_size: number
          has_children: boolean
          income: string
          zip_code: string
          primary_needs: string[]
          language: string
          completed_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          household_size?: number
          has_children?: boolean
          income?: string
          zip_code?: string
          primary_needs?: string[]
          language?: string
          completed_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          user_id: string
          program_id: string
          program_name: string
          status: 'saved' | 'started' | 'submitted' | 'approved' | 'denied'
          applied_at: string
          documents_checked: string[]
          notes?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          program_id: string
          program_name: string
          status?: 'saved' | 'started' | 'submitted' | 'approved' | 'denied'
          applied_at?: string
          documents_checked?: string[]
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          program_id?: string
          program_name?: string
          status?: 'saved' | 'started' | 'submitted' | 'approved' | 'denied'
          applied_at?: string
          documents_checked?: string[]
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
      business_license_applications: {
        Row: {
          id: string
          user_id: string
          license_id: string
          license_name: string
          status: 'researching' | 'preparing' | 'submitted' | 'under-review' | 'approved' | 'denied'
          started_at: string
          submitted_at?: string
          documents_completed: string[]
          training_completed: string[]
          notes?: string
          estimated_completion?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          license_id: string
          license_name: string
          status?: 'researching' | 'preparing' | 'submitted' | 'under-review' | 'approved' | 'denied'
          started_at?: string
          submitted_at?: string
          documents_completed?: string[]
          training_completed?: string[]
          notes?: string
          estimated_completion?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          license_id?: string
          license_name?: string
          status?: 'researching' | 'preparing' | 'submitted' | 'under-review' | 'approved' | 'denied'
          started_at?: string
          submitted_at?: string
          documents_completed?: string[]
          training_completed?: string[]
          notes?: string
          estimated_completion?: string
          created_at?: string
          updated_at?: string
        }
      }
      training_progress: {
        Row: {
          id: string
          user_id: string
          license_id: string
          module_id: string
          completed: boolean
          progress_percentage: number
          completed_at?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          license_id: string
          module_id: string
          completed?: boolean
          progress_percentage?: number
          completed_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          license_id?: string
          module_id?: string
          completed?: boolean
          progress_percentage?: number
          completed_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      local_businesses: {
        Row: {
          id: string
          name: string
          category: string
          description: string
          address: string
          latitude: number
          longitude: number
          phone: string
          website: string
          email: string
          hours: Json
          services: string[]
          owner_name: string
          owner_story: string
          years_in_business: number
          highlights: string[]
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          description: string
          address: string
          latitude: number
          longitude: number
          phone: string
          website: string
          email: string
          hours: Json
          services: string[]
          owner_name: string
          owner_story: string
          years_in_business: number
          highlights: string[]
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string
          address?: string
          latitude?: number
          longitude?: number
          phone?: string
          website?: string
          email?: string
          hours?: Json
          services?: string[]
          owner_name?: string
          owner_story?: string
          years_in_business?: number
          highlights?: string[]
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      farmers_markets: {
        Row: {
          id: string
          name: string
          description: string
          address: string
          latitude: number
          longitude: number
          hours: Json
          season: string
          vendors: number
          categories: string[]
          features: string[]
          phone: string
          website: string
          email: string
          daily_fee: number
          seasonal_fee: number
          requirements: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          address: string
          latitude: number
          longitude: number
          hours: Json
          season: string
          vendors: number
          categories: string[]
          features: string[]
          phone: string
          website: string
          email: string
          daily_fee: number
          seasonal_fee: number
          requirements: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          address?: string
          latitude?: number
          longitude?: number
          hours?: Json
          season?: string
          vendors?: number
          categories?: string[]
          features?: string[]
          phone?: string
          website?: string
          email?: string
          daily_fee?: number
          seasonal_fee?: number
          requirements?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      market_vendors: {
        Row: {
          id: string
          market_id: string
          name: string
          description: string
          products: string[]
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          market_id: string
          name: string
          description: string
          products: string[]
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          market_id?: string
          name?: string
          description?: string
          products?: string[]
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      business_reviews: {
        Row: {
          id: string
          business_id: string
          user_id: string
          rating: number
          review: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          user_id: string
          rating: number
          review: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          user_id?: string
          rating?: number
          review?: string
          created_at?: string
          updated_at?: string
        }
      }
      page_views: {
        Row: {
          id: string
          page: string
          user_id?: string
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          page: string
          user_id?: string
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          page?: string
          user_id?: string
          timestamp?: string
          created_at?: string
        }
      }
      application_events: {
        Row: {
          id: string
          program_id: string
          user_id: string
          event_type: string
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          program_id: string
          user_id: string
          event_type: string
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          program_id?: string
          user_id?: string
          event_type?: string
          timestamp?: string
          created_at?: string
        }
      }
      training_events: {
        Row: {
          id: string
          license_id: string
          module_id: string
          user_id: string
          event_type: string
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          license_id: string
          module_id: string
          user_id: string
          event_type: string
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          license_id?: string
          module_id?: string
          user_id?: string
          event_type?: string
          timestamp?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          read: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: string
          read?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          read?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      programs: {
        Row: {
          id: string
          name: string
          category: string
          description: string
          eligibility: Json
          benefits: string[]
          documents: string[]
          contact: Json
          languages: string[]
          application_url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          description: string
          eligibility: Json
          benefits: string[]
          documents: string[]
          contact: Json
          languages: string[]
          application_url: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string
          eligibility?: Json
          benefits?: string[]
          documents?: string[]
          contact?: Json
          languages?: string[]
          application_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      business_licenses: {
        Row: {
          id: string
          name: string
          category: string
          description: string
          requirements: Json
          documents: string[]
          fees: Json
          timeline: string
          contact: Json
          training_modules: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          description: string
          requirements: Json
          documents: string[]
          fees: Json
          timeline: string
          contact: Json
          training_modules: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string
          requirements?: Json
          documents?: string[]
          fees?: Json
          timeline?: string
          contact?: Json
          training_modules?: Json
          created_at?: string
          updated_at?: string
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