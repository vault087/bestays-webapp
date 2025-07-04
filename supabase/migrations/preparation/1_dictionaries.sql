-- Create dictionaries table with type as PRIMARY KEY
CREATE TABLE dictionaries (
    type VARCHAR(50) PRIMARY KEY,
    name JSONB NOT NULL
);

ALTER TABLE dictionaries DISABLE ROW LEVEL SECURITY;

-- Create trigger to ensure type immutability
CREATE OR REPLACE FUNCTION prevent_type_update()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.type != NEW.type THEN
        RAISE EXCEPTION 'Cannot update type in dictionaries';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER immutable_type
BEFORE UPDATE ON dictionaries
FOR EACH ROW EXECUTE FUNCTION prevent_type_update();

-- Insert dictionary types for only those present in dictionary_entries
INSERT INTO dictionaries (type, name) VALUES
    ('areas', '{"th": "พื้นที่", "en": "Area", "ru": "Район"}'),
    ('location_strengths', '{"th": "ทำเล/จุดแข็ง", "en": "Location Strength", "ru": "Преимущество Местоположения"}'),
    ('highlights', '{"th": "จุดเด่น", "en": "Highlights", "ru": "Особенности"}'),
    ('transaction_types', '{"th": "ขาย/ให้เช่า", "en": "Sale or Rent Type", "ru": "Тип Продажи или Аренды"}'),
    ('property_types', '{"th": "ประเภทอสังหาริมทรัพย์", "en": "Property Type", "ru": "Тип Недвижимости"}'),
    ('ownership_types', '{"th": "กรรมสิทธิ์", "en": "Ownership Type", "ru": "Тип Владения"}'),
    ('measurement_units', '{"th": "หน่วยวัด", "en": "Measurement Units", "ru": "Единицы Измерения"}'),
    ('divisible_sale_types', '{"th": "แบ่งขาย", "en": "Divisible Sale", "ru": "Делимая Продажа"}'),
    ('nearby_attractions', '{"th": "สิ่งรอบๆที่น่าสนใจ", "en": "Nearby Attractions", "ru": "Близлежащие Достопримечательности"}'),
    ('land_features', '{"th": "บนที่ดินมี", "en": "Land Features", "ru": "Особенности Участка"}');
