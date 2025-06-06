const API_URL = 'http://localhost:3001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 401) {
      //Очистка токена при ошибке аутентификации
      localStorage.removeItem('token');
    }
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  
  return response.json();
};

export const authApi = {
  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      });

      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData),
      });

      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  async getProfile() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await handleResponse(response);
      return data;
    } catch (error) {
      throw error;
    }
  }
}; 