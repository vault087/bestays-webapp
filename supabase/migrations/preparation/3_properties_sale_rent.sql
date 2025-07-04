-- Create properties_sale_rent table
CREATE TABLE properties_sale_rent (
    id SERIAL PRIMARY KEY,
    ownership_type VARCHAR(50),
    property_type VARCHAR(50) ,
    area VARCHAR(50),
    location_strengths VARCHAR(50)[],
    highlights VARCHAR(50)[],
    transaction_types VARCHAR(50)[],
    size JSONB,
    price JSONB,
    divisible_sale VARCHAR(50),
    notes TEXT,
    land_features VARCHAR(50)[],
    room_counts JSONB,
    nearby_attractions VARCHAR(50)[],
    land_and_construction JSONB
);

ALTER TABLE properties_sale_rent DISABLE ROW LEVEL SECURITY;


INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    'title_deed', 'land', 'sweet_fig', ARRAY['best_friend','never_been'], NULL, ARRAY['sale'], '{"value": 1, "unit": "rai"}', '{"rai": 6000000, "currency": "thb"}', 'divisible', 'ของสส', NULL, NULL, NULL, NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    'title_deed', NULL, 'sweet_fig', NULL, NULL, NULL, '{"value": 200, "unit": "square_wa"}', '{}', NULL, NULL, NULL, NULL, NULL, NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    'title_deed', NULL, 'sweet_fig', NULL, NULL, NULL, '{"value": 200, "unit": "square_wa"}', '{}', NULL, NULL, NULL, NULL, NULL, NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    NULL, 'land', 'sweet_fig', ARRAY['opposite_ptt','past_district'], NULL, NULL, '{"value": 1, "unit": "rai"}', '{"rai": 8500000, "currency": "thb"}', NULL, NULL, NULL, NULL, NULL, NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    NULL, NULL, 'house_in_garden', NULL, NULL, NULL, NULL, '{}', NULL, NULL, NULL, NULL, NULL, NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    'title_deed', 'land', 'house_in_garden', NULL, NULL, NULL, '{"value": 6, "unit": "rai"}', '{}', NULL, 'หลักแดง ทางเช้าใกล้มัดย้อม', NULL, NULL, NULL, NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    NULL, NULL, 'house_in_garden', NULL, NULL, NULL, '{"value": 1, "unit": "rai"}', '{"rai": 6000000, "currency": "thb"}', 'large_lot', NULL, NULL, NULL, NULL, NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    NULL, NULL, 'house_in_garden', NULL, NULL, NULL, '{"value": 200, "unit": "square_wa"}', '{"rai": 3500000, "currency": "thb"}', 'small_lot', NULL, NULL, NULL, NULL, NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    'title_deed', 'land', 'tom_nang', ARRAY['waterfall'], ARRAY['water_and_electricity','durian_garden'], ARRAY['sale'], '{"value": 3, "unit": "rai"}', '{"total": 2400000, "currency": "thb"}', 'not_divisible', NULL, NULL, NULL, NULL, NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    'title_deed', NULL, 'khao_khao_haeng', ARRAY['mountain_top'], NULL, ARRAY['sale'], '{"value": 1, "unit": "rai"}', '{"total": 25000000, "currency": "thb"}', 'not_divisible', 'ของสส', ARRAY['incomplete_construction'], NULL, ARRAY['near_road'], '{"th": "ที่ดินและสิ่งปลูกสร้าง", "en": "Land and Construction", "ru": "Земля и Строительство"}'
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    'title_deed', NULL, 'khao_khao_haeng', ARRAY['sea_view'], NULL, ARRAY['sale'], '{"value": 1.5, "unit": "rai"}', '{"total": 6500000, "currency": "thb"}', 'not_divisible', NULL, NULL, NULL, NULL, '{"th": "ที่ดิน", "en": "Land", "ru": "Земля"}'
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    'title_deed', NULL, 'khao_khao_haeng', NULL, NULL, ARRAY['sale'], '{"value": 3, "unit": "rai"}', '{"rai": 4500000, "currency": "thb"}', 'divisible', '{"size": "Inconsistent data: 6.0 square_wa and 3.0 rai specified"}', NULL, NULL, NULL, '{"th": "ที่ดิน", "en": "Land", "ru": "Земля"}'
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    NULL, NULL, 'khao_khao_haeng', NULL, NULL, NULL, NULL, '{}', NULL, NULL, NULL, NULL, NULL, NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    'title_deed', 'pool_villa', 'khao_khao_haeng', ARRAY['view_270_degree'], ARRAY['ready_to_live'], ARRAY['sale'], '{"value": 131, "unit": "square_wa"}', '{"sale": 17000000, "total": 15000000, "currency": "thb"}', 'ready_to_occupy', NULL, ARRAY['two_story_house_274'], '{"living_rooms": 1, "bedrooms": 3, "bathrooms": 3}', NULL, '{"th": "Pool Villa", "en": "Pool Villa", "ru": "Вилла с Бассейном"}'
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    'ns3k', 'land', 'ban_tai', ARRAY['beachfront','thara_pranat_road'], NULL, ARRAY['sale'], '{"value": 25, "unit": "rai"}', '{"rai": 5000000, "currency": "thb"}', NULL, NULL, NULL, NULL, ARRAY['near_road'], NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    'title_deed', 'land', 'ban_tai', ARRAY['ban_tai','ban_khae'], NULL, ARRAY['sale'], '{"value": 8, "unit": "rai"}', '{"rai": 2500000, "currency": "thb"}', NULL, '{"size": "Inconsistent data: 326.0 square_wa and 8.0 rai specified"}', NULL, NULL, NULL, NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    'title_deed', 'land', 'ban_tai', ARRAY['phi_muay','sea_view'], ARRAY['will_build_road'], ARRAY['sale'], '{"value": 13, "unit": "rai"}', '{"total": 256000000, "rai": 8000000, "currency": "thb"}', NULL, '{"size": "Inconsistent data: 6.0 square_wa and 13.0 rai specified"}', NULL, NULL, NULL, NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    'title_deed', NULL, 'hat_yai', ARRAY['sea_view','beachfront','near_road'], NULL, ARRAY['sale'], '{"value": 32, "unit": "rai"}', '{"total": 7500000, "currency": "thb"}', 'not_divisible', NULL, NULL, NULL, NULL, NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    'title_deed', 'land', 'hat_yai', ARRAY['sea_view'], NULL, ARRAY['sale'], '{"value": 1.5, "unit": "rai"}', '{"rai": 4500000, "currency": "thb"}', 'not_divisible', NULL, NULL, NULL, NULL, NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    'title_deed', 'land', 'hat_yai', NULL, NULL, ARRAY['sale'], '{"value": 3, "unit": "rai"}', '{"currency": "thb"}', 'divisible', NULL, NULL, NULL, NULL, NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    NULL, NULL, 'hat_yai', NULL, NULL, NULL, NULL, '{"sale": 17000000, "total": 15000000, "currency": "thb"}', NULL, NULL, NULL, NULL, NULL, NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    'title_deed', 'pool_villa', 'hat_yai', ARRAY['view_270_degree'], ARRAY['ready_to_live'], ARRAY['sale'], NULL, '{"sale": 12000000, "rai": 10000000, "currency": "thb"}', 'ready_to_occupy', NULL, ARRAY['two_story_house_274'], '{"living_rooms": 1, "bedrooms": 3, "bathrooms": 3}', NULL, NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    'title_deed', 'land_and_structures', 'hat_yuan', ARRAY['beachfront','divided_for_four_people'], NULL, ARRAY['sale'], '{"value": 13, "unit": "rai"}', '{"sale": 12000000, "rai": 10000000, "currency": "thb"}', 'not_divisible', NULL, ARRAY['beachfront_resort_30'], NULL, NULL, NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    'title_deed', 'land', 'hat_yuan', ARRAY['phi_muay','sea_view'], ARRAY['beachfront','near_road'], ARRAY['sale'], '{"value": 34, "unit": "rai"}', '{"total": 408000000, "rai": 12000000, "currency": "thb"}', 'not_divisible', NULL, NULL, NULL, ARRAY['beachfront_roadside'], NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    'tb5', 'land', 'thara_set', ARRAY['thara_set'], NULL, ARRAY['sale'], '{"value": 38, "unit": "rai"}', '{"total": 8000000, "currency": "thb"}', 'not_divisible', NULL, NULL, NULL, NULL, NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    'title_deed', 'land', 'thara_set', ARRAY['tom_nai_pan'], NULL, ARRAY['sale'], NULL, '{"sale": 8000000, "total": 6000000, "currency": "thb"}', NULL, NULL, NULL, NULL, NULL, NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    'title_deed', NULL, 'hin_kong', ARRAY['sea_view','rong_lae'], NULL, ARRAY['sale'], '{"value": 1.5, "unit": "rai"}', '{"sale": 8000000, "total": 6000000, "currency": "thb"}', 'not_divisible', NULL, NULL, NULL, NULL, NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    NULL, NULL, 'cholok_lam', ARRAY['friend_of_phi_muay'], NULL, NULL, NULL, '{"total": 85000000, "currency": "thb"}', NULL, NULL, NULL, NULL, NULL, NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    NULL, 'land', 'cholok_lam', ARRAY['sea_view'], ARRAY['wide_frontage','beach_frontage','road_frontage'], ARRAY['sale'], '{"value": 4, "unit": "rai"}', '{"total": 85000000, "currency": "thb"}', NULL, NULL, NULL, NULL, NULL, NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    'title_deed', 'land', 'cholok_lam', ARRAY['sea_view'], NULL, ARRAY['sale'], '{"value": 21, "unit": "rai"}', '{"total": 120000000, "rai": 12000000, "currency": "thb"}', NULL, NULL, NULL, NULL, NULL, NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    'title_deed', 'land', 'cholok_lam', ARRAY['sea_view'], NULL, ARRAY['sale'], '{"value": 10, "unit": "rai"}', '{"rai": 20000000, "currency": "thb"}', 'divisible', NULL, NULL, NULL, NULL, NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    'title_deed', 'land', 'cholok_lam', ARRAY['sea_view'], ARRAY['beachfront','near_road'], ARRAY['sale'], '{"value": 5, "unit": "rai"}', '{"total": 133000000, "rai": 7000000, "currency": "thb"}', 'divisible', NULL, NULL, NULL, NULL, NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    'title_deed', 'land', 'cholok_lam', ARRAY['beach'], ARRAY['beachfront'], NULL, '{"value": 19, "unit": "rai"}', '{"rai": 2500000, "currency": "thb"}', NULL, NULL, NULL, NULL, NULL, NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    'title_deed_ns3', 'land', 'cholok_lam', ARRAY['sea_view','thara_nam'], NULL, NULL, '{"value": 48, "unit": "rai"}', '{"total": 25000000, "currency": "thb"}', NULL, NULL, NULL, NULL, NULL, NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    'title_deed', 'land', 'nai_wok_khao_hin_nok', ARRAY['sea_view'], ARRAY['near_blue_rama'], ARRAY['sale'], '{"value": 1, "unit": "rai"}', '{"total": 9000000, "currency": "thb"}', 'not_divisible', NULL, NULL, NULL, ARRAY['near_business_road'], NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    'ns3k', 'land', 'nai_wok_khao_hin_nok', ARRAY['sea_view'], NULL, ARRAY['sale'], '{"value": 1, "unit": "rai"}', '{"total": 8500000, "currency": "thb"}', 'not_divisible', NULL, NULL, NULL, NULL, NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    'ns3k', 'land', 'nai_wok_khao_hin_nok', ARRAY['sea_view'], NULL, ARRAY['sale'], '{"value": 1, "unit": "rai"}', '{"total": 5800000, "currency": "thb"}', 'not_divisible', NULL, NULL, NULL, NULL, NULL
);
INSERT INTO properties_sale_rent (
    ownership_type, property_type, area, location_strengths, highlights, transaction_types, size, price, divisible_sale, notes, land_features, room_counts, nearby_attractions, land_and_construction
) VALUES (
    'ns3k', 'land', 'nai_wok_khao_hin_nok', ARRAY['sea_view'], NULL, ARRAY['sale'], '{"value": 200, "unit": "square_wa"}', '{"total": 5800000, "currency": "thb"}', 'not_divisible', NULL, NULL, NULL, NULL, NULL
);
