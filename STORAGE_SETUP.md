# Supabase Storage Setup for Profile Pictures

## Step 1: Create Storage Bucket

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Sign in and select your project

2. **Navigate to Storage**
   - Go to "Storage" in the left sidebar
   - Click "New bucket"

3. **Create Avatar Bucket**
   - **Name**: `avatars`
   - **Public**: ✅ Check this (so profile pictures can be accessed publicly)
   - **File size limit**: 5MB (or your preference)
   - **Allowed MIME types**: `image/*` (or specific types like `image/jpeg,image/png,image/webp`)

4. **Click "Create bucket"**

## Step 2: Configure RLS Policies

1. **Go to Storage Policies**
   - In the Storage section, click on your `avatars` bucket
   - Go to "Policies" tab

2. **Create Upload Policy**
   ```sql
   CREATE POLICY "Users can upload their own avatar" ON storage.objects
   FOR INSERT WITH CHECK (
     bucket_id = 'avatars' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

3. **Create Update Policy**
   ```sql
   CREATE POLICY "Users can update their own avatar" ON storage.objects
   FOR UPDATE USING (
     bucket_id = 'avatars' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

4. **Create Delete Policy**
   ```sql
   CREATE POLICY "Users can delete their own avatar" ON storage.objects
   FOR DELETE USING (
     bucket_id = 'avatars' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

5. **Create Select Policy (Public Read)**
   ```sql
   CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
   FOR SELECT USING (bucket_id = 'avatars');
   ```

## Step 3: Test the Setup

1. **Go to your app**: http://localhost:8080/profile
2. **Sign in** to your account
3. **Click the camera icon** on your profile picture
4. **Upload an image** - it should work now!

## Alternative: Quick Setup via SQL

If you prefer, you can run this SQL in the Supabase SQL Editor:

```sql
-- Create the avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Create RLS policies
CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');
```

## Troubleshooting

### Common Issues:

1. **"Bucket not found"**
   - Make sure you created the `avatars` bucket
   - Check the bucket name is exactly `avatars`

2. **"Permission denied"**
   - Check that RLS policies are created
   - Make sure the user is authenticated

3. **"File too large"**
   - Check the file size limit in bucket settings
   - The app limits to 5MB by default

4. **"Invalid file type"**
   - Check the allowed MIME types in bucket settings
   - Make sure `image/*` is allowed

## Current Status

✅ **Profile picture upload component** - Ready  
✅ **Error handling** - Implemented  
✅ **File validation** - Working  
❌ **Storage bucket** - Needs to be created  
❌ **RLS policies** - Need to be configured  

Once you complete the storage setup, profile picture uploads will work perfectly!
