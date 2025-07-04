CREATE TABLE properties_sale_rent (
    id SERIAL PRIMARY KEY,
    ownership_type VARCHAR(50),
    property_type VARCHAR(50) ,
    area VARCHAR(50) REFERENCES dictionary_entries(code) ON DELETE SET NULL ON UPDATE CASCADE,
    location_strengths VARCHAR(50)[],
    highlights VARCHAR(50)[],
    transaction_types VARCHAR(50)[],
    size JSONB,
    price JSONB,
    divisible_sale VARCHAR(50) REFERENCES dictionary_entries(code) ON DELETE SET NULL ON UPDATE CASCADE,
    notes TEXT,
    land_features VARCHAR(50)[],
    room_counts JSONB,
    nearby_attractions VARCHAR(50)[],
    land_and_construction JSONB
);

ALTER TABLE properties_sale_rent DISABLE ROW LEVEL SECURITY;
