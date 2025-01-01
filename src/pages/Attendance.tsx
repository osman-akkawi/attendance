import React, { useEffect, useState } from 'react';
import { deleteAttendanceRecord, getAttendanceRecords } from '../lib/attendance';
import AttendanceTable from '../components/AttendanceTable';
import AttendanceFilters from '../components/AttendanceFilters';
import { AlertCircle, FileDown } from 'lucide-react';
import { generateAttendancePDF } from '../utils/pdf';

const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    date: new Date().toISOString().split('T')[0],
    status: 'all',
  });

  useEffect(() => {
    fetchAttendance();
  }, [filter]);

  const fetchAttendance = async () => {
    try {
      setError(null);
      const data = await getAttendanceRecords(filter.date, filter.status);
      setAttendanceRecords(data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setError('Failed to load attendance records. Please try again later.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this attendance record?')) {
      return;
    }

    try {
      setError(null);
      await deleteAttendanceRecord(id);
      await fetchAttendance();
    } catch (error) {
      console.error('Error deleting attendance record:', error);
      setError('Failed to delete the attendance record. Please try again later.');
    }
  };

  const handleExportPDF = () => {
    generateAttendancePDF(attendanceRecords, filter.date);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Attendance Records</h1>
        <div className="flex items-center space-x-4">
          <AttendanceFilters
            date={filter.date}
            status={filter.status}
            onFilterChange={(newFilters) => setFilter({ ...filter, ...newFilters })}
          />
          <button
            onClick={handleExportPDF}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <FileDown className="w-4 h-4 mr-2" />
            Export PDF
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <AttendanceTable
        records={attendanceRecords}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Attendance;