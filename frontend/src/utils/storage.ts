// Local storage keys
const TOKEN_KEY = 'edu_app_token';
const USER_KEY = 'edu_app_user';

// Functions to manage authentication tokens
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Functions to manage user data
export const setUser = (user: any): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): any | null => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

// Function to clear all authentication data
export const clearAuthData = (): void => {
  removeToken();
  removeUser();
};