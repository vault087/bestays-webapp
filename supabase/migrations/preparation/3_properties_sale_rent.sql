DROP TABLE IF EXISTS properties_sale_rent;
CREATE TABLE properties_sale_rent (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    about JSONB,
    ownership_type INT REFERENCES dictionary_entries(id) ON DELETE SET NULL ON UPDATE CASCADE,
    property_type INT REFERENCES dictionary_entries(id) ON DELETE SET NULL ON UPDATE CASCADE,
    area INT REFERENCES dictionary_entries(id) ON DELETE SET NULL ON UPDATE CASCADE,
    location_strengths INT[],
    highlights INT[],
    transaction_types INT[],
    size JSONB,
    price JSONB,
    divisible_sale INT REFERENCES dictionary_entries(id) ON DELETE SET NULL ON UPDATE CASCADE,
    land_features INT[],
    rooms JSONB,
    nearby_attractions INT[],
    land_and_construction INT[],
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

