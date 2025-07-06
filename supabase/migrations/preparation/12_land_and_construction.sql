INSERT INTO "public"."dictionaries" ("id", "code", "name", "description") VALUES ('11', 'land_and_construction', '{"en":"Land and Construction","ru":"Земля и Строительство","th":"ดินและการสร้าง"}', 'Land and construction features of the property. Useful for filtering and grouping listings by land and construction features.');


INSERT INTO "public"."dictionary_entries" ("id", "code", "name", "dictionary_id") VALUES
 ('64', 'l.land', '{"en": "Land", "ru": "Земля", "th": "ที่ดิน"}', '11'),
 ('65', 'land_and_construction', '{"en": "Land and Construction", "ru": "Земля и Строительство", "th": "ที่ดินและสิ่งปลูกสร้าง"}', '11'),
 ('66', 'l.pool_villa', '{"en": "Pool Villa", "ru": "Вилла с Бассейном", "th": "Pool Villa"}', '11');

 