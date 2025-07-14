export const login = (token) => {
    localStorage.setItem('usersdatatoken', token)
  }
  
  export const logout = () => {
    localStorage.removeItem('usersdatatoken')
    window.location.href = window.location.origin + '/'
}
  
  export const getToken = () => {
    return localStorage.getItem('usersdatatoken')
  }
  
  export const isAuthenticated = () => {
    const token = getToken()
    return token !== null && token !== undefined
  }
  
  export const getAuthHeaders = () => {
    const token = getToken();
    if (token) {
      return { Authorization: `Bearer ${token}` };
    } else {
      return {};
    }
  }