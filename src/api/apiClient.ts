import axios from 'axios'
import type { AxiosError, AxiosResponse } from 'axios'
import { getToken, removeToken } from '@/api/auth'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const isBrowser = typeof window !== 'undefined'

axios.defaults.baseURL = BASE_URL
axios.defaults.headers.common['Content-Type'] = 'application/json'

axios.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (!isBrowser) {
      console.info('[apiClient] request interceptor on server; token is', token)
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

axios.interceptors.response.use(
  (response) => {
    if (response.status === 204) {
      return { ...response, data: undefined }
    }
    return response
  },
  (error: AxiosError) => {
    let message = `API Error: ${error.message}`

    if (error.response) {
      if (error.response.status === 401) {
        message = 'Unauthorized. Logging out.'
        removeToken()
        if (isBrowser) {
          window.location.href = '/login'
        } else {
          console.info('[apiClient] 401 on server; skipping redirect to /login')
        }
      } else {
        const errorData = error.response.data as { detail?: string }
        message =
          errorData?.detail ||
          `API Error: ${error.response.status} ${error.response.statusText}`
      }
    }

    return Promise.reject(new Error(message))
  },
)

async function client<T>(request: Promise<AxiosResponse<T>>): Promise<T> {
  try {
    const response = await request
    return response.data
  } catch (error) {
    throw error
  }
}

export const apiClient = {
  get: <T>(endpoint: string) => client<T>(axios.get<T>(endpoint)),

  post: <T>(endpoint: string, payload: unknown) =>
    client<T>(axios.post<T>(endpoint, payload)),

  put: <T>(endpoint: string, payload: unknown) =>
    client<T>(axios.put<T>(endpoint, payload)),

  delete: <T>(endpoint: string) => client<T>(axios.delete<T>(endpoint)),
}