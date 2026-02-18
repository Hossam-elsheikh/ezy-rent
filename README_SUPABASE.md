# Supabase Storage Setup for EzyRent

To ensure images are displayed correctly in the app, you need to set up a storage bucket in your Supabase dashboard.

## 1. Create the Bucket
1. Go to **Storage** in your Supabase Dashboard.
2. Click **New Bucket**.
3. Name it `units_images`.
4. Make it **Public** (so images can be viewed without a token).

## 2. Set Up RLS Policies for Storage
To allow users to upload images and admins to manage them, add the following policies to the `units_images` bucket:

### Policy 1: Anyone can view images
- **Allowed Operation**: `SELECT`
- **Policy Name**: `Public Access`
- **Target Roles**: `public`
- **Definition**: Truly public (or `bucket_id = 'units_images'`)

### Policy 2: Authenticated users can upload images
- **Allowed Operation**: `INSERT`
- **Policy Name**: `Allow Authenticated Upload`
- **Target Roles**: `authenticated`
- **Check expression**: `bucket_id = 'units_images'`

### Policy 3: Users can manage their own images
- **Allowed Operation**: `UPDATE`, `DELETE`
- **Policy Name**: `Owner Management`
- **Target Roles**: `authenticated`
- **Definition**: `auth.uid()::text = (storage.foldername(name))[1]` (assuming you upload to `folder/userid/...`)

## 3. Update Environment Variables
Make sure your `.env` file has the following (which we've already set up):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for admin tasks)

## 4. Database Trigger
The `001_initial_schema.sql` migration already includes a trigger to automatically create a profile in the `public.users` table whenever a new user signs up via Supabase Auth.
