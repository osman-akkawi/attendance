import React from 'react';
import { Calendar } from 'lucide-react';

interface AttendanceFiltersProps {
  date: string;
  status: string;
  onFilterChange: (filters: { date?: string; status?: string }) => void;
}

const AttendanceFilters: React.FC<AttendanceFiltersProps> = ({
  date,
  status,
  onFilterChange,
}) => {
  return (
    <div className="flex space-x-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="date"
            value={date}
            onChange={(e) => onFilterChange({ date: e.target.value })}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => onFilterChange({ status: e.target.value })}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">All</option>
          <option value="present">Present</option>
          <option value="late">Late</option>
          <option value="absent">Absent</option>
        </select>
      </div>
    </div>
  );
};

export default AttendanceFilters;