/*
  # Fix QR code storage

  1. Changes
    - Modify teachers table to store QR code hash instead of full data
    - Add function to generate MD5 hash for QR codes
    - Update unique constraint to use hash instead of full QR code

  2. Security
    - Maintain RLS policies from previous migrations
*/

-- Drop existing QR code unique constraint
ALTER TABLE teachers DROP CONSTRAINT IF EXISTS teachers_qr_code_key;

-- Add new column for QR code hash
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS qr_code_hash TEXT;

-- Update existing QR codes (if any) with their hashes
UPDATE teachers 
SET qr_code_hash = md5(qr_code)
WHERE qr_code IS NOT NULL;

-- Make hash column required and unique
ALTER TABLE teachers 
  ALTER COLUMN qr_code_hash SET NOT NULL,
  ADD CONSTRAINT teachers_qr_code_hash_key UNIQUE (qr_code_hash);

-- Drop the old QR code column
ALTER TABLE teachers DROP COLUMN IF EXISTS qr_code;