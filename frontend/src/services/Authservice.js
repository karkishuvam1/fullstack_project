import api from "./api";

export async function registerUser(userData) {
  const { data } = await api.post("/auth/register", userData);
  return data;
}

export async function loginUser(credentials) {
  const { data } = await api.post("/auth/login", credentials);
  return data;
}

export async function getMe() {
  const { data } = await api.get("/auth/me");
  return data;
}

export async function updateProfile(profileData) {
  const { data } = await api.put("/auth/profile", profileData);
  return data;
}