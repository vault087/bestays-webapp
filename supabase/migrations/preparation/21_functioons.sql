-- First, create a reusable function that updates the updated_at column
DROP FUNCTION IF EXISTS refresh_updated_at_column();
CREATE OR REPLACE FUNCTION refresh_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for your properties table
DROP TRIGGER IF EXISTS update_properties_updated_at ON bestays_properties;
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON bestays_properties
    FOR EACH ROW
    EXECUTE FUNCTION refresh_updated_at_column();

-- Create trigger for your dictionary entries table
DROP TRIGGER IF EXISTS update_dictionaries_updated_at ON bestays_dictionaries;
CREATE TRIGGER update_dictionaries_updated_at
    BEFORE UPDATE ON bestays_dictionaries
    FOR EACH ROW
    EXECUTE FUNCTION refresh_updated_at_column();

-- Create trigger for your dictionary entries table
DROP TRIGGER IF EXISTS update_dictionary_entries_updated_at ON bestays_dictionary_entries;
CREATE TRIGGER update_dictionary_entries_updated_at
    BEFORE UPDATE ON bestays_dictionary_entries
    FOR EACH ROW
    EXECUTE FUNCTION refresh_updated_at_column();
