import api from "./Api";

export async function getCars(category, options = {}) {
  const params = {};
  if (category && category !== "All") params.category = category;
  if (options.search) params.search = options.search;
  if (options.sort) params.sort = options.sort;
  if (options.includeInactive) params.includeInactive = options.includeInactive;

  const response = await api.get("/cars", { params });
  return response.data;
}

export async function getFeaturedCars() {
  const response = await api.get("/cars/featured");
  return response.data;
}

export async function getCarBySlug(slug) {
  const response = await api.get(`/cars/${slug}`);
  return response.data;
}

export async function getCarById(id) {
  const response = await api.get(`/cars/id/${id}`);
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
