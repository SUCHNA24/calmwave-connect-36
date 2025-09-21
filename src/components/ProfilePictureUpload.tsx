import React, { useState } from 'react';
import { Camera, Upload, X, User } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '../integrations/supabase/client';

interface ProfilePictureUploadProps {
  currentImageUrl?: string;
  onImageUpdate: (url: string) => void;
  userId: string;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentImageUrl,
  onImageUpdate,
  userId
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        
        // Handle specific RLS policy errors
        if (uploadError.message.includes('row-level security policy') || 
            uploadError.message.includes('RLS policy')) {
          setError('Permission denied. Please run the RLS fix script in Supabase SQL Editor.');
        } else if (uploadError.message.includes('not found') || 
                   uploadError.message.includes('does not exist')) {
          setError('Storage not configured. Please set up the avatars bucket in Supabase.');
        } else {
          setError('Upload failed: ' + uploadError.message);
        }
        return;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      onImageUpdate(data.publicUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!currentImageUrl) return;

    try {
      // Extract file path from URL
      const urlParts = currentImageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `profile-pictures/${fileName}`;

      // Delete from storage
      const { error } = await supabase.storage
        .from('avatars')
        .remove([filePath]);

      if (error) {
        console.warn('Could not remove image from storage:', error);
        // Still update the UI even if storage removal fails
      }

      onImageUpdate('');
    } catch (err: any) {
      console.warn('Error removing image:', err);
      // Still update the UI even if there's an error
      onImageUpdate('');
    }
  };

  return (
    <div className="relative">
      <div className="relative w-24 h-24 mx-auto">
        {currentImageUrl ? (
          <img 
            src={currentImageUrl} 
            alt="Profile" 
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
          />
        ) : (
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
            <User className="w-12 h-12 text-primary" />
          </div>
        )}
        
        <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors cursor-pointer">
          <Camera className="w-4 h-4" />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {error && (
        <div className="mt-2 text-xs text-red-500 text-center">
          {error}
          {(error.includes('Storage not configured') || error.includes('Permission denied')) && (
            <div className="mt-1 text-xs text-muted-foreground">
              <a 
                href="/fix_storage_rls.sql" 
                target="_blank" 
                className="text-blue-500 hover:underline"
              >
                Run this fix script in Supabase
              </a>
            </div>
          )}
        </div>
      )}

      {currentImageUrl && (
        <div className="mt-2 flex justify-center space-x-2">
          <Button
            onClick={handleRemoveImage}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <X className="w-3 h-3 mr-1" />
            Remove
          </Button>
        </div>
      )}

      {uploading && (
        <div className="mt-2 text-xs text-muted-foreground text-center">
          Uploading...
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUpload;
