import axios from 'axios'
import type { AxiosResponse } from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const TOKEN_KEY = 'csm-auth-token'
const isBrowser =
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

interface TokenResponse {
  access_token: string
  token_type: string
}

export function saveToken(token: string) {
  if (!isBrowser) {
    console.info('[auth] saveToken() called on server; no-op')
    return
  }
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken(): string | null {
  if (!isBrowser) {
    console.info('[auth] getToken() called on server; returning null')
    return null
  }
  return localStorage.getItem(TOKEN_KEY)
}

export function removeToken() {
  if (!isBrowser) {
    console.info('[auth] removeToken() called on server; no-op')
    return
  }
  localStorage.removeItem(TOKEN_KEY)
}

export async function login(
  username: string,
  password: string,
): Promise<string> {
  const params = new URLSearchParams()
  params.append('username', username)
  params.append('password', password)

  try {
    const response: AxiosResponse<TokenResponse> = await axios.post(
      `${BASE_URL}/api/v1/auth/login`,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )

    const { access_token } = response.data
    if (access_token) {
      saveToken(access_token)
      return access_token
    }
    throw new Error('Login successful but no token was provided.')
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.detail || 'Invalid username or password',
      )
    }
    throw new Error('An unknown login error occurred.')
  }
}