
CREATE TABLE dictionary_entries (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL REFERENCES dictionaries(type) ON DELETE CASCADE ON UPDATE CASCADE,
    code VARCHAR(50) NOT NULL,
    name JSONB NOT NULL,
    UNIQUE (type, code)
);

ALTER TABLE dictionary_entries DISABLE ROW LEVEL SECURITY;
