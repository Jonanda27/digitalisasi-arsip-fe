const KEY = "e_arsip_auth";

export function saveAuth(payload) {
  localStorage.setItem(KEY, JSON.stringify(payload));
}

export function getAuth() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(KEY);
}

export function getToken() {
  return getAuth()?.token || null;
}


export function getRole() {
  return getAuth()?.user?.role || null;
}
