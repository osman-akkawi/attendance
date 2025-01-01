import React from 'react';
import { Clock, Trash2 } from 'lucide-react';
import { Database } from '../lib/database.types';

type AttendanceRecord = Database['public']['Tables']['attendance']['Row'] & {
  teachers?: { name: string; email: string };
  courses?: { name: string };
};

interface AttendanceTableProps {
  records: AttendanceRecord[];
  onDelete: (id: string) => Promise<void>;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ records, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Teacher
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Course
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Check In
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Check Out
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {records.map((record) => (
            <tr key={record.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {record.teachers?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {record.teachers?.email}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {record.courses?.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {record.check_in && (
                  <div className="flex items-center text-sm text-gray-900">
                    <Clock className="h-4 w-4 mr-1 text-gray-400" />
                    {new Date(record.check_in).toLocaleTimeString()}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {record.check_out && (
                  <div className="flex items-center text-sm text-gray-900">
                    <Clock className="h-4 w-4 mr-1 text-gray-400" />
                    {new Date(record.check_out).toLocaleTimeString()}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={async () => {
                    try {
                      await onDelete(record.id);
                    } catch (error) {
                      console.error('Failed to delete record:', error);
                    }
                  }}
                  className="text-red-600 hover:text-red-900"
                  title="Delete record"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;