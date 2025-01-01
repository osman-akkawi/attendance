import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { Camera, CheckCircle, XCircle } from 'lucide-react';
import { getTeacherById, getTodayAttendanceRecord, createAttendanceRecord, updateAttendanceCheckOut } from '../lib/attendance';

type Course = Database['public']['Tables']['courses']['Row'];

interface ScanResult {
  success: boolean;
  message: string;
}

const SCAN_COOLDOWN = 3000; // 3 seconds cooldown between scans

const QRScanner: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const scannerRef = useRef<QrScanner | null>(null);
  const lastScanRef = useRef<number>(0);

  useEffect(() => {
    fetchCourses();
    return () => {
      if (scannerRef.current) {
        scannerRef.current.destroy();
      }
    };
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setScanResult({
        success: false,
        message: 'Failed to load courses. Please refresh the page.',
      });
    }
  };

  const startScanning = async () => {
    if (!selectedCourse) {
      alert('Please select a course first');
      return;
    }

    if (!videoRef.current) return;

    try {
      scannerRef.current = new QrScanner(
        videoRef.current,
        async (result) => {
          const now = Date.now();
          if (now - lastScanRef.current < SCAN_COOLDOWN) {
            return; // Ignore scan if within cooldown period
          }
          lastScanRef.current = now;
          await handleScan(result.data);
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      await scannerRef.current.start();
      setScanning(true);
      setScanResult(null);
    } catch (error) {
      console.error('Error starting scanner:', error);
      setScanResult({
        success: false,
        message: 'Failed to start QR scanner. Please check camera permissions.',
      });
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    setScanning(false);
  };

  const handleScan = async (qrData: string) => {
    try {
      const data = JSON.parse(qrData);
      const teacherId = data.id;

      // Get teacher
      const teacher = await getTeacherById(teacherId);
      if (!teacher) {
        setScanResult({
          success: false,
          message: 'Invalid QR code or teacher not found',
        });
        return;
      }

      // Get existing attendance records
      const existingRecords = await getTodayAttendanceRecord(teacherId, selectedCourse);
      const latestRecord = existingRecords[0];

      try {
        if (latestRecord && !latestRecord.check_out) {
          await updateAttendanceCheckOut(latestRecord.id);
          setScanResult({
            success: true,
            message: `Check-out recorded for ${teacher.name} at ${new Date().toLocaleTimeString()}`,
          });
        } else {
          await createAttendanceRecord(teacherId, selectedCourse);
          setScanResult({
            success: true,
            message: `Check-in recorded for ${teacher.name} at ${new Date().toLocaleTimeString()}`,
          });
        }
      } catch (error: any) {
        setScanResult({
          success: false,
          message: error.message || 'Failed to process attendance',
        });
      }
    } catch (error) {
      console.error('Error processing QR code:', error);
      setScanResult({
        success: false,
        message: 'Error processing QR code',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">QR Code Scanner</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Course
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          {!scanning ? (
            <button
              onClick={startScanning}
              disabled={!selectedCourse}
              className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                selectedCourse
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <Camera className="w-5 h-5 mr-2" />
              Start Scanning
            </button>
          ) : (
            <button
              onClick={stopScanning}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              <XCircle className="w-5 h-5 mr-2" />
              Stop Scanning
            </button>
          )}

          {scanResult && (
            <div
              className={`p-4 rounded-md ${
                scanResult.success
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}
            >
              <div className="flex items-center">
                {scanResult.success ? (
                  <CheckCircle className="w-5 h-5 mr-2" />
                ) : (
                  <XCircle className="w-5 h-5 mr-2" />
                )}
                {scanResult.message}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6">
          <video
            ref={videoRef}
            className="w-full aspect-video rounded-lg bg-gray-100"
          />
        </div>
      </div>
    </div>
  );
};

export default QRScanner;