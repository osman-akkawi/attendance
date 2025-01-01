import QRCode from 'qrcode';
import { generateHash } from './crypto';

interface QRCodeData {
  id: string;
  timestamp: string;
}

/**
 * Generates a QR code and its hash for a teacher ID
 */
export async function generateQRCodeData(teacherId: string): Promise<{ qrCode: string; hash: string }> {
  const qrData: QRCodeData = {
    id: teacherId,
    timestamp: new Date().toISOString(),
  };
  
  const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));
  const hash = await generateHash(qrCode);
  
  return { qrCode, hash };
}