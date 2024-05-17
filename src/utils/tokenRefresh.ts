import fetch from 'cross-fetch';

interface RefreshResponse {
  ok: boolean;
  accessToken?: string;
}

export async function refreshAccessToken(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to refresh access token');
    }

    const data: RefreshResponse = await response.json();
    if (!data.ok) {
      throw new Error('Error in refresh token response');
    }

    return true;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return false;
  }
}
