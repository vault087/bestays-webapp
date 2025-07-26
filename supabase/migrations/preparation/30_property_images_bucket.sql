DROP POLICY IF EXISTS "public_write" ON storage.objects;
CREATE POLICY "public_write"
ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'bestays-property-images');

-- Add policy to allow reading files (required for signed URLs)
DROP POLICY IF EXISTS "public_read" ON storage.objects;
CREATE POLICY "public_read"
ON storage.objects FOR SELECT TO public USING (bucket_id = 'bestays-property-images');