
CREATE TABLE dictionary_entries (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL REFERENCES dictionaries(type) ON DELETE CASCADE ON UPDATE CASCADE,
    code VARCHAR(50) NOT NULL,
    name JSONB NOT NULL,
    UNIQUE (type, code)
);

ALTER TABLE dictionary_entries DISABLE ROW LEVEL SECURITY;

INSERT INTO dictionary_entries (type, code, name) VALUES ('ownership_types', 'title_deed', '{"th": "โฉนด", "en": "Title Deed", "ru": "Право собственности"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('ownership_types', 'ns3k', '{"th": "นส3ก", "en": "NS3K", "ru": "НС3К"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('ownership_types', 'tb5', '{"th": "ทบ5", "en": "TB5", "ru": "ТБ5"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('ownership_types', 'title_deed_ns3', '{"th": "โฉนด, นส3", "en": "Title Deed, NS3", "ru": "Право собственности, НС3"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('transaction_types', 'sale', '{"th": "ขาย", "en": "For Sale", "ru": "На продажу"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('transaction_types', 'rent', '{"th": "เช่า", "en": "For Rent", "ru": "В аренду"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('property_types', 'land', '{"th": "ที่ดิน", "en": "Land", "ru": "Земля"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('property_types', 'pool_villa', '{"th": "Pool Villa", "en": "Pool Villa", "ru": "Вилла с Бассейном"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('property_types', 'land_and_structures', '{"th": "ที่ดินและสิ่งปลูกสร้าง", "en": "Land and Structures", "ru": "Земля и Строения"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('areas', 'sweet_fig', '{"th": "มะเดื่อหวาน", "en": "Sweet Fig", "ru": "Сладкий Фикус"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('areas', 'house_in_garden', '{"th": "บ้านในสวน", "en": "House in Garden", "ru": "Дом в Саду"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('areas', 'tom_nang', '{"th": "ท้องนาง", "en": "Tom Nang", "ru": "Том Нанг"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('areas', 'khao_khao_haeng', '{"th": "เขาข้าวแห้ง", "en": "Khao Khao Haeng", "ru": "Кхао Кхао Хаенг"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('areas', 'ban_tai', '{"th": "บ้านใต้", "en": "Ban Tai", "ru": "Бан Тай"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('areas', 'hat_yai', '{"th": "หาดยาว", "en": "Hat Yai", "ru": "Хат Яй"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('areas', 'hat_yuan', '{"th": "หาดยวน", "en": "Hat Yuan", "ru": "Хат Юан"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('areas', 'thara_set', '{"th": "ธารเสด็จ", "en": "Thara Set", "ru": "Тхара Сет"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('areas', 'hin_kong', '{"th": "หินกอง", "en": "Hin Kong", "ru": "Хин Конг"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('areas', 'cholok_lam', '{"th": "โฉลกหลำ", "en": "Cholok Lam", "ru": "Чолок Лам"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('areas', 'nai_wok_khao_hin_nok', '{"th": "ในวก (เขาหินนก)", "en": "Nai Wok (Khao Hin Nok)", "ru": "Най Вок (Кхао Хин Нок)"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('location_strengths', 'best_friend', '{"th": "เพื่อนที่ดีที่สุด", "en": "Best Friend", "ru": "Лучший Друг"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('location_strengths', 'never_been', '{"th": "ไม่เคยไป", "en": "Never Been", "ru": "Никогда не Был"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('location_strengths', 'opposite_ptt', '{"th": "ตรงข้าม ปตท", "en": "Opposite PTT", "ru": "Напротив PTT"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('location_strengths', 'past_district', '{"th": "เลยอำเภอไป", "en": "Past District", "ru": "За Районом"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('location_strengths', 'waterfall', '{"th": "น้ำตก", "en": "Waterfall", "ru": "Водопад"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('location_strengths', 'mountain_top', '{"th": "ยอดเขา", "en": "Mountain Top", "ru": "Вершина Горы"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('location_strengths', 'sea_view', '{"th": "วิวทะเล", "en": "Sea View", "ru": "Вид на Море"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('location_strengths', 'view_270_degree', '{"th": "วิว 270 องศา", "en": "270 Degree View", "ru": "Вид на 270 Градусов"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('location_strengths', 'beachfront', '{"th": "ติดทะเล", "en": "Beachfront", "ru": "Первая Линия"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('location_strengths', 'thara_pranat_road', '{"th": "ถนนธารประณต", "en": "Thara Pranat Road", "ru": "Дорога Тхара Пранат"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('location_strengths', 'ban_tai', '{"th": "บ้านใต้", "en": "Ban Tai", "ru": "Бан Тай"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('location_strengths', 'ban_khae', '{"th": "บ้านแค", "en": "Ban Khae", "ru": "Бан Кхае"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('location_strengths', 'phi_muay', '{"th": "พี่มวย", "en": "Phi Muay", "ru": "Пхи Муай"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('location_strengths', 'beach', '{"th": "ชายหาด", "en": "Beach", "ru": "Пляж"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('location_strengths', 'rong_lae', '{"th": "โรงแล", "en": "Rong Lae", "ru": "Ронг Лае"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('location_strengths', 'friend_of_phi_muay', '{"th": "เพื่อนพี่มวย", "en": "Friend of Phi Muay", "ru": "Друг Пхи Муай"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('location_strengths', 'thara_nam', '{"th": "ธารน้ำ", "en": "Thara Nam", "ru": "Тхара Нам"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('location_strengths', 'tom_nai_pan', '{"th": "ต้มในพาน", "en": "Tom Nai Pan", "ru": "Том Най Пан"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('location_strengths', 'near_road', '{"th": "ใกล้ถนน", "en": "Near Road", "ru": "Рядом с Дорогой"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('location_strengths', 'divided_for_four_people', '{"th": "แบ่ง 4 คน", "en": "Divided for Four People", "ru": "Разделено на 4 человек"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('highlights', 'water_and_electricity', '{"th": "น้ำและไฟฟ้า", "en": "Water and Electricity", "ru": "Вода и Электричество"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('highlights', 'durian_garden', '{"th": "สวนทุเรียน", "en": "Durian Garden", "ru": "Сад Дуриана"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('highlights', 'ready_to_live', '{"th": "พร้อมอยู่", "en": "Ready to Live", "ru": "Готов к Проживанию"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('highlights', 'will_build_road', '{"th": "จะสร้างถนน", "en": "Will Build Road", "ru": "Будет Построена Дорога"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('highlights', 'wide_frontage', '{"th": "หน้ากว้าง", "en": "Wide Frontage", "ru": "Широкий Фасад"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('highlights', 'beach_frontage', '{"th": "หน้าติดทะเล", "en": "Beach Frontage", "ru": "Выход к Пляжу"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('highlights', 'road_frontage', '{"th": "หน้าติดถนน", "en": "Road Frontage", "ru": "Выход к Дороге"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('highlights', 'beachfront', '{"th": "ติดทะเล", "en": "Beachfront", "ru": "Первая Линия"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('highlights', 'near_road', '{"th": "ใกล้ถนน", "en": "Near Road", "ru": "Рядом с Дорогой"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('highlights', 'near_blue_rama', '{"th": "ใกล้บลูรามา", "en": "Near Blue Rama", "ru": "Рядом с Блю Рама"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('measurement_units', 'rai', '{"th": "ไร่", "en": "Rai", "ru": "Рай"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('measurement_units', 'square_wa', '{"th": "ตรว", "en": "Square Wa", "ru": "Кв. Ва"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('nearby_attractions', 'near_road', '{"th": "ใกล้ถนน", "en": "Near Road", "ru": "Рядом с Дорогой"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('nearby_attractions', 'near_business_road', '{"th": "ใกล้ถนนเส้นธุรกิจ", "en": "Near Business Road", "ru": "Рядом с Деловой Дорогой"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('nearby_attractions', 'beachfront_roadside', '{"th": "ติดทะเล ติดถนน", "en": "Beachfront, Roadside", "ru": "На берегу, У Дороги"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('divisible_sale_types', 'divisible', '{"th": "แบ่ง", "en": "Divisible", "ru": "Делимый"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('divisible_sale_types', 'not_divisible', '{"th": "ไม่แบ่ง", "en": "Not Divisible", "ru": "Не делимый"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('divisible_sale_types', 'large_lot', '{"th": "ล็อตใหญ่", "en": "Large Lot", "ru": "Большой Лот"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('divisible_sale_types', 'small_lot', '{"th": "ล็อตเล็ก", "en": "Small Lot", "ru": "Маленький Лот"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('divisible_sale_types', 'ready_to_occupy', '{"th": "พร้อมอยู่", "en": "Ready to Occupy", "ru": "Готов к Заселению"}');

INSERT INTO dictionary_entries (type, code, name) VALUES ('land_features', 'incomplete_construction', '{"th": "สิ่งปลูกสร้างที่ยังไม่เสร็จ", "en": "Incomplete Construction", "ru": "Незавершенное Строительство"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('land_features', 'two_story_house_274', '{"th": "บ้านสองชั้น พื้นที่ใช้สอย 274 ตรม", "en": "Two-Story House, Usable Area 274 sqm", "ru": "Двухэтажный Дом, Площадь 274 кв.м"}');
INSERT INTO dictionary_entries (type, code, name) VALUES ('land_features', 'beachfront_resort_30', '{"th": "รีสอร์ทติดทะเล 30 หลัง", "en": "Beachfront Resort, 30 Units", "ru": "Резорт на берегу, 30 Единиц"}');
