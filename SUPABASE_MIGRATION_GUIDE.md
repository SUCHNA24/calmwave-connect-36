# Supabase Database Migration Guide

## 🗄️ Step-by-Step Migration Instructions

### **Step 1: Access Supabase Dashboard**

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Sign in with your Supabase account
   - Select your project (calmwave-connect-36)

### **Step 2: Navigate to SQL Editor**

1. **Open SQL Editor**
   - In the left sidebar, click on **"SQL Editor"**
   - You'll see a text area where you can run SQL commands

### **Step 3: Run Migrations in Order**

**⚠️ IMPORTANT: Run these migrations in the exact order listed below!**

#### **Migration 1: Initial Schema**
1. **Copy the entire content** of `supabase/migrations/001_initial_schema.sql`
2. **Paste it** into the SQL Editor
3. **Click "Run"** button (or press Ctrl+Enter)
4. **Wait for completion** - you should see "Success" message

#### **Migration 2: RLS Policies**
1. **Copy the entire content** of `supabase/migrations/002_rls_policies.sql`
2. **Paste it** into the SQL Editor
3. **Click "Run"** button
4. **Wait for completion**

#### **Migration 3: Seed Data**
1. **Copy the entire content** of `supabase/migrations/003_seed_data.sql`
2. **Paste it** into the SQL Editor
3. **Click "Run"** button
4. **Wait for completion**

#### **Migration 4: Storage Setup**
1. **Copy the entire content** of `supabase/migrations/004_storage_setup.sql`
2. **Paste it** into the SQL Editor
3. **Click "Run"** button
4. **Wait for completion**

#### **Migration 5: Recovery Tracking**
1. **Copy the entire content** of `supabase/migrations/005_recovery_tracking.sql`
2. **Paste it** into the SQL Editor
3. **Click "Run"** button
4. **Wait for completion**

### **Step 4: Verify Migration Success**

#### **Check Tables Created**
1. **Go to Table Editor**
   - In the left sidebar, click on **"Table Editor"**
   - You should see these tables:
     - ✅ `profiles`
     - ✅ `mood_entries`
     - ✅ `journal_entries`
     - ✅ `conversations`
     - ✅ `chat_messages`
     - ✅ `crisis_entries`
     - ✅ `resources`
     - ✅ `user_resource_bookmarks`
     - ✅ `medication_entries`
     - ✅ `medication_checkins`
     - ✅ `recovery_entries`
     - ✅ `recovery_goals`
     - ✅ `recovery_milestones`

#### **Check Storage Bucket**
1. **Go to Storage**
   - In the left sidebar, click on **"Storage"**
   - You should see:
     - ✅ `avatars` bucket (for profile pictures)

#### **Check RLS Policies**
1. **Go to Authentication > Policies**
   - In the left sidebar, click on **"Authentication"**
   - Click on **"Policies"**
   - You should see policies for all tables

### **Step 5: Test the Application**

1. **Start Development Server** (if not running)
   ```bash
   npm run dev
   ```

2. **Test Features**
   - Go to http://localhost:8080
   - Try signing up/signing in
   - Test mood tracking
   - Test journal entries
   - Test recovery tracking in Support page
   - Test profile picture upload

## 🔧 Troubleshooting

### **Common Issues:**

#### **"Table already exists" Error**
- **Solution**: This is normal if you've run migrations before
- **Action**: Continue with the next migration

#### **"Permission denied" Error**
- **Solution**: Make sure you're signed in as the project owner
- **Action**: Check your Supabase account permissions

#### **"Function already exists" Error**
- **Solution**: This is normal for functions that are recreated
- **Action**: Continue with the next migration

#### **"Policy already exists" Error**
- **Solution**: This is normal for policies that are recreated
- **Action**: Continue with the next migration

### **If Migration Fails:**

1. **Check Error Message**
   - Look at the error details in the SQL Editor
   - Note which migration failed

2. **Partial Migration**
   - If some migrations succeeded, you can continue from where it failed
   - Don't re-run successful migrations

3. **Reset Database** (Last Resort)
   - Go to Settings > Database
   - Click "Reset Database"
   - **⚠️ WARNING: This will delete all data!**

## 📋 Migration Checklist

- [ ] Migration 1: Initial Schema completed
- [ ] Migration 2: RLS Policies completed
- [ ] Migration 3: Seed Data completed
- [ ] Migration 4: Storage Setup completed
- [ ] Migration 5: Recovery Tracking completed
- [ ] All tables visible in Table Editor
- [ ] Storage bucket created
- [ ] RLS policies active
- [ ] Application features working

## 🎯 Expected Results

After successful migration, you should have:

### **Database Tables:**
- **13 tables** created with proper relationships
- **4 enums** for data validation
- **RLS policies** for security
- **Database functions** for calculations

### **Storage:**
- **avatars bucket** for profile pictures
- **Public access** configured
- **File size limits** set (5MB)

### **Features Enabled:**
- ✅ User authentication and profiles
- ✅ Mood tracking with persistence
- ✅ Journal entries with persistence
- ✅ AI chat with conversation history
- ✅ Crisis support resources
- ✅ Recovery tracking system
- ✅ Goal management
- ✅ Profile picture uploads
- ✅ Achievement system

## 🚀 Next Steps

1. **Test all features** in the application
2. **Create a test user account**
3. **Try the recovery tracking system**
4. **Upload a profile picture**
5. **Create some recovery goals**

Your CalmWave Connect app is now fully configured with a comprehensive database backend! 🎉
