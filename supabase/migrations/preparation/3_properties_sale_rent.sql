DROP TABLE IF EXISTS properties_sale_rent;

CREATE TABLE properties_sale_rent (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    about JSONB,
    ownership_type VARCHAR(50) REFERENCES dictionary_entries(code) ON DELETE SET NULL ON UPDATE CASCADE,
    property_type VARCHAR(50) REFERENCES dictionary_entries(code) ON DELETE SET NULL ON UPDATE CASCADE,
    area VARCHAR(50) REFERENCES dictionary_entries(code) ON DELETE SET NULL ON UPDATE CASCADE,
    location_strengths VARCHAR(50)[],
    highlights VARCHAR(50)[],
    transaction_types VARCHAR(50)[],
    size JSONB,
    price JSONB,
    divisible_sale VARCHAR(50) REFERENCES dictionary_entries(code) ON DELETE SET NULL ON UPDATE CASCADE,
    land_features VARCHAR(50)[],
    room_counts JSONB,
    nearby_attractions VARCHAR(50)[],
    land_and_construction VARCHAR(50)[],
    is_draft BOOLEAN DEFAULT TRUE,

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
