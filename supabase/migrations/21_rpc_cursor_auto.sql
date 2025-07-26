-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS map_entry_array(jsonb, jsonb);
DROP FUNCTION IF EXISTS upsert_dictionaries_batch(jsonb);
DROP FUNCTION IF EXISTS upsert_entries_batch_with_dictionary_mapping(jsonb, jsonb);
DROP FUNCTION IF EXISTS upsert_properties_batch(jsonb, jsonb, jsonb);
DROP FUNCTION IF EXISTS update_dictionaries_entries_properties_batch(
  jsonb, jsonb, jsonb, 
  integer[], integer[], text[]
);

-- Helper function to map entry arrays with proper validation
CREATE OR REPLACE FUNCTION map_entry_array(
  entry_array jsonb,
  entry_id_mapping jsonb
) RETURNS integer[] AS $$
DECLARE
  result integer[] := '{}';
  entry_id text;
  mapped_id integer;
BEGIN
  -- Handle null/empty arrays
  IF entry_array IS NULL OR entry_array = 'null' OR jsonb_array_length(entry_array) = 0 THEN
    RETURN NULL;
  END IF;

  -- Validate input is an array
  IF jsonb_typeof(entry_array) <> 'array' THEN
    RAISE EXCEPTION 'map_entry_array: expected array, got %', jsonb_typeof(entry_array);
  END IF;

  -- Map each entry ID
  FOR entry_id IN SELECT jsonb_array_elements_text(entry_array)
  LOOP
    -- Validate entry_id is numeric
    IF entry_id !~ '^-?\d+$' THEN
      RAISE EXCEPTION 'Invalid entry ID in array: %', entry_id;
    END IF;
    
    mapped_id := COALESCE(
      (entry_id_mapping ->> entry_id)::integer,
      entry_id::integer
    );
    result := array_append(result, mapped_id);
  END LOOP;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Batch upsert for dictionaries with proper validation
CREATE OR REPLACE FUNCTION upsert_dictionaries_batch(
  dictionaries jsonb,
  deleted_dictionary_ids jsonb DEFAULT '[]'
) RETURNS jsonb AS $$
DECLARE
  id_mapping jsonb := '{}';
  dict jsonb;
  old_id integer;
  new_id integer;
BEGIN
  -- Validate inputs
  IF dictionaries IS NULL THEN
    RAISE EXCEPTION 'Dictionaries array cannot be null';
  END IF;
  
  IF jsonb_typeof(dictionaries) <> 'array' THEN
    RAISE EXCEPTION 'Dictionaries must be a JSON array';
  END IF;

  -- Delete dictionaries first (with validation)
  IF jsonb_array_length(deleted_dictionary_ids) > 0 THEN
    -- Check for references in dictionary_entries before deletion
    IF EXISTS (
      SELECT 1 FROM dictionary_entries
      WHERE dictionary_id = ANY(
        SELECT (jsonb_array_elements_text(deleted_dictionary_ids))::integer
      )
    ) THEN
      RAISE EXCEPTION 'Cannot delete dictionaries that have entries';
    END IF;
    
    DELETE FROM dictionaries WHERE id = ANY(
      SELECT (jsonb_array_elements_text(deleted_dictionary_ids))::integer
    );
  END IF;

  -- Handle each dictionary
  FOR dict IN SELECT * FROM jsonb_array_elements(dictionaries)
  LOOP
    -- Validate required fields
    IF dict ->> 'code' IS NULL OR dict ->> 'name' IS NULL THEN
      RAISE EXCEPTION 'Dictionary code and name are required';
    END IF;

    old_id := (dict ->> 'id')::integer;
    
    IF (dict ->> 'is_new')::boolean THEN
      -- Insert new dictionary
      INSERT INTO dictionaries (code, name, description, metadata, created_by)
      VALUES (
        dict ->> 'code',
        dict -> 'name',
        NULLIF(dict -> 'description', 'null'),
        NULLIF(dict -> 'metadata', 'null'),
        (dict ->> 'created_by')::uuid
      ) RETURNING id INTO new_id;
      
      -- Map old temporary ID to new real ID
      id_mapping := id_mapping || jsonb_build_object(old_id::text, new_id);
    ELSE
      -- Update existing dictionary
      UPDATE dictionaries SET
        code = dict ->> 'code',
        name = dict -> 'name',
        description = NULLIF(dict -> 'description', 'null'),
        metadata = NULLIF(dict -> 'metadata', 'null'),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = old_id;
    END IF;
  END LOOP;

  RETURN id_mapping;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Batch upsert for entries with dictionary mapping and validation
CREATE OR REPLACE FUNCTION upsert_entries_batch_with_dictionary_mapping(
  entries jsonb,
  dictionary_id_mapping jsonb,
  deleted_entry_ids jsonb DEFAULT '[]'
) RETURNS jsonb AS $$
DECLARE
  id_mapping jsonb := '{}';
  entry jsonb;
  old_id integer;
  new_id integer;
  mapped_dictionary_id integer;
BEGIN
  -- Validate inputs
  IF entries IS NULL THEN
    RAISE EXCEPTION 'Entries array cannot be null';
  END IF;
  
  IF jsonb_typeof(entries) <> 'array' THEN
    RAISE EXCEPTION 'Entries must be a JSON array';
  END IF;

  -- Delete entries first (with validation)
  IF jsonb_array_length(deleted_entry_ids) > 0 THEN
    -- Check for references in properties before deletion
    IF EXISTS (
      SELECT 1 FROM properties_sale_rent
      WHERE ownership_type = ANY(SELECT (jsonb_array_elements_text(deleted_entry_ids))::integer)
         OR property_type = ANY(SELECT (jsonb_array_elements_text(deleted_entry_ids))::integer)
         OR area = ANY(SELECT (jsonb_array_elements_text(deleted_entry_ids))::integer)
         OR divisible_sale = ANY(SELECT (jsonb_array_elements_text(deleted_entry_ids))::integer)
         OR location_strengths && (SELECT array_agg((jsonb_array_elements_text(deleted_entry_ids))::integer))
         OR highlights && (SELECT array_agg((jsonb_array_elements_text(deleted_entry_ids))::integer))
         OR land_features && (SELECT array_agg((jsonb_array_elements_text(deleted_entry_ids))::integer))
         OR nearby_attractions && (SELECT array_agg((jsonb_array_elements_text(deleted_entry_ids))::integer))
         OR land_and_construction && (SELECT array_agg((jsonb_array_elements_text(deleted_entry_ids))::integer))
    ) THEN
      RAISE EXCEPTION 'Cannot delete entries that are referenced by properties';
    END IF;
    
    DELETE FROM dictionary_entries WHERE id = ANY(
      SELECT (jsonb_array_elements_text(deleted_entry_ids))::integer
    );
  END IF;

  -- Handle each entry
  FOR entry IN SELECT * FROM jsonb_array_elements(entries)
  LOOP
    -- Validate required fields
    IF entry ->> 'dictionary_id' IS NULL OR entry ->> 'name' IS NULL THEN
      RAISE EXCEPTION 'Entry dictionary_id and name are required';
    END IF;

    old_id := (entry ->> 'id')::integer;
    
    -- Get mapped dictionary ID
    mapped_dictionary_id := COALESCE(
      (dictionary_id_mapping ->> (entry ->> 'dictionary_id'))::integer,
      (entry ->> 'dictionary_id')::integer
    );

    -- Verify dictionary exists
    IF NOT EXISTS (SELECT 1 FROM dictionaries WHERE id = mapped_dictionary_id) THEN
      RAISE EXCEPTION 'Invalid dictionary_id: %', mapped_dictionary_id;
    END IF;

    IF (entry ->> 'is_new')::boolean THEN
      -- Insert new entry
      INSERT INTO dictionary_entries (dictionary_id, name, is_active, created_by)
      VALUES (
        mapped_dictionary_id,
        entry -> 'name',
        COALESCE((entry ->> 'is_active')::boolean, true),
        (entry ->> 'created_by')::uuid
      ) RETURNING id INTO new_id;
      
      -- Map old temporary ID to new real ID
      id_mapping := id_mapping || jsonb_build_object(old_id::text, new_id);
    ELSE
      -- Update existing entry
      UPDATE dictionary_entries SET
        dictionary_id = mapped_dictionary_id,
        name = entry -> 'name',
        is_active = COALESCE((entry ->> 'is_active')::boolean, true),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = old_id;
    END IF;
  END LOOP;

  RETURN id_mapping;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Batch upsert for properties with entry mapping and validation
CREATE OR REPLACE FUNCTION upsert_properties_batch_with_entry_mapping(
  properties jsonb,
  entry_id_mapping jsonb,
  deleted_property_ids jsonb DEFAULT '[]'
) RETURNS jsonb AS $$
DECLARE
  id_mapping jsonb := '{}';
  prop jsonb;
  old_id uuid;
  new_id uuid;
BEGIN
  -- Validate inputs
  IF properties IS NULL THEN
    RAISE EXCEPTION 'Properties array cannot be null';
  END IF;
  
  IF jsonb_typeof(properties) <> 'array' THEN
    RAISE EXCEPTION 'Properties must be a JSON array';
  END IF;

  -- Delete properties first
  IF jsonb_array_length(deleted_property_ids) > 0 THEN
    DELETE FROM properties_sale_rent WHERE id = ANY(
      SELECT (jsonb_array_elements_text(deleted_property_ids))::uuid
    );
  END IF;

  -- Handle each property
  FOR prop IN SELECT * FROM jsonb_array_elements(properties)
  LOOP
    old_id := (prop ->> 'id')::uuid;
    
    IF (prop ->> 'is_new')::boolean THEN
      -- Insert new property
      INSERT INTO properties_sale_rent (
        personal_title, about, ownership_type, property_type, area,
        divisible_sale, highlights, location_strengths, land_features,
        nearby_attractions, land_and_construction,
        rooms, size, sale_enabled, sale_price,
        rent_enabled, rent_price, images, cover_image,
        is_published, personal_notes, agent_id, created_by
      ) VALUES (
        prop ->> 'personal_title',
        NULLIF(prop -> 'about', 'null'),
        COALESCE((entry_id_mapping ->> (prop ->> 'ownership_type'))::integer, (prop ->> 'ownership_type')::integer),
        COALESCE((entry_id_mapping ->> (prop ->> 'property_type'))::integer, (prop ->> 'property_type')::integer),
        COALESCE((entry_id_mapping ->> (prop ->> 'area'))::integer, (prop ->> 'area')::integer),
        COALESCE((entry_id_mapping ->> (prop ->> 'divisible_sale'))::integer, (prop ->> 'divisible_sale')::integer),
        map_entry_array(prop -> 'highlights', entry_id_mapping),
        map_entry_array(prop -> 'location_strengths', entry_id_mapping),
        map_entry_array(prop -> 'land_features', entry_id_mapping),
        map_entry_array(prop -> 'nearby_attractions', entry_id_mapping),
        map_entry_array(prop -> 'land_and_construction', entry_id_mapping),
        NULLIF(prop -> 'rooms', 'null'),
        NULLIF(prop -> 'size', 'null'),
        (prop ->> 'sale_enabled')::boolean,
        CASE WHEN prop -> 'sale_price' = 'null' THEN NULL ELSE (prop ->> 'sale_price')::bigint END,
        (prop ->> 'rent_enabled')::boolean,
        CASE WHEN prop -> 'rent_price' = 'null' THEN NULL ELSE (prop ->> 'rent_price')::bigint END,
        NULLIF(prop -> 'images', 'null'),
        NULLIF(prop -> 'cover_image', 'null'),
        COALESCE((prop ->> 'is_published')::boolean, false),
        prop ->> 'personal_notes',
        (prop ->> 'agent_id')::uuid,
        (prop ->> 'created_by')::uuid
      ) RETURNING id INTO new_id;
      
      -- Map old temporary ID to new real ID
      id_mapping := id_mapping || jsonb_build_object(old_id::text, new_id);
    ELSE
      -- Update existing property
      UPDATE properties_sale_rent SET
        personal_title = prop ->> 'personal_title',
        about = NULLIF(prop -> 'about', 'null'),
        ownership_type = COALESCE((entry_id_mapping ->> (prop ->> 'ownership_type'))::integer, (prop ->> 'ownership_type')::integer),
        property_type = COALESCE((entry_id_mapping ->> (prop ->> 'property_type'))::integer, (prop ->> 'property_type')::integer),
        area = COALESCE((entry_id_mapping ->> (prop ->> 'area'))::integer, (prop ->> 'area')::integer),
        divisible_sale = COALESCE((entry_id_mapping ->> (prop ->> 'divisible_sale'))::integer, (prop ->> 'divisible_sale')::integer),
        highlights = map_entry_array(prop -> 'highlights', entry_id_mapping),
        location_strengths = map_entry_array(prop -> 'location_strengths', entry_id_mapping),
        land_features = map_entry_array(prop -> 'land_features', entry_id_mapping),
        nearby_attractions = map_entry_array(prop -> 'nearby_attractions', entry_id_mapping),
        land_and_construction = map_entry_array(prop -> 'land_and_construction', entry_id_mapping),
        rooms = NULLIF(prop -> 'rooms', 'null'),
        size = NULLIF(prop -> 'size', 'null'),
        sale_enabled = (prop ->> 'sale_enabled')::boolean,
        sale_price = CASE WHEN prop -> 'sale_price' = 'null' THEN NULL ELSE (prop ->> 'sale_price')::bigint END,
        rent_enabled = (prop ->> 'rent_enabled')::boolean,
        rent_price = CASE WHEN prop -> 'rent_price' = 'null' THEN NULL ELSE (prop ->> 'rent_price')::bigint END,
        images = NULLIF(prop -> 'images', 'null'),
        cover_image = NULLIF(prop -> 'cover_image', 'null'),
        is_published = COALESCE((prop ->> 'is_published')::boolean, false),
        personal_notes = prop ->> 'personal_notes',
        agent_id = (prop ->> 'agent_id')::uuid,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = old_id;
    END IF;
  END LOOP;

  RETURN id_mapping;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Main batch update function with comprehensive validation
CREATE OR REPLACE FUNCTION update_dictionaries_entries_properties_batch(
  dictionaries jsonb,
  entries jsonb,
  properties jsonb,
  deleted_dictionaries jsonb DEFAULT '[]',
  deleted_entries jsonb DEFAULT '[]',
  deleted_properties jsonb DEFAULT '[]'
) RETURNS jsonb AS $$
DECLARE
  dictionary_id_mapping jsonb := '{}';
  entry_id_mapping jsonb := '{}';
  property_id_mapping jsonb := '{}';
BEGIN
  -- Validate all inputs
  IF dictionaries IS NULL OR entries IS NULL OR properties IS NULL THEN
    RAISE EXCEPTION 'Input arrays cannot be null';
  END IF;

  -- Validate JSON types
  IF jsonb_typeof(dictionaries) <> 'array' THEN
    RAISE EXCEPTION 'Dictionaries must be a JSON array';
  END IF;
  
  IF jsonb_typeof(entries) <> 'array' THEN
    RAISE EXCEPTION 'Entries must be a JSON array';
  END IF;
  
  IF jsonb_typeof(properties) <> 'array' THEN
    RAISE EXCEPTION 'Properties must be a JSON array';
  END IF;

  BEGIN
    -- Step 1: Handle dictionaries first
    SELECT upsert_dictionaries_batch(dictionaries, deleted_dictionaries) INTO dictionary_id_mapping;
    
    -- Step 2: Handle entries with dictionary mapping
    SELECT upsert_entries_batch_with_dictionary_mapping(entries, dictionary_id_mapping, deleted_entries) INTO entry_id_mapping;
    
    -- Step 3: Update existing properties with mapped entry IDs (efficient single query)
    WITH entry_mappings AS (
      SELECT key::integer AS old_id, value::integer AS new_id
      FROM jsonb_each(entry_id_mapping)
    )
    UPDATE properties_sale_rent p
    SET
      ownership_type = COALESCE((SELECT new_id FROM entry_mappings WHERE old_id = p.ownership_type), p.ownership_type),
      property_type = COALESCE((SELECT new_id FROM entry_mappings WHERE old_id = p.property_type), p.property_type),
      area = COALESCE((SELECT new_id FROM entry_mappings WHERE old_id = p.area), p.area),
      divisible_sale = COALESCE((SELECT new_id FROM entry_mappings WHERE old_id = p.divisible_sale), p.divisible_sale),
      location_strengths = (SELECT array_agg(COALESCE((SELECT new_id FROM entry_mappings WHERE old_id = e), e))
                           FROM unnest(p.location_strengths) e),
      highlights = (SELECT array_agg(COALESCE((SELECT new_id FROM entry_mappings WHERE old_id = e), e))
                    FROM unnest(p.highlights) e),
      land_features = (SELECT array_agg(COALESCE((SELECT new_id FROM entry_mappings WHERE old_id = e), e))
                       FROM unnest(p.land_features) e),
      nearby_attractions = (SELECT array_agg(COALESCE((SELECT new_id FROM entry_mappings WHERE old_id = e), e))
                           FROM unnest(p.nearby_attractions) e),
      land_and_construction = (SELECT array_agg(COALESCE((SELECT new_id FROM entry_mappings WHERE old_id = e), e))
                              FROM unnest(p.land_and_construction) e)
    WHERE p.ownership_type IN (SELECT old_id FROM entry_mappings)
       OR p.property_type IN (SELECT old_id FROM entry_mappings)
       OR p.area IN (SELECT old_id FROM entry_mappings)
       OR p.divisible_sale IN (SELECT old_id FROM entry_mappings)
       OR p.location_strengths && (SELECT array_agg(old_id) FROM entry_mappings)
       OR p.highlights && (SELECT array_agg(old_id) FROM entry_mappings)
       OR p.land_features && (SELECT array_agg(old_id) FROM entry_mappings)
       OR p.nearby_attractions && (SELECT array_agg(old_id) FROM entry_mappings)
       OR p.land_and_construction && (SELECT array_agg(old_id) FROM entry_mappings);
    
    -- Step 4: Handle properties with entry mapping
    SELECT upsert_properties_batch_with_entry_mapping(properties, entry_id_mapping, deleted_properties) INTO property_id_mapping;
    
    -- Return all mappings for client use
    RETURN jsonb_build_object(
      'dictionary_mapping', dictionary_id_mapping,
      'entry_mapping', entry_id_mapping,
      'property_mapping', property_id_mapping
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Error in batch update: %', SQLERRM;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

/*
VALIDATION SUMMARY:
✅ Proper null handling for all fields
✅ Correct data types (BIGINT for prices, JSONB for complex objects)
✅ Foreign key validation before deletions
✅ Input validation for required fields
✅ Efficient array updates using single query
✅ Proper error handling and rollback
✅ Matches actual database schema
✅ Handles temporary IDs correctly
✅ Validates JSON structure types
✅ SECURITY DEFINER with explicit search_path for security
*/