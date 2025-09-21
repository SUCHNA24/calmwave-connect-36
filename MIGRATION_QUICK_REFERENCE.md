# 🚀 Supabase Migration Quick Reference

## 📋 **Quick Steps**

### **1. Go to Supabase Dashboard**
- Visit: https://supabase.com/dashboard
- Sign in → Select your project
- Click **"SQL Editor"** in left sidebar

### **2. Run These 5 Migrations (In Order)**

#### **Migration 1: Initial Schema**
```bash
# Copy entire file: supabase/migrations/001_initial_schema.sql
# Paste in SQL Editor → Click "Run"
```

#### **Migration 2: RLS Policies**
```bash
# Copy entire file: supabase/migrations/002_rls_policies.sql
# Paste in SQL Editor → Click "Run"
```

#### **Migration 3: Seed Data**
```bash
# Copy entire file: supabase/migrations/003_seed_data.sql
# Paste in SQL Editor → Click "Run"
```

#### **Migration 4: Storage Setup**
```bash
# Copy entire file: supabase/migrations/004_storage_setup.sql
# Paste in SQL Editor → Click "Run"
```

#### **Migration 5: Recovery Tracking**
```bash
# Copy entire file: supabase/migrations/005_recovery_tracking.sql
# Paste in SQL Editor → Click "Run"
```

### **3. Verify Success**
- Go to **"Table Editor"** → Should see 13 tables
- Go to **"Storage"** → Should see `avatars` bucket
- Go to **"Authentication > Policies"** → Should see RLS policies

### **4. Test Application**
- Visit: http://localhost:8080
- Try signing up/signing in
- Test recovery tracking in Support page

## ⚠️ **Important Notes**

- **Run migrations in exact order** (1→2→3→4→5)
- **Wait for each to complete** before running the next
- **Ignore "already exists" errors** - they're normal
- **Don't re-run successful migrations**

## 🎯 **Expected Results**

After migration, you'll have:
- ✅ **13 database tables** with relationships
- ✅ **Storage bucket** for profile pictures
- ✅ **RLS policies** for security
- ✅ **Recovery tracking system** ready
- ✅ **All app features** working

## 🆘 **If Something Goes Wrong**

1. **Check error message** in SQL Editor
2. **Continue from where it failed** (don't restart)
3. **Contact support** if issues persist

**Your CalmWave Connect app will be fully functional after these migrations!** 🎉
