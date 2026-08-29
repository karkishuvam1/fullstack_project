import api from "./Api";

export async function registerUser({ name, email, password, phone }) {
  const response = await api.post("/auth/register", { name, email, password, phone });
  return response.data;
}

export async function loginUser({ email, password }) {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
}

export async function adminLoginUser({ email, password }) {
  const response = await api.post("/auth/admin/login", { email, password });
  return response.data;
}