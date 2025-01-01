import { supabase } from './supabase';
import { Database } from './database.types';

type Teacher = Database['public']['Tables']['teachers']['Row'];
type AttendanceRecord = Database['public']['Tables']['attendance']['Row'];

export async function getTeacherById(id: string): Promise<Teacher | null> {
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getTodayAttendanceRecord(teacherId: string, courseId: string): Promise<AttendanceRecord[]> {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('teacher_id', teacherId)
    .eq('course_id', courseId)
    .gte('created_at', `${today}T00:00:00`)
    .lte('created_at', `${today}T23:59:59`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createAttendanceRecord(teacherId: string, courseId: string): Promise<void> {
  const now = new Date();
  const scheduleTime = now.toLocaleTimeString('en-US', { hour12: false });
  
  // Check for existing record first
  const existingRecords = await getTodayAttendanceRecord(teacherId, courseId);
  if (existingRecords.length > 0) {
    const latestRecord = existingRecords[0];
    if (!latestRecord.check_out) {
      throw new Error('Teacher already has an active attendance record');
    }
    if (latestRecord.check_out) {
      throw new Error('Teacher has already completed attendance for today');
    }
  }

  // Get course schedule
  const { data: course } = await supabase
    .from('courses')
    .select('schedule_start')
    .eq('id', courseId)
    .single();

  // Determine if teacher is late
  const status = course && scheduleTime > course.schedule_start ? 'late' : 'present';

  const { error } = await supabase
    .from('attendance')
    .insert([{
      teacher_id: teacherId,
      course_id: courseId,
      check_in: now.toISOString(),
      status
    }]);

  if (error) throw error;
}

export async function updateAttendanceCheckOut(id: string): Promise<void> {
  // Check if already checked out
  const { data: record } = await supabase
    .from('attendance')
    .select('check_out')
    .eq('id', id)
    .single();

  if (record?.check_out) {
    throw new Error('Attendance record already checked out');
  }

  const { error } = await supabase
    .from('attendance')
    .update({ check_out: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteAttendanceRecord(id: string): Promise<void> {
  const { error } = await supabase
    .from('attendance')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getAttendanceRecords(date: string, status: string = 'all') {
  let query = supabase
    .from('attendance')
    .select(`
      *,
      teachers (
        name,
        email
      ),
      courses (
        name
      )
    `)
    .gte('created_at', `${date}T00:00:00`)
    .lte('created_at', `${date}T23:59:59`);

  if (status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}