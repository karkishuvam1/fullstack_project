import api from "./Api";

export async function getCars(category) {
  const params = category ? { params: { category } } : {};
  const response = await api.get("/cars", params);
  return response.data;
}

export async function getCarBySlug(slug) {
  const response = await api.get(`/cars/${slug}`);
  return response.data;
}

export async function createCar(carData) {
  const response = await api.post("/cars", carData);
  return response.data;
}

export async function updateCar(id, carData) {
  const response = await api.put(`/cars/${id}`, carData);
  return response.data;
}

export async function deleteCar(id) {
  const response = await api.delete(`/cars/${id}`);
  return response.data;
}
