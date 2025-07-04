-- Create dictionaries table with type as PRIMARY KEY
CREATE TABLE dictionaries (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name JSONB NOT NULL
);

ALTER TABLE dictionaries DISABLE ROW LEVEL SECURITY;

-- Create trigger to ensure type immutability
CREATE OR REPLACE FUNCTION prevent_code_update()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.code != NEW.code THEN
        RAISE EXCEPTION 'Cannot update type in dictionaries';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER immutable_code
BEFORE UPDATE ON dictionaries
FOR EACH ROW EXECUTE FUNCTION prevent_code_update();

