import axios, { AxiosError, type InternalAxiosRequestConfig, type AxiosInstance, type AxiosResponse } from 'axios';
import i18n from '@core/i18n/i18n';
import { APP_CONFIG } from '@config/app.config';

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'x-lang': i18n.resolvedLanguage || APP_CONFIG.i18n.locale || 'es',
  },
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
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

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
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.config.url === '/auth/login') {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
      console.log('Unauthorized at response interceptor', error.response?.status);
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            console.log('Retrying request after token refresh');
            return api(originalRequest);
          })
          .catch((error) => {
            console.error('Failed to retry request after token refresh:', error);
            return Promise.reject(error);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('Attempting to refresh token');

        const refreshResponse = await axios({
          method: 'POST',
          url: `${import.meta.env.VITE_API_URL}/auth/refresh`,
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'x-lang': i18n.resolvedLanguage || APP_CONFIG.i18n.locale || 'es',
          },
        });

        console.log('Token refresh successful:', refreshResponse.status);

        processQueue(null);

        return api(originalRequest);
      } catch (refreshError) {
        const refreshErrorTyped = refreshError as AxiosError;
        console.error('Token refresh failed:', refreshErrorTyped.status);

        processQueue(refreshErrorTyped);

        if (refreshErrorTyped.response?.status === 401) {
          setTimeout(() => window.location.replace('/'), 3000);
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
