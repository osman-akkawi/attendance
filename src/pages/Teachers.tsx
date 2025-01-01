import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useTeachers } from '../lib/hooks/useTeachers';
import TeacherList from '../components/TeacherList';
import TeacherModal from '../components/TeacherModal';
import type { Database } from '../lib/database.types';

type Teacher = Database['public']['Tables']['teachers']['Row'];

const Teachers = () => {
  const { teachers, fetchTeachers, createTeacher, updateTeacher, deleteTeacher } = useTeachers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    fetchTeachers().catch(console.error);
  }, [fetchTeachers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTeacher) {
        await updateTeacher(editingTeacher.id, formData);
      } else {
        await createTeacher(formData);
      }
      handleCloseModal();
      await fetchTeachers();
    } catch (error: any) {
      alert(error.message || 'An error occurred while saving the teacher');
    }
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this teacher?')) {
      return;
    }

    try {
      await deleteTeacher(id);
      await fetchTeachers();
    } catch (error: any) {
      alert(error.message || 'An error occurred while deleting the teacher');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTeacher(null);
    setFormData({ name: '', email: '', phone: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Teacher
        </button>
      </div>

      <TeacherList
        teachers={teachers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <TeacherModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        editingTeacher={editingTeacher}
      />
    </div>
  );
};

export default Teachers;