const BASE_URL = '/api/auth'

async function parseJsonResponse(response) {
  const text = await response.text()
  if (!text) {
    return {}
  }

  try {
    return JSON.parse(text)
  } catch (error) {
    return { message: text }
  }
}

async function handleResponse(response) {
  const data = await parseJsonResponse(response)
  if (!response.ok) {
    return { success: false, message: data.message || `Request failed (${response.status})` }
  }
  return { success: true, ...data }
}

export async function register(name, email, password) {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    return await handleResponse(response)
  } catch (error) {
    return { success: false, message: error.message || 'Network error' }
  }
}

export async function login(email, password) {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    return await handleResponse(response)
  } catch (error) {
    return { success: false, message: error.message || 'Network error' }
  }
}

export async function logout(token) {
  try {
    await fetch(`${BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
    })
    return { success: true }
  } catch (error) {
    return { success: false, message: error.message || 'Network error' }
  }
}

export async function getCurrentUser(token) {
  try {
    const response = await fetch(`${BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
    })
    return await handleResponse(response)
  } catch (error) {
    return { success: false, message: error.message || 'Network error' }
  }
}
