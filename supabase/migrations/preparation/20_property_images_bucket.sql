CREATE POLICY "Allow authenticated users to upload to my_private_bucket"
ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'bestays-property-images');

-- Add policy to allow reading files (required for signed URLs)
CREATE POLICY "Allow public read access to property images"
ON storage.objects FOR SELECT TO public USING (bucket_id = 'bestays-property-images');