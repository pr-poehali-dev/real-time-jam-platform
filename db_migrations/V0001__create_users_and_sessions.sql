
CREATE TABLE IF NOT EXISTS t_p91204118_real_time_jam_platfo.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p91204118_real_time_jam_platfo.sessions (
    token TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES t_p91204118_real_time_jam_platfo.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days'
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON t_p91204118_real_time_jam_platfo.sessions(user_id);
