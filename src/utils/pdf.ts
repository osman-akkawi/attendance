import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Database } from '../lib/database.types';

type AttendanceRecord = Database['public']['Tables']['attendance']['Row'] & {
  teachers?: { name: string; email: string };
  courses?: { name: string };
};

export const generateAttendancePDF = (records: AttendanceRecord[], date: string) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(16);
  doc.text(`Attendance Report - ${new Date(date).toLocaleDateString()}`, 14, 15);

  // Define the table columns
  const columns = ['Teacher', 'Course', 'Check In', 'Check Out', 'Status'];

  // Transform the data for the table
  const data = records.map(record => [
    record.teachers?.name || 'N/A',
    record.courses?.name || 'N/A',
    record.check_in ? new Date(record.check_in).toLocaleTimeString() : 'N/A',
    record.check_out ? new Date(record.check_out).toLocaleTimeString() : 'N/A',
    record.status.charAt(0).toUpperCase() + record.status.slice(1)
  ]);

  // Generate the table
  autoTable(doc, {
    head: [columns],
    body: data,
    startY: 25,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [66, 139, 202] }
  });

  // Add footer with timestamp
  const timestamp = new Date().toLocaleString();
  doc.setFontSize(10);
  doc.setTextColor(128);
  doc.text(`Generated on: ${timestamp}`, 14, doc.internal.pageSize.height - 10);

  // Save the PDF
  doc.save(`attendance-report-${date}.pdf`);
};