CREATE TABLE bestays_properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    about JSONB,

    ownership_type INT REFERENCES bestays_dictionary_entries(id) ON DELETE SET NULL ON UPDATE CASCADE,
    property_type INT REFERENCES bestays_dictionary_entries(id) ON DELETE SET NULL ON UPDATE CASCADE,
    area INT REFERENCES bestays_dictionary_entries(id) ON DELETE SET NULL ON UPDATE CASCADE,
    location_strengths INT[],
    highlights INT[],
    size JSONB,

    divisible_sale INT REFERENCES bestays_dictionary_entries(id) ON DELETE SET NULL ON UPDATE CASCADE,
    land_features INT[],
    rooms JSONB,
    nearby_attractions INT[],
    land_and_construction INT[],

    sale_enabled BOOLEAN,
    sale_price BIGINT,
    rent_enabled BOOLEAN,
    rent_price BIGINT,

    images JSONB,
    is_published BOOLEAN DEFAULT FALSE,
    cover_image JSONB,

    personal_title TEXT,
    personal_notes TEXT,
    agent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL ON UPDATE CASCADE,

    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE INDEX idx_properties_sale_enabled ON bestays_properties (sale_enabled);
CREATE INDEX idx_properties_rent_enabled ON bestays_properties (rent_enabled);
CREATE INDEX idx_properties_is_published ON bestays_properties (is_published);
CREATE INDEX idx_properties_area ON bestays_properties (area);

ALTER TABLE bestays_properties DISABLE ROW LEVEL SECURITY;

-- ALTER TABLE bestays_properties ENABLE ROW LEVEL SECURITY;
-- Anyone can read published listings

-- DROP POLICY IF EXISTS "public_read" ON bestays_dictionary_entries;
-- CREATE POLICY "public_read" 
-- ON bestays_dictionary_entries FOR SELECT
-- USING (true);


-- -- USING (is_published = true AND deleted_at IS NULL);

-- -- Authenticated write (no ownership check)
-- DROP POLICY IF EXISTS "authenticated_write" ON bestays_properties;
-- CREATE POLICY "authenticated_write" 
-- ON bestays_properties
-- FOR ALL
-- TO authenticated
-- USING (true);

-- -- Owners can modify their own properties
-- CREATE POLICY "Owner write"
-- ON bestays_properties
-- FOR ALL
-- TO authenticated
-- USING (created_by = auth.uid() OR agent_id = auth.uid())
-- WITH CHECK (created_by = auth.uid() OR agent_id = auth.uid());
