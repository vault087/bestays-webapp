-- Create dictionaries table with type as PRIMARY KEY
CREATE TABLE dictionaries (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name JSONB NOT NULL
);

ALTER TABLE dictionaries DISABLE ROW LEVEL SECURITY;
