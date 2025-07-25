-- Generated: 2025-07-25T14:49:29.569Z

-- 1_dictionaries.sql
DROP TABLE IF EXISTS properties_sale_rent;
DROP TABLE IF EXISTS dictionary_entries;
DROP TABLE IF EXISTS dictionaries;
CREATE TABLE dictionaries (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description JSONB,
    metadata JSONB,
    name JSONB,

    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE dictionaries DISABLE ROW LEVEL SECURITY;



-- 2_dictionary_entry.sql
DROP TABLE IF EXISTS dictionary_entries;
CREATE TABLE dictionary_entries (
    id SERIAL PRIMARY KEY,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    dictionary_id INTEGER NOT NULL REFERENCES dictionaries(id) ON DELETE CASCADE ON UPDATE CASCADE,
    name JSONB,

    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE dictionary_entries DISABLE ROW LEVEL SECURITY;


-- 3_properties_sale_rent.sql
DROP TABLE IF EXISTS properties_sale_rent;
CREATE TABLE properties_sale_rent (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    about JSONB,

    ownership_type INT REFERENCES dictionary_entries(id) ON DELETE SET NULL ON UPDATE CASCADE,
    property_type INT REFERENCES dictionary_entries(id) ON DELETE SET NULL ON UPDATE CASCADE,
    area INT REFERENCES dictionary_entries(id) ON DELETE SET NULL ON UPDATE CASCADE,
    location_strengths INT[],
    highlights INT[],
    size JSONB,

    divisible_sale INT REFERENCES dictionary_entries(id) ON DELETE SET NULL ON UPDATE CASCADE,
    land_features INT[],
    rooms JSONB,
    nearby_attractions INT[],
    land_and_construction INT[],

    sale_enabled BOOLEAN,
    sale_price BIGINT,
    rent_enabled BOOLEAN,
    rent_price BIGINT,

    images JSONB,
    is_published BOOLEAN DEFAULT FALSE,
    cover_image JSONB,

    personal_title TEXT,
    personal_notes TEXT,
    agent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL ON UPDATE CASCADE,

    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

ALTER TABLE properties_sale_rent DISABLE ROW LEVEL SECURITY;

CREATE INDEX idx_properties_sale_rent_sale_enabled ON properties_sale_rent (sale_enabled);
CREATE INDEX idx_properties_sale_rent_rent_enabled ON properties_sale_rent (rent_enabled);
CREATE INDEX idx_properties_sale_rent_is_published ON properties_sale_rent (is_published);
CREATE INDEX idx_properties_sale_rent_created_at ON properties_sale_rent (created_at);
CREATE INDEX idx_properties_sale_rent_updated_at ON properties_sale_rent (updated_at);
CREATE INDEX idx_properties_sale_rent_deleted_at ON properties_sale_rent (deleted_at);

-- 10_dictionaries_rows.sql
INSERT INTO "public"."dictionaries" 
("id", "code", "name", "metadata", "description") 
VALUES 
('1', 'areas', '{"en":"Location Area","ru":"Район местоположения","th":"พื้นที่ทำเล"}', '{"info": "Defines the administrative or commonly known zones where the property is located, aiding geographical search and regional grouping"}', '{"en": "The geographical area where the property is located", "ru": "Географический район, где находится недвижимость", "th": "พื้นที่ทางภูมิศาสตร์ที่อสังหาริมทรัพย์ตั้งอยู่"}'),
('2', 'location_strengths', '{"en":"Location Strength","ru":"Преимущество Местоположения","th":"จุดเด่นของทำเล"}', '{"info": "Evaluates the macro-level desirability of a location based on geography, infrastructure, or prestige"}', '{"en": "The desirability factor of the property’s location", "ru": "Привлекательность местоположения недвижимости", "th": "จุดเด่นของทำเลที่ตั้งของอสังหาริมทรัพย์"}'),
('3', 'highlights', '{"en":"Highlight","ru":"Особенность","th":"จุดเด่น"}', '{"info": "Highlights unique selling points or notable features like design, amenities, or views"}', '{"en": "A unique feature of the property", "ru": "Уникальная особенность недвижимости", "th": "จุดเด่นของอสังหาริมทรัพย์"}'),
('5', 'property_types', '{"en":"Property Type","ru":"Тип Недвижимости","th":"ประเภทอสังหาริมทรัพย์"}', '{"info": "Classifies the general type of real estate such as villa, condo, or land"}', '{"en": "The type of property such as villa, condo, or land", "ru": "Тип недвижимости, например, вилла, кондоминиум или земля", "th": "ประเภทของอสังหาริมทรัพย์ เช่น พูลวิลล่า คอนโด หรือที่ดิน"}'),
('6', 'ownership_types', '{"en":"Ownership Type","ru":"Тип Владения","th":"ประเภทกรรมสิทธิ์"}', '{"info": "Specifies the legal form of ownership such as freehold or leasehold"}', '{"en": "The legal ownership type such as freehold or leasehold", "ru": "Юридический тип владения, например, полное право или аренда", "th": "ประเภทกรรมสิทธิ์ทางกฎหมาย เช่น โฉนด หรือสัญญาเช่า"}'),
('7', 'measurement_units', '{"en":"Measurement Unit","ru":"Единица Измерения","th":"หน่วยวัด"}', '{"info": "Defines standard units for property size such as square meters or rai"}', '{"en": "The unit of measurement for the property size", "ru": "Единица измерения размера недвижимости", "th": "หน่วยวัดขนาดของอสังหาริมทรัพย์"}'),
('8', 'divisible_sale_types', '{"en":"Divisible Sale","ru":"Делимая Продажа","th":"การแบ่งขาย"}', '{"info": "Indicates if the property can be subdivided and sold in parts"}', '{"en": "Whether the property can be divided and sold in parts", "ru": "Возможность разделения недвижимости и продажи частями", "th": "การที่อสังหาริมทรัพย์สามารถแบ่งและขายเป็นส่วนๆ ได้"}'),
('9', 'nearby_attractions', '{"en":"Nearby Attraction","ru":"Близлежащая Достопримечательность","th":"สถานที่ท่องเที่ยวใกล้เคียง"}', '{"info": "Lists nearby landmarks or amenities such as schools or beaches"}', '{"en": "Nearby attractions such as schools or beaches", "ru": "Близлежащие достопримечательности, такие как школы или пляжи", "th": "สถานที่ท่องเที่ยวใกล้เคียง เช่น โรงเรียนหรือชายหาด"}'),
('10', 'land_features', '{"en":"Land Feature","ru":"Особенность Участка","th":"ลักษณะของที่ดิน"}', '{"info": "Describes land characteristics like elevation or access roads"}', '{"en": "The land’s features such as elevation or road access", "ru": "Особенности участка, такие как высота или доступ по дороге", "th": "ลักษณะของที่ดิน เช่น ความสูงหรือการเข้าถึงทางถนน"}'),
('11', 'land_and_construction', '{"en":"Land and Construction","ru":"Земля и Строительство","th":"ที่ดินและการก่อสร้าง"}', '{"info": "Details land and construction features for filtering and grouping listings"}', '{"en": "The land and any construction features", "ru": "Детали земли и любых строительных элементов", "th": "รายละเอียดที่ดินและการก่อสร้าง"}');

-- 11_dictionary_entries_rows.sql
INSERT INTO "public"."dictionary_entries" ("id", "is_active", "dictionary_id", "name", "created_by", "created_at", "updated_at") VALUES ('1', 'true', '6', '{"ru":"Право собственности","th":"โฉนด"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('2', 'true', '6', '{"en":"NS3K","ru":"НС3К","th":"นส3ก"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('3', 'true', '6', '{"en":"TB5","ru":"ТБ5","th":"ทบ5"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('4', 'true', '6', '{"en":"Title Deed, NS3","ru":"Право собственности, НС3","th":"โฉนด, นส3"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('7', 'true', '5', '{"en":"Land","ru":"Земля","th":"ที่ดิน"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('8', 'true', '5', '{"en":"Pool Villa","ru":"Вилла с Бассейном","th":"พูลวิลล่า"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('9', 'true', '5', '{"en":"Land and Structures","ru":"Земля и Строения","th":"ที่ดินและสิ่งปลูกสร้าง"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('10', 'true', '1', '{"en":"Sweet Fig","ru":"Сладкий Фикус","th":"มะเดื่อหวาน"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('11', 'true', '1', '{"en":"House in Garden","ru":"Дом в Саду","th":"บ้านในสวน"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('12', 'true', '1', '{"en":"Tom Nang","ru":"Том Нанг","th":"ท้องนาง"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('13', 'true', '1', '{"en":"Khao Khao Haeng","ru":"Кхао Кхао Хаенг","th":"เขาข้าวแห้ง"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('14', 'true', '1', '{"en":"Ban Tai","ru":"Бан Тай","th":"บ้านใต้"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('15', 'true', '1', '{"en":"Hat Yai","ru":"Хат Яй","th":"หาดยาว"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('16', 'true', '1', '{"en":"Hat Yuan","ru":"Хат Юан","th":"หาดยวน"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('17', 'true', '1', '{"en":"Thara Set","ru":"Тхара Сет","th":"ธารเสด็จ"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('18', 'true', '1', '{"en":"Hin Kong","ru":"Хин Конг","th":"หินกอง"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('19', 'true', '1', '{"en":"Cholok Lam","ru":"Чолок Лам","th":"โฉลกหลำ"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('20', 'true', '1', '{"en":"Nai Wok (Khao Hin Nok)","ru":"Най Вок (Кхао Хин Нок)","th":"ในวก (เขาหินนก)"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('21', 'true', '2', '{"en":"Best Friend","ru":"Лучший Друг","th":"เพื่อนที่ดีที่สุด"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('22', 'true', '2', '{"en":"Never Been","ru":"Никогда не Был","th":"ไม่เคยไป"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('23', 'true', '2', '{"en":"Opposite PTT","ru":"Напротив PTT","th":"ตรงข้าม ปตท"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('24', 'true', '2', '{"en":"Past District","ru":"За Районом","th":"เลยอำเภอไป"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('25', 'true', '2', '{"en":"Waterfall","ru":"Водопад","th":"น้ำตก"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('26', 'true', '2', '{"en":"Mountain Top","ru":"Вершина Горы","th":"ยอดเขา"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('27', 'true', '2', '{"en":"Sea View","ru":"Вид на Море","th":"วิวทะเล"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('28', 'true', '2', '{"en":"270 Degree View","ru":"Вид на 270 Градусов","th":"วิว 270 องศา"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('29', 'true', '2', '{"en":"Beachfront","ru":"Первая Линия","th":"ติดทะเล"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('30', 'true', '2', '{"en":"Thara Pranat Road","ru":"Дорога Тхара Пранат","th":"ถนนธารประณต"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('31', 'true', '2', '{"en":"Ban Tai","ru":"Бан Тай","th":"บ้านใต้"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('32', 'true', '2', '{"en":"Ban Khae","ru":"Бан Кхае","th":"บ้านแค"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('33', 'true', '2', '{"en":"Phi Muay","ru":"Пхи Муай","th":"พี่มวย"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('34', 'true', '2', '{"en":"Beach","ru":"Пляж","th":"ชายหาด"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('35', 'true', '2', '{"en":"Rong Lae","ru":"Ронг Лае","th":"โรงแล"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('36', 'true', '2', '{"en":"Friend of Phi Muay","ru":"Друг Пхи Муай","th":"เพื่อนพี่มวย"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('37', 'true', '2', '{"en":"Thara Nam","ru":"Тхара Нам","th":"ธารน้ำ"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('38', 'true', '2', '{"en":"Tom Nai Pan","ru":"Том Най Пан","th":"ต้มในพาน"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('39', 'true', '2', '{"en":"Near Road","ru":"Рядом с Дорогой","th":"ใกล้ถนน"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('40', 'true', '2', '{"en":"Divided for Four People","ru":"Разделено на 4 человек","th":"แบ่ง 4 คน"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('41', 'true', '3', '{"en":"Water and Electricity","ru":"Вода и Электричество","th":"น้ำและไฟฟ้า"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('42', 'true', '3', '{"en":"Durian Garden","ru":"Сад Дуриана","th":"สวนทุเรียน"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('43', 'true', '3', '{"en":"Ready to Live","ru":"Готов к Проживанию","th":"พร้อมอยู่"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('44', 'true', '3', '{"en":"Will Build Road","ru":"Будет Построена Дорога","th":"จะสร้างถนน"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('45', 'true', '3', '{"en":"Wide Frontage","ru":"Широкий Фасад","th":"หน้ากว้าง"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('46', 'true', '3', '{"en":"Beach Frontage","ru":"Выход к Пляжу","th":"หน้าติดทะเล"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('47', 'true', '3', '{"en":"Road Frontage","ru":"Выход к Дороге","th":"หน้าติดถนน"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('48', 'true', '3', '{"en":"Beachfront","ru":"Первая Линия","th":"ติดทะเล"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('49', 'true', '3', '{"en":"Near Road","ru":"Рядом с Дорогой","th":"ใกล้ถนน"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('50', 'true', '3', '{"en":"Near Blue Rama","ru":"Рядом с Блю Рама","th":"ใกล้บลูรามา"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('51', 'true', '7', '{"en":"Rai","ru":"Рай","th":"ไร่"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('52', 'true', '7', '{"en":"Square Wa","ru":"Кв. Ва","th":"ตรว"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('53', 'true', '9', '{"en":"Near Road","ru":"Рядом с Дорогой","th":"ใกล้ถนน"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('54', 'true', '9', '{"en":"Near Business Road","ru":"Рядом с Деловой Дорогой","th":"ใกล้ถนนเส้นธุรกิจ"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('55', 'true', '9', '{"en":"Beachfront, Roadside","ru":"На берегу, У Дороги","th":"ติดทะเล ติดถนน"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('56', 'true', '8', '{"en":"Divisible","ru":"Делимый","th":"แบ่ง"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('57', 'true', '8', '{"en":"Not Divisible","ru":"Не делимый","th":"ไม่แบ่ง"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('58', 'true', '8', '{"en":"Large Lot","ru":"Большой Лот","th":"ล็อตใหญ่"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('59', 'true', '8', '{"en":"Small Lot","ru":"Маленький Лот","th":"ล็อตเล็ก"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('60', 'true', '8', '{"en":"Ready to Occupy","ru":"Готов к Заселению","th":"พร้อมอยู่"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('61', 'true', '10', '{"en":"Incomplete Construction","ru":"Незавершенное Строительство","th":"สิ่งปลูกสร้างที่ยังไม่เสร็จ"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('62', 'true', '10', '{"en":"Two-Story House, Usable Area 274 sqm","ru":"Двухэтажный Дом, Площадь 274 кв.м","th":"บ้านสองชั้น พื้นที่ใช้สอย 274 ตรม"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('63', 'true', '10', '{"en":"Beachfront Resort, 30 Units","ru":"Резорт на берегу, 30 Единиц","th":"รีสอร์ทติดทะเล 30 หลัง"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('64', 'true', '11', '{"en":"Land","ru":"Земля","th":"ที่ดิน"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('65', 'true', '11', '{"en":"Land and Construction","ru":"Земля и Строительство","th":"ที่ดินและสิ่งปลูกสร้าง"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00'), ('66', 'true', '11', '{"en":"Pool Villa","ru":"Вилла с Бассейном","th":"พูลวิลล่า"}', null, '2025-07-11 19:16:13.084404+00', '2025-07-11 19:16:13.084404+00');

-- 13_properties_sale_rent_rows.sql
INSERT INTO "public"."properties_sale_rent" ("id", "about", "ownership_type", "property_type", "area", "location_strengths", "highlights", "size", "divisible_sale", "land_features", "rooms", "nearby_attractions", "land_and_construction", "sale_enabled", "sale_price", "rent_enabled", "rent_price", "images", "is_published", "personal_notes", "agent_id", "created_by", "created_at", "updated_at", "deleted_at") VALUES ('0fec984b-2c3b-4653-a0ac-e408ee2ba358', null, '1', '7', '15', ARRAY[27], null, '{"total":{"unit":51,"value":1.5}}', '57', null, null, null, null, 'true', null, 'false', null, null, 'false', 'Price rai: 4500000
', null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('296d2801-fb54-47bb-bb51-e45ca3f5f065', null, '1', '7', '19', ARRAY[34], ARRAY[48], '{"total":{"unit":51,"value":19}}', null, null, null, null, null, 'false', null, 'true', null, null, 'false', 'Price rai: 2500000
', null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('34396f8b-e264-486d-bece-c6c3aa551a0a', null, '1', null, '15', ARRAY[27,29,39], null, '{"total":{"unit":51,"value":32}}', '57', null, null, null, null, 'true', null, 'false', null, null, 'false', 'Price total: 7500000
', null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('369e5b35-1586-481c-bfa3-90818bfe1e7d', null, '1', '7', '19', ARRAY[27], ARRAY[48,49], '{"total":{"unit":51,"value":5}}', '56', null, null, null, null, 'true', null, 'false', null, null, 'false', 'Price rai: 7000000
Price total: 133000000
', null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('3c8c2af9-1586-4fe7-9bff-894e25a0ab5d', null, '1', '7', '10', ARRAY[21,22], null, '{"total":{"unit":51,"value":1}}', '56', null, null, null, null, 'true', null, 'false', null, null, 'false', 'ของสส
Price rai: 6000000
', null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('40ef5dd2-8477-4db3-a4e8-507af6fada34', null, '2', '7', '20', ARRAY[27], null, '{"total":{"unit":51,"value":1}}', '57', null, null, null, null, 'true', null, 'false', null, null, 'false', 'Price total: 8500000
', null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('4ae4c02f-cd43-4447-8749-4a66239a220e', null, '1', null, '13', null, null, '{"total":{"unit":51,"value":3}}', '56', null, null, null, ARRAY[64], 'true', null, 'false', null, null, 'false', '{"size": "Inconsistent data: 6.0 square_wa and 3.0 rai specified"}
Price rai: 4500000
', null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('5ac160c5-7c20-4eaa-848a-79b165139480', null, '3', '7', '17', null, null, '{"total":{"unit":51,"value":38}}', '57', null, null, null, null, 'true', null, 'false', null, null, 'false', 'Price total: 8000000
', null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('61c8a8c0-13d2-4cb1-9b80-5ed30107c1a9', null, '1', '8', '15', ARRAY[28], ARRAY[43], null, '60', ARRAY[62], '{"bedrooms":3,"bathrooms":3,"living_rooms":1}', null, null, 'true', null, 'false', null, null, 'false', 'Price rai: 10000000
Price sale: 12000000
', null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('67cb1885-3bde-407a-99cb-88f622431dc6', null, null, null, '15', null, null, null, null, null, null, null, null, 'false', null, 'true', null, null, 'false', 'Price total: 15000000
Price sale: 17000000
', null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('720ccce4-238d-4619-a09d-22b236aa37dc', null, '2', '7', '20', ARRAY[27], null, '{"total":{"unit":51,"value":1}}', '57', null, null, null, null, 'true', null, 'false', null, null, 'false', 'Price total: 5800000
', null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('7342932e-f845-4701-b55e-4cd5e8e224b0', null, '2', '7', '14', ARRAY[29,30], null, '{"total":{"unit":51,"value":25}}', null, null, null, ARRAY[53], null, 'true', null, 'false', null, null, 'false', 'Price rai: 5000000
', null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('7d0a2930-72ff-40c1-b3d4-0367d50997b0', null, '1', '7', '19', ARRAY[27], null, '{"total":{"unit":51,"value":21}}', null, null, null, null, null, 'true', null, 'false', null, null, 'false', 'Price rai: 12000000
Price total: 120000000
', null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('85a190aa-f2a3-4846-af99-8953eca7a45b', null, '1', '9', '16', ARRAY[29,40], null, '{"total":{"unit":51,"value":13}}', '57', ARRAY[63], null, null, null, 'true', null, 'false', null, null, 'false', 'Price rai: 10000000
Price sale: 12000000
', null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('95de89ae-a3ed-4a47-abd1-bf7a909a6779', null, '1', '7', '15', null, null, '{"total":{"unit":51,"value":3}}', '56', null, null, null, null, 'true', null, 'false', null, null, 'false', '', null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('99080d09-d444-4ffb-8e78-32fb66fdf9b5', null, '1', null, '18', ARRAY[27,35], null, '{"total":{"unit":51,"value":1.5}}', '57', null, null, null, null, 'true', null, 'false', null, null, 'false', 'Price total: 6000000
Price sale: 8000000
', null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('9bc04238-7aee-418a-bfc6-93aeb171f848', null, null, null, '19', ARRAY[36], null, null, null, null, null, null, null, 'false', null, 'true', null, null, 'false', 'Price total: 85000000
', null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('a2a68537-479b-4b9a-9c45-04b1c483aedb', null, null, null, '11', null, null, null, null, null, null, null, null, 'false', null, 'true', null, null, 'false', null, null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('a3273844-bcb9-418f-8510-3a646c8135cb', null, null, '7', '19', ARRAY[27], ARRAY[45,46,47], '{"total":{"unit":51,"value":4}}', null, null, null, null, null, 'true', null, 'false', null, null, 'false', 'Price total: 85000000
', null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('ace1f74b-1281-4ec3-a893-7a2cb0474bdc', null, '1', null, '10', null, null, '{"total":{"unit":52,"value":200}}', null, null, null, null, null, 'false', null, 'true', null, null, 'false', null, null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('ba836a72-a5f5-448c-9947-76a27b1b7929', null, '1', '7', '16', ARRAY[27,33], ARRAY[48,49], '{"total":{"unit":51,"value":34}}', '57', null, null, ARRAY[55], null, 'true', null, 'false', null, null, 'false', 'Price rai: 12000000
Price total: 408000000
', null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('be5a33d1-694f-4a43-9540-bb975534a521', null, null, null, '13', null, null, null, null, null, null, null, null, 'false', null, 'true', null, null, 'false', null, null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('bf7dc2f8-418c-418d-b908-3d122faf7b3a', null, '1', '7', '20', ARRAY[27], ARRAY[50], '{"total":{"unit":51,"value":1}}', '57', null, null, ARRAY[54], null, 'true', null, 'false', null, null, 'false', 'Price total: 9000000
', null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('c5105832-31b2-41a1-a466-ef5c14dc0638', null, '2', '7', '20', ARRAY[27], null, '{"total":{"unit":52,"value":200}}', '57', null, null, null, null, 'true', null, 'false', null, null, 'false', 'Price total: 5800000
', null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('c5778de0-02d0-48f9-95ad-29cc92cf7642', null, '1', '8', '13', ARRAY[28], ARRAY[43], '{"total":{"unit":52,"value":131}}', '60', ARRAY[62], '{"bedrooms":3,"bathrooms":3,"living_rooms":1}', null, ARRAY[66], 'true', null, 'false', null, null, 'false', 'Price total: 15000000
Price sale: 17000000
', null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('c72ec756-7d93-45d7-8067-a7bc37ab9685', null, '1', '7', '19', ARRAY[27], null, '{"total":{"unit":51,"value":10}}', '56', null, null, null, null, 'true', null, 'false', null, null, 'false', 'Price rai: 20000000
', null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('d1655b31-7a20-42e9-b9ed-406c407e3574', null, '1', '7', '14', ARRAY[31,32], null, '{"total":{"unit":51,"value":8}}', null, null, null, null, null, 'true', null, 'false', null, null, 'false', '{"size": "Inconsistent data: 326.0 square_wa and 8.0 rai specified"}
Price rai: 2500000
', null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('d339bf32-408d-42b7-96b9-a2727301b7ec', null, '1', null, '13', ARRAY[27], null, '{"total":{"unit":51,"value":1.5}}', '57', null, null, null, ARRAY[64], 'true', null, 'false', null, null, 'false', 'Price total: 6500000
', null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('ea8807f1-173e-4a55-9bdc-21bea2f9ebb4', null, '1', '7', '11', null, null, '{"total":{"unit":51,"value":6}}', null, null, null, null, null, 'false', null, 'true', null, null, 'false', 'หลักแดง ทางเช้าใกล้มัดย้อม', null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('eefe962b-d148-480b-bf64-9993553ba3f4', null, '1', null, '10', null, null, '{"total":{"unit":52,"value":200}}', null, null, null, null, null, 'false', null, 'true', null, null, 'false', null, null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('f17371fd-24b0-412e-9df1-ab472f7285ae', null, '4', '7', '19', ARRAY[27,37], null, '{"total":{"unit":51,"value":48}}', null, null, null, null, null, 'false', null, 'true', null, null, 'false', 'Price total: 25000000
', null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('f3c5a630-260d-46a8-aac2-599277e9eaf5', null, '1', '7', '17', ARRAY[38], null, null, null, null, null, null, null, 'true', null, 'false', null, null, 'false', 'Price total: 6000000
Price sale: 8000000
', null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('fcfde56e-6611-4476-8b09-e4f6e0816e55', null, null, '7', '10', ARRAY[23,24], null, '{"total":{"unit":51,"value":1}}', null, null, null, null, null, 'false', null, 'true', null, null, 'false', 'Price rai: 8500000
', null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null), ('ff0d881f-31e9-4525-bb18-0ab4cdcdcade', null, '1', '7', '14', ARRAY[27,33], ARRAY[44], '{"total":{"unit":51,"value":13}}', null, null, null, null, null, 'true', null, 'false', null, null, 'false', '{"size": "Inconsistent data: 6.0 square_wa and 13.0 rai specified"}
Price rai: 8000000
Price total: 256000000
', null, null, '2025-07-16 13:45:03.278664+00', '2025-07-16 13:45:03.278664+00', null);

-- 20_property_images_bucket.sql
CREATE POLICY "Allow authenticated users to upload to my_private_bucket"
ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'property-images');

-- Add policy to allow reading files (required for signed URLs)
CREATE POLICY "Allow public read access to property images"
ON storage.objects FOR SELECT TO public USING (bucket_id = 'property-images');

-- 21_rpc_cursor_auto.sql
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
$$ LANGUAGE plpgsql;

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
$$ LANGUAGE plpgsql;

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
$$ LANGUAGE plpgsql;

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
$$ LANGUAGE plpgsql;

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
$$ LANGUAGE plpgsql;

