export type Profile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: 'client' | 'therapist' | 'admin'
  phone: string | null
  created_at: string
  updated_at: string
}

export type TherapistProfile = {
  id: string
  specialization: string[]
  approaches: string[]
  education: string[]
  experience_years: number
  languages: string[]
  price_per_session: number
  currency: string
  session_duration: number
  bioUk: string | null
  bioEn: string | null
  license_number: string | null
  is_verified: boolean
  is_available: boolean
  rating: number
  review_count: number
  working_hours: Record<string, { start: string; end: string }>
  created_at: string
  updated_at: string
  profiles?: Profile
}

export type TherapistWithProfile = TherapistProfile & {
  profiles: Profile
  topics?: { topics: Topic }[]
}

export type Appointment = {
  id: string
  client_id: string
  therapist_id: string
  scheduled_at: string
  duration: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  type: 'video' | 'chat' | 'phone'
  notes: string | null
  price: number
  currency: string
  created_at: string
  updated_at: string
  profiles?: Profile
}

export type Conversation = {
  id: string
  client_id: string
  therapist_id: string
  last_message_at: string
  created_at: string
  profiles?: Profile[]
  messages?: Message[]
}

export type Message = {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  is_read: boolean
  created_at: string
}

export type Review = {
  id: string
  appointment_id: string | null
  client_id: string
  therapist_id: string
  rating: number
  commentUk: string | null
  commentEn: string | null
  created_at: string
  profiles?: Profile
}

export type Topic = {
  id: string
  nameUk: string
  nameEn: string
  slug: string
}
