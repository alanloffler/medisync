import axios, { AxiosError, type InternalAxiosRequestConfig, type AxiosInstance } from 'axios';

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 5000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  },
);

let isRefreshing: boolean = false;
let failedQueue: any[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((error) => Promise.reject(error));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api({
          method: 'POST',
          url: '/auth/refresh',
          withCredentials: true,
        });

        processQueue(null);

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError);
        // TODO: handle logout
        //window.location.href = '/login';
        console.log('refreshError', refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export async function refreshTokens(): Promise<boolean> {
  try {
    await api({
      method: 'POST',
      url: '/auth/refresh',
      withCredentials: true,
    });

    return true;
  } catch (error) {
    console.log('Failed to refresh token: ', error);

    return false;
  }
}
