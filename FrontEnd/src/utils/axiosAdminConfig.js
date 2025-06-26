import axios from 'axios';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const api = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_URL,
  withCredentials: true,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    

    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Network error - please check your connection'));
    }
    

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
     
      if (originalRequest.url?.includes('login')) {
        return Promise.reject(error);
      }
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }
      
      isRefreshing = true;
      
      try {
       
        const refreshUrl = import.meta.env.VITE_ADMIN_URL.endsWith('/') 
          ? `${import.meta.env.VITE_ADMIN_URL}refresh-token`
          : `${import.meta.env.VITE_ADMIN_URL}/refresh-token`;
          
        const refreshResponse = await axios.post(
          refreshUrl,
          {},
          { 
            withCredentials: true,
            timeout: 5000 
          }
        );
        
        const newAccessToken = refreshResponse.data.token;
        
        if (!newAccessToken) {
          throw new Error('No token received from refresh');
        }
        
        localStorage.setItem("adminToken", newAccessToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        
        processQueue(null, newAccessToken);
        return api(originalRequest);
        
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        processQueue(refreshError, null);
      
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        delete api.defaults.headers.common["Authorization"];
        
        
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
 
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'An unexpected error occurred';
    
    console.error('API Error:', {
      status: error.response?.status,
      message: errorMessage,
      url: originalRequest?.url,
    });
    
    return Promise.reject(error);
  }
);

export default api;