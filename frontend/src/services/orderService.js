import api from "./api";

export async function createOrder(orderData) {
  const { data } = await api.post("/orders", orderData);
  return data;
}

export async function getMyOrders() {
  const { data } = await api.get("/orders/my-orders");
  return data;
}

export async function getAllOrders(params = {}) {
  const { data } = await api.get("/orders/all", { params });
  return data;
}

export async function getOrderById(id) {
  const { data } = await api.get(`/orders/${id}`);
  return data;
}

export async function updateOrderStatus(id, status) {
  const { data } = await api.put(`/orders/${id}/status`, { status });
  return data;
}
