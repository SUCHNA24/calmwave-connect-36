-- Create the avatars bucket for profile pictures
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars', 
  'avatars', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Create RLS policies for the avatars bucket

-- Policy for uploading avatars (users can upload to their own folder)
CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for updating avatars (users can only update their own files)
CREATE POLICY "Users can update their own avatar" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for deleting avatars (users can only delete their own files)
CREATE POLICY "Users can delete their own avatar" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for reading avatars (public read access)
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Alternative simpler policies if the above don't work
-- Uncomment these and comment out the above if you still get RLS errors:

-- DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
-- DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
-- DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
-- DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;

-- CREATE POLICY "Enable upload for authenticated users" ON storage.objects
-- FOR INSERT WITH CHECK (
--   bucket_id = 'avatars' AND
--   auth.role() = 'authenticated'
-- );

-- CREATE POLICY "Enable update for authenticated users" ON storage.objects
-- FOR UPDATE USING (
--   bucket_id = 'avatars' AND
--   auth.role() = 'authenticated'
-- );

-- CREATE POLICY "Enable delete for authenticated users" ON storage.objects
-- FOR DELETE USING (
--   bucket_id = 'avatars' AND
--   auth.role() = 'authenticated'
-- );

-- CREATE POLICY "Enable read for all users" ON storage.objects
-- FOR SELECT USING (bucket_id = 'avatars');

-- Add profile_picture_url column to profiles table if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_profile_picture_url ON profiles(profile_picture_url);
