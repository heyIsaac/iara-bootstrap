import axios from 'axios';
import { ENV } from '@/shared/config';
import { AuthResponse, LoginCredentials, RegisterCredentials } from './types';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(
      `${ENV.reqresBaseUrl}/login`,
      credentials,
      {
        headers: {
          'x-api-key': 'reqres-free-v1',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || 'Erro ao fazer login. Verifique suas credenciais.'
    );
  }
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(
      `${ENV.reqresBaseUrl}/register`,
      credentials,
      {
        headers: {
          'x-api-key': 'reqres-free-v1',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || 'Erro ao criar conta. Tente novamente.'
    );
  }
};

export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
  }
};
