import React from 'react';
import { Download } from 'lucide-react';
import { generateQRCodeData } from '../utils/qrcode';

interface TeacherQRCodeProps {
  teacherId: string;
  teacherName: string;
}

const TeacherQRCode: React.FC<TeacherQRCodeProps> = ({ teacherId, teacherName }) => {
  const [qrCode, setQrCode] = React.useState<string>('');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    generateQRCode();
  }, [teacherId]);

  const generateQRCode = async () => {
    try {
      setLoading(true);
      const { qrCode } = await generateQRCodeData(teacherId);
      setQrCode(qrCode);
    } catch (err) {
      setError('Failed to generate QR code');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.download = `${teacherName.toLowerCase().replace(/\s+/g, '-')}-qr-code.png`;
    link.href = qrCode;
    link.click();
  };

  if (loading) {
    return <div className="text-center p-4">Generating QR code...</div>;
  }

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <img src={qrCode} alt={`QR Code for ${teacherName}`} className="w-48 h-48" />
      <button
        onClick={downloadQRCode}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        <Download className="w-4 h-4" />
        <span>Download QR Code</span>
      </button>
    </div>
  );
};

export default TeacherQRCode;