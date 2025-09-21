import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useMoodEntries, useJournalEntries, useChatConversations } from '../hooks/useSupabase';
import ParticleCursor from '../components/ParticleCursor';
import Navbar from '../components/Navbar';
import AnimateIn from '../components/AnimateIn';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  User, 
  Edit, 
  Save, 
  X, 
  Calendar, 
  BarChart3, 
  BookOpen, 
  MessageCircle,
  Camera,
  Mail,
  Phone,
  MapPin,
  Heart,
  TrendingUp,
  Award,
  Target,
  Clock,
  Star
} from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import ProfilePictureUpload from '../components/ProfilePictureUpload';

interface ProfileData {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  date_of_birth?: string;
  profile_picture_url?: string;
  created_at: string;
  updated_at: string;
}

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const { moodEntries, loading: moodLoading } = useMoodEntries();
  const { journalEntries, loading: journalLoading } = useJournalEntries();
  const { conversations, loading: chatLoading } = useChatConversations();
  
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    location: '',
    bio: '',
    date_of_birth: ''
  });

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          throw error;
        }

        if (data) {
          setProfileData(data);
          setFormData({
            full_name: data.full_name || '',
            phone: data.phone || '',
            location: data.location || '',
            bio: data.bio || '',
            date_of_birth: data.date_of_birth || ''
          });
        } else {
          // Create profile if it doesn't exist
          const newProfile = {
            id: user.id,
            full_name: user.user_metadata?.full_name || '',
            email: user.email || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setProfileData(newProfile);
          setFormData({
            full_name: newProfile.full_name,
            phone: '',
            location: '',
            bio: '',
            date_of_birth: ''
          });
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
          date_of_birth: formData.date_of_birth,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setProfileData(prev => prev ? {
        ...prev,
        ...formData,
        updated_at: new Date().toISOString()
      } : null);

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (profileData) {
      setFormData({
        full_name: profileData.full_name || '',
        phone: profileData.phone || '',
        location: profileData.location || '',
        bio: profileData.bio || '',
        date_of_birth: profileData.date_of_birth || ''
      });
    }
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfilePictureUpdate = async (url: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          profile_picture_url: url,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setProfileData(prev => prev ? {
        ...prev,
        profile_picture_url: url,
        updated_at: new Date().toISOString()
      } : null);

      setSuccess('Profile picture updated successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Calculate statistics
  const totalMoodEntries = moodEntries.length;
  const totalJournalEntries = journalEntries.length;
  const totalChatMessages = conversations.reduce((total, conv) => total + (conv.message_count || 0), 0);
  const averageMood = totalMoodEntries > 0 
    ? (moodEntries.reduce((sum, entry) => sum + entry.mood_level, 0) / totalMoodEntries).toFixed(1)
    : '0.0';
  
  const daysActive = profileData 
    ? Math.ceil((new Date().getTime() - new Date(profileData.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <ParticleCursor />
        <Navbar />
        
        <main className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
                Profile / प्रोफाइल
              </h1>
              <p className="text-xl text-muted-foreground font-body max-w-2xl mx-auto mb-8">
                Please sign in to view and edit your profile.
              </p>
              <Button onClick={() => window.location.href = '/auth'}>
                Sign In to Continue
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ParticleCursor />
      <Navbar />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <AnimateIn>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
                My Profile / मेरा प्रोफाइल
              </h1>
              <p className="text-xl text-muted-foreground font-body">
                Manage your personal information and view your wellness journey
              </p>
            </div>
          </AnimateIn>

          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="edit">Edit Profile</TabsTrigger>
                <TabsTrigger value="statistics">Statistics</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Profile Card */}
                  <div className="lg:col-span-1">
                    <AnimateIn delay={0.1}>
                      <Card className="glass-card">
                        <CardHeader className="text-center">
                          <div className="mx-auto mb-4">
                            <ProfilePictureUpload
                              currentImageUrl={profileData?.profile_picture_url}
                              onImageUpdate={handleProfilePictureUpdate}
                              userId={user.id}
                            />
                          </div>
                          <CardTitle className="text-2xl">
                            {profileData?.full_name || 'User'}
                          </CardTitle>
                          <CardDescription>
                            {profileData?.email || user.email}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {profileData?.bio && (
                            <p className="text-sm text-muted-foreground text-center">
                              {profileData.bio}
                            </p>
                          )}
                          
                          <div className="space-y-2">
                            {profileData?.phone && (
                              <div className="flex items-center space-x-2 text-sm">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span>{profileData.phone}</span>
                              </div>
                            )}
                            {profileData?.location && (
                              <div className="flex items-center space-x-2 text-sm">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span>{profileData.location}</span>
                              </div>
                            )}
                            {profileData?.date_of_birth && (
                              <div className="flex items-center space-x-2 text-sm">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span>{new Date(profileData.date_of_birth).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>

                          <Button 
                            onClick={() => setIsEditing(true)}
                            className="w-full"
                            variant="outline"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Profile
                          </Button>
                        </CardContent>
                      </Card>
                    </AnimateIn>
                  </div>

                  {/* Quick Stats */}
                  <div className="lg:col-span-2">
                    <AnimateIn delay={0.2}>
                      <div className="grid grid-cols-2 gap-4">
                        <Card className="glass-card">
                          <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                              <div className="p-2 bg-primary/20 rounded-lg">
                                <BarChart3 className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold">{totalMoodEntries}</p>
                                <p className="text-sm text-muted-foreground">Mood Entries</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="glass-card">
                          <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                              <div className="p-2 bg-secondary/20 rounded-lg">
                                <BookOpen className="w-6 h-6 text-secondary" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold">{totalJournalEntries}</p>
                                <p className="text-sm text-muted-foreground">Journal Entries</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="glass-card">
                          <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                              <div className="p-2 bg-accent/20 rounded-lg">
                                <MessageCircle className="w-6 h-6 text-accent" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold">{totalChatMessages}</p>
                                <p className="text-sm text-muted-foreground">Chat Messages</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="glass-card">
                          <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                              <div className="p-2 bg-green-500/20 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-green-500" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold">{averageMood}</p>
                                <p className="text-sm text-muted-foreground">Avg Mood</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </AnimateIn>
                  </div>
                </div>
              </TabsContent>

              {/* Edit Profile Tab */}
              <TabsContent value="edit" className="space-y-6">
                <AnimateIn>
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Edit className="w-5 h-5" />
                        <span>Edit Profile</span>
                      </CardTitle>
                      <CardDescription>
                        Update your personal information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
                          {error}
                        </div>
                      )}
                      
                      {success && (
                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500">
                          {success}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="full_name">Full Name</Label>
                          <Input
                            id="full_name"
                            value={formData.full_name}
                            onChange={(e) => handleInputChange('full_name', e.target.value)}
                            placeholder="Enter your full name"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="Enter your phone number"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            placeholder="Enter your location"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="date_of_birth">Date of Birth</Label>
                          <Input
                            id="date_of_birth"
                            type="date"
                            value={formData.date_of_birth}
                            onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          placeholder="Tell us about yourself..."
                          className="w-full px-3 py-2 bg-input border border-glass-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-body min-h-[100px] resize-none"
                        />
                      </div>

                      <div className="flex space-x-3">
                        <Button 
                          onClick={handleSaveProfile}
                          disabled={saving}
                          className="btn-primary"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button 
                          onClick={handleCancelEdit}
                          variant="outline"
                          className="btn-secondary"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </AnimateIn>
              </TabsContent>

              {/* Statistics Tab */}
              <TabsContent value="statistics" className="space-y-6">
                <AnimateIn>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="glass-card">
                      <CardContent className="p-6 text-center">
                        <div className="mx-auto mb-4 w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-3xl font-bold">{daysActive}</p>
                        <p className="text-sm text-muted-foreground">Days Active</p>
                      </CardContent>
                    </Card>

                    <Card className="glass-card">
                      <CardContent className="p-6 text-center">
                        <div className="mx-auto mb-4 w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                          <BarChart3 className="w-6 h-6 text-secondary" />
                        </div>
                        <p className="text-3xl font-bold">{totalMoodEntries}</p>
                        <p className="text-sm text-muted-foreground">Mood Entries</p>
                      </CardContent>
                    </Card>

                    <Card className="glass-card">
                      <CardContent className="p-6 text-center">
                        <div className="mx-auto mb-4 w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-accent" />
                        </div>
                        <p className="text-3xl font-bold">{totalJournalEntries}</p>
                        <p className="text-sm text-muted-foreground">Journal Entries</p>
                      </CardContent>
                    </Card>

                    <Card className="glass-card">
                      <CardContent className="p-6 text-center">
                        <div className="mx-auto mb-4 w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                          <MessageCircle className="w-6 h-6 text-green-500" />
                        </div>
                        <p className="text-3xl font-bold">{totalChatMessages}</p>
                        <p className="text-sm text-muted-foreground">Chat Messages</p>
                      </CardContent>
                    </Card>
                  </div>
                </AnimateIn>

                <AnimateIn delay={0.2}>
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Wellness Journey</CardTitle>
                      <CardDescription>
                        Your mental health tracking progress
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Average Mood</span>
                          <span className="text-2xl font-bold text-primary">{averageMood}/10</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(parseFloat(averageMood) / 10) * 100}%` }}
                          ></div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mt-6">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-500">
                              {totalMoodEntries > 0 ? Math.max(...moodEntries.map(e => e.mood_level)) : 0}
                            </p>
                            <p className="text-sm text-muted-foreground">Best Mood</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-red-500">
                              {totalMoodEntries > 0 ? Math.min(...moodEntries.map(e => e.mood_level)) : 0}
                            </p>
                            <p className="text-sm text-muted-foreground">Lowest Mood</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimateIn>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-6">
                <AnimateIn>
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>
                        Your recent wellness activities
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {totalMoodEntries > 0 && (
                          <div className="flex items-center space-x-3 p-3 bg-primary/10 rounded-lg">
                            <BarChart3 className="w-5 h-5 text-primary" />
                            <div>
                              <p className="font-medium">Latest Mood Entry</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(moodEntries[0]?.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {totalJournalEntries > 0 && (
                          <div className="flex items-center space-x-3 p-3 bg-secondary/10 rounded-lg">
                            <BookOpen className="w-5 h-5 text-secondary" />
                            <div>
                              <p className="font-medium">Latest Journal Entry</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(journalEntries[0]?.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {totalChatMessages > 0 && (
                          <div className="flex items-center space-x-3 p-3 bg-accent/10 rounded-lg">
                            <MessageCircle className="w-5 h-5 text-accent" />
                            <div>
                              <p className="font-medium">Latest Chat Activity</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(conversations[0]?.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {totalMoodEntries === 0 && totalJournalEntries === 0 && totalChatMessages === 0 && (
                          <div className="text-center py-8">
                            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">
                              No activity yet. Start your wellness journey today!
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </AnimateIn>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
