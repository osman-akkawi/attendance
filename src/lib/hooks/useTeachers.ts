import { useState, useCallback } from 'react';
import { supabase } from '../supabase';
import { Database } from '../database.types';
import { sanitizeInput, validateTeacherData } from '../utils/security';
import { generateQRCodeData } from '../utils/qrcode';

type Teacher = Database['public']['Tables']['teachers']['Row'];
type TeacherInput = Pick<Teacher, 'name' | 'email' | 'phone'>;

export const useTeachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const fetchTeachers = useCallback(async () => {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .order('name');
    
    if (error) {
      throw new Error(error.message);
    }

    setTeachers(data || []);
  }, []);

  const createTeacher = async (teacherData: TeacherInput) => {
    const sanitizedData = {
      name: sanitizeInput(teacherData.name),
      email: sanitizeInput(teacherData.email).toLowerCase(),
      phone: teacherData.phone ? sanitizeInput(teacherData.phone) : null,
    };

    const errors = validateTeacherData(sanitizedData);
    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }

    // Generate QR code and hash
    const { hash } = await generateQRCodeData(sanitizedData.email);

    const { error } = await supabase
      .from('teachers')
      .insert([{ ...sanitizedData, qr_code_hash: hash }]);
    
    if (error) throw new Error(error.message);
  };

  const updateTeacher = async (id: string, teacherData: TeacherInput) => {
    const sanitizedData = {
      name: sanitizeInput(teacherData.name),
      email: sanitizeInput(teacherData.email).toLowerCase(),
      phone: teacherData.phone ? sanitizeInput(teacherData.phone) : null,
    };

    const errors = validateTeacherData(sanitizedData);
    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }

    // Generate new QR code hash if email changed
    const { data: existingTeacher } = await supabase
      .from('teachers')
      .select('email')
      .eq('id', id)
      .single();

    let qrCodeHash;
    if (existingTeacher && existingTeacher.email !== sanitizedData.email) {
      const { hash } = await generateQRCodeData(sanitizedData.email);
      qrCodeHash = hash;
    }

    const { error } = await supabase
      .from('teachers')
      .update({
        ...sanitizedData,
        ...(qrCodeHash && { qr_code_hash: qrCodeHash }),
      })
      .eq('id', id);
    
    if (error) throw new Error(error.message);
  };

  const deleteTeacher = async (id: string) => {
    const { error } = await supabase
      .from('teachers')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
  };

  return {
    teachers,
    fetchTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher,
  };
};