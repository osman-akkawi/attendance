import { z } from 'zod';

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 1000); // Limit input length
};

// Email validation schema
const emailSchema = z.string().email();

// Phone validation schema
const phoneSchema = z.string().regex(/^\+?[\d\s-]{10,}$/, 'Invalid phone number format');

// Teacher data validation
interface TeacherData {
  name: string;
  email: string;
  phone?: string | null;
}

export const validateTeacherData = (data: TeacherData): string[] => {
  const errors: string[] = [];

  // Name validation
  if (!data.name || data.name.length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  // Email validation
  try {
    emailSchema.parse(data.email);
  } catch {
    errors.push('Invalid email format');
  }

  // Phone validation (optional)
  if (data.phone) {
    try {
      phoneSchema.parse(data.phone);
    } catch {
      errors.push('Invalid phone number format');
    }
  }

  return errors;
};