const VALID_EMAIL = "arthur@admin.com";
const VALID_PASSWORD = "Souza20122004@";

export function authenticate(email: string, password: string): boolean {
  return email === VALID_EMAIL && password === VALID_PASSWORD;
}

export function isLoggedIn(): boolean {
  return sessionStorage.getItem("notion-auth") === "true";
}

export function login() {
  sessionStorage.setItem("notion-auth", "true");
}

export function logout() {
  sessionStorage.removeItem("notion-auth");
}
