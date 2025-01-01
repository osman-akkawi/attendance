export interface Database {
  public: {
    Tables: {
      teachers: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          qr_code_hash: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          qr_code_hash: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          qr_code_hash?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          teacher_id: string | null;
          schedule_start: string;
          schedule_end: string;
          days_of_week: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          teacher_id?: string | null;
          schedule_start: string;
          schedule_end: string;
          days_of_week: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          teacher_id?: string | null;
          schedule_start?: string;
          schedule_end?: string;
          days_of_week?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      attendance: {
        Row: {
          id: string;
          teacher_id: string;
          course_id: string;
          check_in: string | null;
          check_out: string | null;
          status: 'present' | 'late' | 'absent';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          teacher_id: string;
          course_id: string;
          check_in?: string | null;
          check_out?: string | null;
          status: 'present' | 'late' | 'absent';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          teacher_id?: string;
          course_id?: string;
          check_in?: string | null;
          check_out?: string | null;
          status?: 'present' | 'late' | 'absent';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}