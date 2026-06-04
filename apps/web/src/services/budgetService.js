const BASE_URL = '/api/budgets'

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

export async function getBudgets(token) {
  try {
    const response = await fetch(BASE_URL, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
    })
    const result = await handleResponse(response)
    return {
      success: result.success,
      data: result.data || [],
      message: result.message,
    }
  } catch (error) {
    return { success: false, message: error.message || 'Network error', data: [] }
  }
}

export async function createBudget(token, category, amount, month, year) {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({ category, amount: Number(amount), month: Number(month), year: Number(year) }),
    })
    const result = await handleResponse(response)
    return {
      success: result.success,
      data: result.data,
      message: result.message,
    }
  } catch (error) {
    return { success: false, message: error.message || 'Network error' }
  }
}

export async function updateBudget(token, id, updates) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(updates),
    })
    const result = await handleResponse(response)
    return {
      success: result.success,
      data: result.data,
      message: result.message,
    }
  } catch (error) {
    return { success: false, message: error.message || 'Network error' }
  }
}

export async function deleteBudget(token, id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
    })
    const result = await handleResponse(response)
    return {
      success: result.success,
      message: result.message,
    }
  } catch (error) {
    return { success: false, message: error.message || 'Network error' }
  }
}
