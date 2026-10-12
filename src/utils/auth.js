// Small helpers shared by the API calls. The token is read at call time on purpose:
// reading it once at module load meant requests sent after logging in still used the old (empty) token.

export const API_BASE = 'https://ecommerce.routemisr.com/api/v1'

export function getToken() {
  return localStorage.getItem('userToken')
}

export function authHeaders() {
  return { token: getToken() }
}

/** The user id lives in the JWT payload; the orders endpoint needs it. Returns null when the token is missing or malformed. */
export function getUserId() {
  try {
    const payload = getToken().split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(payload)).id ?? null
  } catch {
    return null
  }
}

/** A readable message for any axios error: the API's own message, a network message, or a fallback. */
export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (error?.response?.data?.message) return error.response.data.message
  if (error?.request) return 'Cannot reach the server. Check your connection and try again.'
  return fallback
}
