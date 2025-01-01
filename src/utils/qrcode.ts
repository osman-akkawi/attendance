import QRCode from 'qrcode';

async function generateHash(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const generateQRCodeData = async (teacherId: string): Promise<{ qrCode: string; hash: string }> => {
  const qrData = JSON.stringify({
    id: teacherId,
    timestamp: new Date().toISOString(),
  });
  
  const qrCode = await QRCode.toDataURL(qrData);
  const hash = await generateHash(qrCode);
  
  return { qrCode, hash };
};