# CalmWave Connect - Database Setup Guide

This guide will help you set up the Supabase database for the CalmWave Connect mental health application.

## Database Schema Overview

The database includes the following main tables:

### Core Tables
- **profiles** - User profile information (extends Supabase auth.users)
- **mood_entries** - Daily mood tracking entries
- **journal_entries** - Personal journal entries
- **conversations** - AI chat conversation sessions
- **chat_messages** - Individual messages within conversations
- **crisis_entries** - Crisis support and emergency entries
- **resources** - Mental health resources and links
- **user_resource_bookmarks** - User bookmarked resources
- **medication_entries** - User medication information
- **medication_checkins** - Medication adherence tracking

## Setup Instructions

### Method 1: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Navigate to your project: `wmpwxcxlbyfeyidxtewn`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Migration Files**
   - Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
   - Click "Run" to execute
   - Repeat for `002_rls_policies.sql` and `003_seed_data.sql`

### Method 2: Using Supabase CLI (Alternative)

If you have Supabase CLI installed:

```bash
# Initialize Supabase in your project
supabase init

# Link to your remote project
supabase link --project-ref wmpwxcxlbyfeyidxtewn

# Apply migrations
supabase db push
```

## Database Features

### Security
- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Public read access for resources table only

### Relationships
- All user data is linked via `user_id` foreign key
- Conversations contain multiple chat messages
- Medication entries can have multiple check-ins
- Resources can be bookmarked by multiple users

### Data Types
- **Enums** for consistent mood levels, crisis severity, etc.
- **Arrays** for emotions, triggers, coping strategies
- **JSONB** for flexible metadata storage
- **Timestamps** with automatic timezone handling

### Triggers
- Automatic `updated_at` timestamp updates
- Automatic profile creation on user signup

## Sample Data

The database includes pre-populated mental health resources in both English and Hindi, including:

- Crisis helplines (National Suicide Prevention Lifeline, iCall, KIRAN)
- Therapy platforms (BetterHelp, Talkspace)
- Wellness apps (Headspace, Calm)
- Self-help resources and guides

## Testing the Setup

After running the migrations, you can test the database by:

1. **Creating a test user** in Supabase Auth
2. **Inserting sample data** using the Supabase dashboard
3. **Testing RLS policies** by trying to access other users' data

## Troubleshooting

### Common Issues

1. **Permission Errors**: Make sure RLS policies are applied correctly
2. **Foreign Key Errors**: Ensure profiles are created before other user data
3. **Type Errors**: Verify that enum values match the TypeScript types

### Verification Queries

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies WHERE schemaname = 'public';

-- Check sample data
SELECT COUNT(*) FROM resources;
```

## Next Steps

1. **Update your application** to use the new database schema
2. **Implement authentication** using Supabase Auth
3. **Add data persistence** to your React components
4. **Test all CRUD operations** for each table

## Support

If you encounter any issues:
1. Check the Supabase logs in the dashboard
2. Verify your RLS policies are correctly applied
3. Ensure your TypeScript types match the database schema
4. Test with sample data first before implementing in your app
