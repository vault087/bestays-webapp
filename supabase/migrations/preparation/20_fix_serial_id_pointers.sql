SELECT setval('bestays_dictionaries_id_seq', (SELECT MAX(id) FROM bestays_dictionaries));
SELECT setval('bestays_dictionary_entries_id_seq', (SELECT MAX(id) FROM bestays_dictionary_entries));
