import api from "./Api";

// Admin Dashboard
export async function getDashboardStats() {
  const response = await api.get("/admin/stats");
  return response.data;
}

// User Profile (for current user)
export async function getUserProfile() {
  const response = await api.get("/users/profile");
  return response.data;
}

export async function updateUserProfile(profileData) {
  const response = await api.put("/users/profile", profileData);
  return response.data;
}

export async function updateUserPassword(passwordData) {
  const response = await api.put("/users/profile/password", passwordData);
  return response.data;
}

// Admin Users
export async function getAllUsers() {
  const response = await api.get("/users");
  return response.data;
}

export async function updateUserRole(id, role) {
  const response = await api.put(`/users/${id}/role`, { role });
  return response.data;
}

export async function deleteUser(id) {
  const response = await api.delete(`/users/${id}`);
  return response.data;
}

// Orders
export async function getAllOrders(params = {}) {
  const response = await api.get("/orders/all", { params });
  return response.data;
}

export async function updateOrderStatus(id, status) {
  const response = await api.put(`/orders/${id}/status`, { status });
  return response.data;
}

export async function deleteOrder(id) {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
}

export async function createOrder(orderData) {
  const response = await api.post("/orders", orderData);
  return response.data;
}

export async function getMyOrders() {
  const response = await api.get("/orders/my-orders");
  return response.data;
}
