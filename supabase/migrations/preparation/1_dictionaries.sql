CREATE TABLE bestays_dictionaries (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description JSONB,
    metadata JSONB,
    name JSONB,

    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE bestays_dictionaries DISABLE ROW LEVEL SECURITY;

-- ALTER TABLE bestays_dictionaries ENABLE ROW LEVEL SECURITY;

-- DROP POLICY IF EXISTS "public_read" ON bestays_dictionaries;
-- CREATE POLICY "public_read" 
-- ON bestays_dictionaries FOR SELECT
-- USING (true);

-- -- Only authenticated users can insert/update/delete (ownership not checked)
-- DROP POLICY IF EXISTS "authenticated_write" ON bestays_dictionaries;
-- CREATE POLICY "authenticated_write" 
-- ON bestays_dictionaries FOR ALL
-- TO authenticated
-- USING (true);
