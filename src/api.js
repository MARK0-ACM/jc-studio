export const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

export const apiUrl = (path = '') => {
  const p = String(path).replace(/^\//, '');
  return `${API_BASE}/${p}`;
};

