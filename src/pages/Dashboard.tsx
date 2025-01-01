import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Users, BookOpen, ClipboardCheck } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    teacherCount: 0,
    courseCount: 0,
    todayAttendance: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [teachersData, coursesData, attendanceData] = await Promise.all([
        supabase.from('teachers').select('id', { count: 'exact' }),
        supabase.from('courses').select('id', { count: 'exact' }),
        supabase
          .from('attendance')
          .select('id', { count: 'exact' })
          .gte('created_at', new Date().toISOString().split('T')[0]),
      ]);

      setStats({
        teacherCount: teachersData.count || 0,
        courseCount: coursesData.count || 0,
        todayAttendance: attendanceData.count || 0,
      });
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Teachers Card */}
        <div className="bg-white overflow-hidden rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Teachers</dt>
                  <dd className="text-3xl font-semibold text-gray-900">{stats.teacherCount}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Card */}
        <div className="bg-white overflow-hidden rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Courses</dt>
                  <dd className="text-3xl font-semibold text-gray-900">{stats.courseCount}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Attendance Card */}
        <div className="bg-white overflow-hidden rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClipboardCheck className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Today's Attendance</dt>
                  <dd className="text-3xl font-semibold text-gray-900">{stats.todayAttendance}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;