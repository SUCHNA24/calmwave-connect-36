-- Quick fix for storage RLS policy issue
-- Run this in Supabase SQL Editor to fix the profile picture upload

-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;

-- Create simpler, more permissive policies
CREATE POLICY "Enable upload for authenticated users" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Enable update for authenticated users" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Enable delete for authenticated users" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Enable read for all users" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Verify the bucket exists and is public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'avatars';

-- Add profile_picture_url column if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;
