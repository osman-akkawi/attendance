import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { Plus } from 'lucide-react';
import CourseList from '../components/CourseList';
import CourseForm from '../components/CourseForm';
import Modal from '../components/Modal';

type Course = Database['public']['Tables']['courses']['Row'];
type Teacher = Database['public']['Tables']['teachers']['Row'];

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teacher_id: '',
    schedule_start: '',
    schedule_end: '',
    days_of_week: [] as string[],
  });

  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, []);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        teachers (
          name
        )
      `)
      .order('name');
    
    if (error) {
      console.error('Error fetching courses:', error);
      return;
    }

    setCourses(data);
  };

  const fetchTeachers = async () => {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching teachers:', error);
      return;
    }

    setTeachers(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCourse) {
      const { error } = await supabase
        .from('courses')
        .update({ ...formData })
        .eq('id', editingCourse.id);
      
      if (error) {
        console.error('Error updating course:', error);
        return;
      }
    } else {
      const { error } = await supabase
        .from('courses')
        .insert([formData]);
      
      if (error) {
        console.error('Error creating course:', error);
        return;
      }
    }

    handleCloseModal();
    fetchCourses();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting course:', error);
      return;
    }

    fetchCourses();
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      description: course.description || '',
      teacher_id: course.teacher_id || '',
      schedule_start: course.schedule_start,
      schedule_end: course.schedule_end,
      days_of_week: course.days_of_week,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
    setFormData({
      name: '',
      description: '',
      teacher_id: '',
      schedule_start: '',
      schedule_end: '',
      days_of_week: [],
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </button>
      </div>

      <CourseList
        courses={courses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        title={editingCourse ? 'Edit Course' : 'Add Course'}
      >
        <CourseForm
          formData={formData}
          setFormData={setFormData}
          teachers={teachers}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isEditing={!!editingCourse}
        />
      </Modal>
    </div>
  );
};

export default Courses;