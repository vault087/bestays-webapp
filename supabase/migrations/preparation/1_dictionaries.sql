CREATE TABLE dictionaries (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    name JSONB NOT NULL
);

ALTER TABLE dictionaries DISABLE ROW LEVEL SECURITY;

