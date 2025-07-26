CREATE TABLE bestays_dictionary_entries (
    id SERIAL PRIMARY KEY,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    dictionary_id INTEGER NOT NULL REFERENCES bestays_dictionaries(id) ON DELETE CASCADE ON UPDATE CASCADE,
    name JSONB,

    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE bestays_dictionary_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read" ON bestays_dictionary_entries;
CREATE POLICY "public_read" 
ON bestays_dictionary_entries FOR SELECT
USING (true);

-- Only authenticated users can insert/update/delete (ownership not checked)
DROP POLICY IF EXISTS "authenticated_write" ON bestays_dictionary_entries;
CREATE POLICY "authenticated_write" 
ON bestays_dictionary_entries FOR ALL
TO authenticated
USING (true);
