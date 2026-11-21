import QRCode from 'qrcode';
import { GeneratedPix, PixData } from './types';

export const generatePixPayload = (data: PixData): string => {
  const { value, recipient, city, txid } = data;

  const payload = {
    pixKey: 'iaragames@pix.com.br',
    recipient,
    city,
    value: value.toFixed(2),
    txid,
    timestamp: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    return btoa(JSON.stringify(payload));
  }
  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

export const generatePixQRCode = async (payload: string): Promise<string> => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(payload, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    return qrCodeDataUrl;
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    throw new Error('Erro ao gerar QR Code do PIX');
  }
};

export const generatePix = async (
  value: number,
  orderId: string
): Promise<GeneratedPix> => {
  const pixData: PixData = {
    value,
    recipient: 'Iara Games LTDA',
    city: 'São Paulo',
    txid: orderId,
  };

  const payload = generatePixPayload(pixData);
  const qrCode = await generatePixQRCode(payload);

  return {
    payload,
    qrCode,
    pixKey: 'iaragames@pix.com.br',
    value: value.toFixed(2),
    expiresIn: 30,
  };
};
