export const apiCall = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('auth_token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    // Try to get error details from response body
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage += ` - ${errorData.error}`;
      }
      if (errorData.details) {
        errorMessage += ` - ${errorData.details.join('; ')}`;
      }
    } catch (parseError) {
      // Couldn't parse error response, use status only
    }
    throw new Error(errorMessage);
  }
  
  return response.json();
};
