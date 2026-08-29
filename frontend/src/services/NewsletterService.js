import api from "./Api";

export async function subscribeNewsletter(email) {
  const response = await api.post("/newsletter/subscribe", { email });
  return response.data;
}

export async function getSubscribers() {
  const response = await api.get("/newsletter/subscribers");
  return response.data;
}
