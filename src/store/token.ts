import { TOKEN_KEY } from "../utils/constants";

export function setToken(user: string) {
  localStorage.setItem(TOKEN_KEY, user);
}

export function getToken() {
  const token = localStorage.getItem(TOKEN_KEY);
  return token;
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function headerToken() {}
