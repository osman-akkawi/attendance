/*
  # Create authentication schema and policies

  1. Schema Changes
    - Enable auth schema for user management
    - Add RLS policies for authenticated users

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Enable auth schema
CREATE SCHEMA IF NOT EXISTS auth;

-- Update RLS policies for teachers table
CREATE POLICY "Allow authenticated users to read teachers"
  ON teachers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert teachers"
  ON teachers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update teachers"
  ON teachers
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete teachers"
  ON teachers
  FOR DELETE
  TO authenticated
  USING (true);

-- Update RLS policies for courses table
CREATE POLICY "Allow authenticated users to read courses"
  ON courses
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert courses"
  ON courses
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update courses"
  ON courses
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete courses"
  ON courses
  FOR DELETE
  TO authenticated
  USING (true);

-- Update RLS policies for attendance table
CREATE POLICY "Allow authenticated users to read attendance"
  ON attendance
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert attendance"
  ON attendance
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update attendance"
  ON attendance
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete attendance"
  ON attendance
  FOR DELETE
  TO authenticated
  USING (true);