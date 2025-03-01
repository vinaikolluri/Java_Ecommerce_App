// utils/JWT_Token.js
export const saveToken = token => {
  localStorage.setItem('jwtToken', token);
};

export const getToken = () => {
  return localStorage.getItem('jwtToken');
};

export const clearToken = () => {
  localStorage.removeItem('jwtToken');
};
