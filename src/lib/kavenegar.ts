import axios from 'axios';

const KAVENEGAR_API_KEY = process.env.KAVENEGAR_API_KEY;
const KAVENEGAR_BASE_URL = 'https://api.kavenegar.com/v1';

export async function sendOtp(phone: string, code: string): Promise<boolean> {
  try {
    const response = await axios.get(
      `${KAVENEGAR_BASE_URL}/${KAVENEGAR_API_KEY}/verify/lookup.json`,
      {
        params: {
          receptor: phone,
          token: code,
          template: 'verify', // Your Kavenegar template name
        },
      }
    );
    
    return response.data?.return?.status === 200;
  } catch (error) {
    console.error('Kavenegar SMS error:', error);
    return false;
  }
}

export function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function validatePhone(phone: string): boolean {
  // Iranian phone number validation
  const iranPhoneRegex = /^(?:0|98|\+98)?9\d{9}$/;
  return iranPhoneRegex.test(phone.replace(/\s/g, ''));
}

export function normalizePhone(phone: string): string {
  // Convert all formats to 09XXXXXXXXX
  let normalized = phone.replace(/\s/g, '').replace(/^\+98/, '0').replace(/^98/, '0');
  if (!normalized.startsWith('0')) {
    normalized = '0' + normalized;
  }
  return normalized;
}
