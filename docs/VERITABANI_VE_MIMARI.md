# UZAKTAN TÜRKOLOG — VERİTABANI ŞEMASI VE RLS GÜVENLİK POLİTİKALARI

## 1. Veritabanı Varlık-İlişki (ER) Mimarisi

Aşağıdaki PostgreSQL tablosu şeması, Supabase veya bağımsız PostgreSQL sunucusunda çalışacak şekilde tasarlanmıştır:

```sql
-- 1. KULLANICI PROFİLLERİ VE ROLLER
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('super_admin', 'admin', 'content_editor', 'reviewer', 'support', 'user')),
    is_super_admin BOOLEAN DEFAULT FALSE,
    current_direction TEXT NOT NULL DEFAULT 'TR_TO_KZ' CHECK (current_direction IN ('TR_TO_KZ', 'KZ_TO_TR')),
    current_level TEXT NOT NULL DEFAULT 'A2' CHECK (current_level IN ('A1', 'A2', 'B1', 'B2', 'C1')),
    streak_days INT DEFAULT 0,
    xp_points INT DEFAULT 0,
    daily_goal_minutes INT DEFAULT 15,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ÜNİTELER (UNITS)
CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_number INT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1')),
    direction TEXT NOT NULL CHECK (direction IN ('TR_TO_KZ', 'KZ_TO_TR')),
    title_tr TEXT NOT NULL,
    title_kz TEXT NOT NULL,
    description_tr TEXT,
    description_kz TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    version INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DERSLER (LESSONS)
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    lesson_number INT NOT NULL,
    title_tr TEXT NOT NULL,
    title_kz TEXT NOT NULL,
    summary_tr TEXT,
    summary_kz TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. KELİME VE SÖZLÜK (VOCABULARY)
CREATE TABLE vocabulary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
    kazakh_cyrillic TEXT NOT NULL,
    kazakh_latin TEXT NOT NULL,
    turkish TEXT NOT NULL,
    phonetic_guide TEXT,
    part_of_speech TEXT DEFAULT 'noun',
    category TEXT DEFAULT 'Genel',
    example_kazakh TEXT,
    example_turkish TEXT,
    false_friend_warning TEXT,
    audio_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ÇEVİRİ HATA BİLDİRİMLERİ (TRANSLATION ERROR TICKETS)
CREATE TABLE translation_error_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reported_by_email TEXT NOT NULL,
    reported_by_name TEXT,
    word_or_phrase TEXT NOT NULL,
    current_translation TEXT NOT NULL,
    suggested_correction TEXT NOT NULL,
    explanation TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    admin_note TEXT
);

-- 6. GÜVENLİK DENETİM KAYITLARI (AUDIT LOGS)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    action TEXT NOT NULL,
    module TEXT NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 2. Row Level Security (RLS) Güvenlik Politikaları

Normal kullanıcıların sadece kendi profillerini ve ilerlemelerini okuyup yazabilmesi, ders ve sözlük içeriklerinin sadece Super Admin tarafından düzenlenebilmesi için uygulanan RLS kuralları:

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE translation_error_tickets ENABLE ROW LEVEL SECURITY;

-- 1. Herkes yayınlanmış dersleri ve sözlüğü okuyabilir:
CREATE POLICY "Public Read Units" ON units FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Lessons" ON lessons FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Vocabulary" ON vocabulary FOR SELECT USING (true);

-- 2. Sadece Super Admin içerik ekleyebilir, güncelleyebilir veya silebilir:
CREATE POLICY "Super Admin Full Access on Units" ON units FOR ALL
USING (auth.jwt() ->> 'email' = 'dadasosman2525@gmail.com');

CREATE POLICY "Super Admin Full Access on Vocabulary" ON vocabulary FOR ALL
USING (auth.jwt() ->> 'email' = 'dadasosman2525@gmail.com');

-- 3. Kullanıcılar hata bildirimi oluşturabilir:
CREATE POLICY "Users can insert error tickets" ON translation_error_tickets FOR INSERT
WITH CHECK (true);

CREATE POLICY "Super Admin can review and resolve tickets" ON translation_error_tickets FOR ALL
USING (auth.jwt() ->> 'email' = 'dadasosman2525@gmail.com');
```
