-- SpekNova Database Schema Migration
-- Designed for PostgreSQL & Supabase

-- Profiles Table (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    target_industry TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Sessions Table
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    mode TEXT NOT NULL CHECK (mode IN ('gd', 'hr', 'tech', 'speech')),
    topic TEXT NOT NULL,
    overall_score INT NOT NULL DEFAULT 0,
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Session Metrics Table (Scores from Vision, Speech & Content analysis)
CREATE TABLE IF NOT EXISTS public.session_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE UNIQUE NOT NULL,
    eye_contact_percentage INT DEFAULT 0,
    words_per_minute INT DEFAULT 0,
    filler_words_count INT DEFAULT 0,
    pauses_count INT DEFAULT 0,
    grammar_score INT DEFAULT 0,
    content_relevance_score INT DEFAULT 0
);

-- Session Reports Table (AI Feedback, strengths, weaknesses)
CREATE TABLE IF NOT EXISTS public.session_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE UNIQUE NOT NULL,
    strengths TEXT[] DEFAULT '{}'::TEXT[],
    weaknesses TEXT[] DEFAULT '{}'::TEXT[],
    personalized_feedback TEXT,
    recommendations TEXT[] DEFAULT '{}'::TEXT[]
);

-- Replay Events Table (Timeline markers)
CREATE TABLE IF NOT EXISTS public.replay_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
    timestamp_seconds INT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('GOOD', 'IMPROVEMENT')),
    label TEXT NOT NULL,
    description TEXT
);

-- Multiplayer Rooms Table
CREATE TABLE IF NOT EXISTS public.multiplayer_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_code VARCHAR(10) UNIQUE NOT NULL,
    host_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'LOBBY' CHECK (status IN ('LOBBY', 'ACTIVE', 'COMPLETE')),
    topic TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Room Participants Table
CREATE TABLE IF NOT EXISTS public.room_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES public.multiplayer_rooms(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(room_id, user_id)
);

-- Achievements Table
CREATE TABLE IF NOT EXISTS public.achievements (
    id VARCHAR(50) PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    badge_icon TEXT NOT NULL
);

-- User Achievements Table
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    achievement_id VARCHAR(50) REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, achievement_id)
);

-- Populate Default Achievements
INSERT INTO public.achievements (id, title, description, badge_icon) VALUES
('first_session', 'First Step', 'Complete your very first practice session', 'Sparkles'),
('gd_starter', 'GD Starter', 'Complete 3 Group Discussion simulations', 'Users'),
('confident_speaker', 'Eloquent Speaker', 'Achieve a speech score of 85+ on a session', 'Volume2'),
('eye_contact_pro', 'Focussed Eye', 'Achieve 85%+ eye contact metrics in a session', 'Video')
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    badge_icon = EXCLUDED.badge_icon;

-- Enable Row Level Security (RLS) on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can edit their own profiles" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create automatic profile creation trigger on User Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, target_industry)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'SpekNova User'),
        COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'),
        'Technology / General Placement'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
