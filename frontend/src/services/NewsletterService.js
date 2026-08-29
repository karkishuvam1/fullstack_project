import api from "./api";

export async function subscribeNewsletter(email) {
  const { data } = await api.post("/newsletter/subscribe", { email });
  return data;
}

export async function getAllSubscribers() {
  const { data } = await api.get("/newsletter/all");
  return data;
}
