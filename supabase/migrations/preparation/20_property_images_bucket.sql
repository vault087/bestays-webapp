CREATE POLICY "Allow authenticated users to upload to my_private_bucket"
ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'property-images');