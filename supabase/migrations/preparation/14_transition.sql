-- First, let's create the new table structure (assuming it matches the original)
CREATE TABLE IF NOT EXISTS properties_sale_rent_2 (
    id SERIAL PRIMARY KEY,
    ownership_type INTEGER,
    property_type INTEGER,
    area INTEGER,
    location_strengths INTEGER[], -- Array of IDs
    highlights INTEGER[], -- Array of IDs
    transaction_types INTEGER[], -- Array of IDs
    size JSONB,
    price JSONB,
    divisible_sale VARCHAR(50),
    agent_notes JSONB,
    land_features INTEGER[], -- Array of IDs
    rooms JSONB,
    nearby_attractions INTEGER[], -- Array of IDs
    land_and_construction INTEGER[] -- Array of IDs
);

-- Insert data from properties_sale_rent to properties_sale_rent_2
-- Converting text codes to IDs using lookup tables
INSERT INTO properties_sale_rent_2 (
    ownership_type,
    property_type, 
    area,
    location_strengths,
    highlights,
    transaction_types,
    size,
    price,
    divisible_sale,
    agent_notes,
    land_features,
    rooms,
    nearby_attractions,
    land_and_construction
)
SELECT 
    -- Convert ownership_type text to ID
    (SELECT id FROM ownership_types WHERE code = psr.ownership_type),
    
    -- Convert property_type text to ID
    (SELECT id FROM property_types WHERE code = psr.property_type),
    
    -- Convert area text to ID
    (SELECT id FROM areas WHERE code = psr.area),
    
    -- Convert location_strengths array of texts to array of IDs
    CASE 
        WHEN psr.location_strengths IS NOT NULL THEN
            (SELECT ARRAY(
                SELECT ls.id 
                FROM location_strengths ls 
                WHERE ls.code = ANY(psr.location_strengths)
            ))
        ELSE NULL
    END,
    
    -- Convert highlights array of texts to array of IDs
    CASE 
        WHEN psr.highlights IS NOT NULL THEN
            (SELECT ARRAY(
                SELECT h.id 
                FROM highlights h 
                WHERE h.code = ANY(psr.highlights)
            ))
        ELSE NULL
    END,
    
    -- Convert transaction_types array of texts to array of IDs
    CASE 
        WHEN psr.transaction_types IS NOT NULL THEN
            (SELECT ARRAY(
                SELECT tt.id 
                FROM transaction_types tt 
                WHERE tt.code = ANY(psr.transaction_types)
            ))
        ELSE NULL
    END,
    
    -- Keep size as is (already JSONB)
    psr.size,
    
    -- Keep price as is (already JSONB)
    psr.price,
    
    -- Keep divisible_sale as is
    psr.divisible_sale,
    
    -- Keep agent_notes as is (already JSONB)
    psr.agent_notes,
    
    -- Convert land_features array of texts to array of IDs
    CASE 
        WHEN psr.land_features IS NOT NULL THEN
            (SELECT ARRAY(
                SELECT lf.id 
                FROM land_features lf 
                WHERE lf.code = ANY(psr.land_features)
            ))
        ELSE NULL
    END,
    
    -- Keep rooms as is (already JSONB)
    psr.rooms,
    
    -- Convert nearby_attractions array of texts to array of IDs
    CASE 
        WHEN psr.nearby_attractions IS NOT NULL THEN
            (SELECT ARRAY(
                SELECT na.id 
                FROM nearby_attractions na 
                WHERE na.code = ANY(psr.nearby_attractions)
            ))
        ELSE NULL
    END,
    
    -- Convert land_and_construction array of texts to array of IDs
    CASE 
        WHEN psr.land_and_construction IS NOT NULL THEN
            (SELECT ARRAY(
                SELECT lac.id 
                FROM land_and_construction lac 
                WHERE lac.code = ANY(psr.land_and_construction)
            ))
        ELSE NULL
    END

FROM properties_sale_rent psr;

-- Optional: Verify the data transfer
SELECT 
    COUNT(*) as total_records,
    COUNT(ownership_type) as records_with_ownership_type,
    COUNT(property_type) as records_with_property_type,
    COUNT(area) as records_with_area
FROM properties_sale_rent_2;

-- Optional: Check for any unmapped codes (records that couldn't be converted)
SELECT 
    'ownership_type' as field_type,
    psr.ownership_type as unmapped_code
FROM properties_sale_rent psr
LEFT JOIN ownership_types ot ON ot.code = psr.ownership_type
WHERE psr.ownership_type IS NOT NULL AND ot.id IS NULL

UNION ALL

SELECT 
    'property_type' as field_type,
    psr.property_type as unmapped_code
FROM properties_sale_rent psr
LEFT JOIN property_types pt ON pt.code = psr.property_type
WHERE psr.property_type IS NOT NULL AND pt.id IS NULL

UNION ALL

SELECT 
    'area' as field_type,
    psr.area as unmapped_code
FROM properties_sale_rent psr
LEFT JOIN areas a ON a.code = psr.area
WHERE psr.area IS NOT NULL AND a.id IS NULL;

-- Optional: Sample query to verify the converted data
SELECT 
    psr2.id,
    ot.name as ownership_type_name,
    pt.name as property_type_name,
    a.name as area_name,
    psr2.size,
    psr2.price
FROM properties_sale_rent_2 psr2
LEFT JOIN ownership_types ot ON ot.id = psr2.ownership_type
LEFT JOIN property_types pt ON pt.id = psr2.property_type
LEFT JOIN areas a ON a.id = psr2.area
LIMIT 10;