
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

const userApi = axios.create({
    baseURL: import.meta.env.VITE_USER_URL, // Use USER_URL instead of ADMIN_URL
    withCredentials: true
});

userApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // Use "token" instead of "adminToken"
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

userApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(userApi(originalRequest));
                        },
                        reject: (err) => reject(err)
                    });
                });
            }

            isRefreshing = true;

            try {
                const refreshResponse = await axios.post(
                    `${import.meta.env.VITE_USER_URL}refresh-token`,
                    {},
                    { withCredentials: true }
                );
                const newAccessToken = refreshResponse.data.token;

                localStorage.setItem("token", newAccessToken);
                userApi.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

                processQueue(null, newAccessToken);
                return userApi(originalRequest);
                
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/user/login";
                return Promise.reject(refreshError);
                
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default userApi;