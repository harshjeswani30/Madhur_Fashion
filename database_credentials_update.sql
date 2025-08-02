-- 🔐 Madhur Fashion - Database Credentials Update Script
-- Run this in your Supabase SQL Editor to update all authentication credentials

-- ========================================
-- 1. UPDATE EXISTING ADMIN/OWNER CREDENTIALS
-- ========================================

-- Update the owner account with new credentials
UPDATE staff 
SET 
    username = 'kailashjeswani',
    email = 'kailashjeswani@madhurfashion.com',
    updated_at = NOW()
WHERE role = 'owner' AND (username = 'owner' OR email = 'owner@madhurfashion.com');

-- ========================================
-- 2. REMOVE OLD STAFF CREDENTIALS
-- ========================================

-- Remove old staff members (if they exist)
DELETE FROM staff 
WHERE email IN ('owner@madhurfashion.com', 'staff@madhurfashion.com') 
AND role = 'staff';

-- ========================================
-- 3. INSERT NEW STAFF MEMBERS
-- ========================================

-- Insert new staff members with updated credentials
INSERT INTO staff (username, email, role, created_at, updated_at) VALUES 
    ('staff1', 'staff1@madhurfashion.com', 'staff', NOW(), NOW()),
    ('staff2', 'staff2@madhurfashion.com', 'staff', NOW(), NOW()),
    ('manager', 'manager@madhurfashion.com', 'staff', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET
    username = EXCLUDED.username,
    role = EXCLUDED.role,
    updated_at = NOW();

-- ========================================
-- 4. VERIFY UPDATES
-- ========================================

-- Check all staff members (run this to verify changes)
SELECT 
    id,
    username,
    email,
    role,
    created_at,
    updated_at
FROM staff 
ORDER BY role DESC, username ASC;

-- ========================================
-- 5. CLEAN UP ANY DUPLICATE ENTRIES
-- ========================================

-- Remove any duplicate entries (safety cleanup)
DELETE FROM staff 
WHERE id IN (
    SELECT id FROM (
        SELECT id, 
               ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at DESC) as rn
        FROM staff
    ) t 
    WHERE rn > 1
);

-- ========================================
-- 6. FINAL VERIFICATION QUERY
-- ========================================

-- Final check - should show exactly these records:
-- kailashjeswani@madhurfashion.com (owner)
-- staff1@madhurfashion.com (staff)
-- staff2@madhurfashion.com (staff)  
-- manager@madhurfashion.com (staff)

SELECT 
    'Total staff members: ' || COUNT(*) as summary
FROM staff;

SELECT 
    username,
    email,
    role,
    'Updated successfully ✅' as status
FROM staff 
ORDER BY 
    CASE role 
        WHEN 'owner' THEN 1 
        WHEN 'staff' THEN 2 
    END,
    username;

-- ========================================
-- 7. OPTIONAL: ADD PASSWORD HASH COLUMN (for future security)
-- ========================================

-- Uncomment these lines if you want to add password storage to database
-- (Currently passwords are handled in the frontend AuthProvider)

-- ALTER TABLE staff ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
-- UPDATE staff SET password_hash = '$2a$12$encrypted_hash_here' WHERE email = 'kailashjeswani@madhurfashion.com';
-- UPDATE staff SET password_hash = '$2a$12$encrypted_hash_here' WHERE email = 'staff1@madhurfashion.com';
-- UPDATE staff SET password_hash = '$2a$12$encrypted_hash_here' WHERE email = 'staff2@madhurfashion.com';
-- UPDATE staff SET password_hash = '$2a$12$encrypted_hash_here' WHERE email = 'manager@madhurfashion.com';
