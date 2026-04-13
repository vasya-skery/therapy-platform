-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('client', 'therapist', 'admin')),
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Therapist profiles
CREATE TABLE therapist_profiles (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  specialization TEXT[],
  approaches TEXT[],
  education TEXT[],
  experience_years INTEGER DEFAULT 0,
  languages TEXT[] DEFAULT ARRAY['Ukrainian'],
  price_per_session INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'UAH',
  session_duration INTEGER DEFAULT 50,
  bioUk TEXT,
  bioEn TEXT,
  license_number TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  working_hours JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  therapist_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration INTEGER DEFAULT 50,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  type TEXT DEFAULT 'video' CHECK (type IN ('video', 'chat', 'phone')),
  notes TEXT,
  price INTEGER NOT NULL,
  currency TEXT DEFAULT 'UAH',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages (Chat)
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  therapist_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, therapist_id)
);

CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  therapist_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  commentUk TEXT,
  commentEn TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(appointment_id)
);

-- Topics/Tags
CREATE TABLE topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nameUk TEXT NOT NULL,
  nameEn TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

-- Therapist-Topics junction
CREATE TABLE therapist_topics (
  therapist_id UUID REFERENCES therapist_profiles(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  PRIMARY KEY (therapist_id, topic_id)
);

-- Row Level Security Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Therapist profiles: public read
CREATE POLICY "Therapist profiles are viewable" ON therapist_profiles FOR SELECT USING (true);
CREATE POLICY "Therapists can update own profile" ON therapist_profiles FOR UPDATE USING (auth.uid() = id);

-- Appointments: users see own
CREATE POLICY "Users can view own appointments" ON appointments FOR SELECT USING (auth.uid() = client_id OR auth.uid() = therapist_id);
CREATE POLICY "Clients can create appointments" ON appointments FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Users can update own appointments" ON appointments FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = therapist_id);

-- Conversations: participants only
CREATE POLICY "Participants can view conversations" ON conversations FOR SELECT USING (auth.uid() = client_id OR auth.uid() = therapist_id);
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT WITH CHECK (auth.uid() = client_id OR auth.uid() = therapist_id);

-- Messages: participants only
CREATE POLICY "Participants can view messages" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM conversations WHERE id = conversation_id AND (client_id = auth.uid() OR therapist_id = auth.uid()))
);
CREATE POLICY "Participants can send messages" ON messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM conversations WHERE id = conversation_id AND (client_id = auth.uid() OR therapist_id = auth.uid()))
);

-- Reviews: public read, verified clients can create
CREATE POLICY "Reviews are viewable" ON reviews FOR SELECT USING (true);
CREATE POLICY "Clients can create reviews after completed appointment" ON reviews FOR INSERT WITH CHECK (auth.uid() = client_id);

-- Topics: public read
CREATE POLICY "Topics are viewable" ON topics FOR SELECT USING (true);
CREATE POLICY "Admins can manage topics" ON topics FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER therapist_profiles_updated_at BEFORE UPDATE ON therapist_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed topics
INSERT INTO topics (nameUk, nameEn, slug) VALUES
  ('Депресія', 'Depression', 'depression'),
  ('Тривожність', 'Anxiety', 'anxiety'),
  ('Самооцінка', 'Self-esteem', 'self-esteem'),
  ('Вигорання', 'Burnout', 'burnout'),
  ('Стосунки', 'Relationships', 'relationships'),
  ('Стрес', 'Stress', 'stress'),
  ('Панічні атаки', 'Panic attacks', 'panic-attacks'),
  ('OCD', 'OCD', 'ocd'),
  ('Травма', 'Trauma', 'trauma'),
  ('Сум', 'Grief', 'grief'),
  ('Гнів', 'Anger', 'anger'),
  ('Самотність', 'Loneliness', 'loneliness');

-- Seed therapist profiles
INSERT INTO therapist_profiles (id, specialization, approaches, education, experience_years, languages, price_per_session, currency, session_duration, bioEn, is_verified, is_available, rating, review_count) VALUES
  ('c7a16048-4803-458b-9b01-3b94ed6beba7', ARRAY['anxiety', 'depression'], ARRAY['CBT', 'Gestalt'], ARRAY['University of Psychology'], 10, ARRAY['English', 'Ukrainian'], 80, 'USD', 50, 'I am a licensed therapist with 10 years of experience helping people overcome anxiety and depression.', true, true, 4.8, 45),
  ('06450494-9b60-4e2d-ad6c-6e519f4a0459', ARRAY['trauma', 'PTSD'], ARRAY['EMDR', 'CBT'], ARRAY['Medical University'], 15, ARRAY['English'], 100, 'USD', 50, 'Specializing in trauma recovery and PTSD treatment with 15 years of experience.', true, true, 4.9, 82),
  ('287ba6b4-df91-49d3-b01b-fe81c505ef43', ARRAY['relationships', 'family'], ARRAY['Systemic', 'Family'], ARRAY['Institute of Family Therapy'], 8, ARRAY['Ukrainian', 'English'], 70, 'USD', 50, 'Helping individuals and couples navigate relationship challenges.', true, true, 4.6, 38),
  ('7471c2a6-8feb-4e80-adb5-cc5615fcac22', ARRAY['stress', 'work'], ARRAY['CBT', 'Mindfulness'], ARRAY['Business Psychology Institute'], 12, ARRAY['Ukrainian', 'English'], 90, 'USD', 50, 'Work-related stress and burnout specialist with corporate experience.', true, true, 4.7, 56),
  ('cbe627a8-085e-4ee6-abe4-d45e60d0148a', ARRAY['anxiety', 'depression'], ARRAY['ACT', 'CBT'], ARRAY['Clinical Psychology Master'], 6, ARRAY['Ukrainian'], 60, 'USD', 50, 'Passionate about helping young adults with anxiety and depression.', true, true, 4.5, 22);
