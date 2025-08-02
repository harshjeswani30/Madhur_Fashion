-- 🚀 QUICK UPDATE - Essential Commands Only
-- Copy and paste these commands one by one in Supabase SQL Editor

-- 1. Update owner credentials
UPDATE staff 
SET username = 'kailashjeswani', email = 'kailashjeswani@madhurfashion.com', updated_at = NOW()
WHERE role = 'owner';

-- 2. Delete old staff entries
DELETE FROM staff WHERE email IN ('owner@madhurfashion.com', 'staff@madhurfashion.com') AND role = 'staff';

-- 3. Insert new staff members
INSERT INTO staff (username, email, role, created_at, updated_at) VALUES 
    ('staff1', 'staff1@madhurfashion.com', 'staff', NOW(), NOW()),
    ('staff2', 'staff2@madhurfashion.com', 'staff', NOW(), NOW()),
    ('manager', 'manager@madhurfashion.com', 'staff', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET username = EXCLUDED.username, updated_at = NOW();

-- 4. Verify results
SELECT username, email, role FROM staff ORDER BY role DESC, username;
