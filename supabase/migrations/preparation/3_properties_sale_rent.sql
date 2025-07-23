DROP TABLE IF EXISTS properties_sale_rent;
CREATE TABLE properties_sale_rent (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    about JSONB,
    ownership_type INT REFERENCES dictionary_entries(id) ON DELETE SET NULL ON UPDATE CASCADE,
    property_type INT REFERENCES dictionary_entries(id) ON DELETE SET NULL ON UPDATE CASCADE,
    area INT REFERENCES dictionary_entries(id) ON DELETE SET NULL ON UPDATE CASCADE,
    location_strengths INT[],
    highlights INT[],
    size JSONB,

    divisible_sale INT REFERENCES dictionary_entries(id) ON DELETE SET NULL ON UPDATE CASCADE,
    land_features INT[],
    rooms JSONB,
    nearby_attractions INT[],
    land_and_construction INT[],
    is_draft BOOLEAN DEFAULT TRUE,

    sale_enabled BOOLEAN,
    sale_price BIGINT,
    rent_enabled BOOLEAN,
    rent_price BIGINT,

    images JSONB,
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    weight INTEGER DEFAULT 0,

    agent_notes TEXT,
    agent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL ON UPDATE CASCADE,

    preview JSONB, -- short information for listings
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

ALTER TABLE properties_sale_rent DISABLE ROW LEVEL SECURITY;

CREATE INDEX idx_properties_sale_rent_sale_enabled ON properties_sale_rent (sale_enabled);
CREATE INDEX idx_properties_sale_rent_rent_enabled ON properties_sale_rent (rent_enabled);
CREATE INDEX idx_properties_sale_rent_is_draft ON properties_sale_rent (is_draft);
CREATE INDEX idx_properties_sale_rent_is_published ON properties_sale_rent (is_published);
CREATE INDEX idx_properties_sale_rent_is_featured ON properties_sale_rent (is_featured);
CREATE INDEX idx_properties_sale_rent_weight ON properties_sale_rent (weight);
CREATE INDEX idx_properties_sale_rent_created_at ON properties_sale_rent (created_at);
CREATE INDEX idx_properties_sale_rent_updated_at ON properties_sale_rent (updated_at);
CREATE INDEX idx_properties_sale_rent_deleted_at ON properties_sale_rent (deleted_at);