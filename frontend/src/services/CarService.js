import api from "./api";

export async function getCars(params = {}) {
  const { data } = await api.get("/cars", { params });
  return data;
}

export async function getFeaturedCars() {
  const { data } = await api.get("/cars/featured");
  return data;
}

export async function getCarBySlug(slug) {
  const { data } = await api.get(`/cars/${slug}`);
  return data;
}

export async function createCar(carData) {
  const { data } = await api.post("/cars", carData);
  return data;
}

export async function updateCar(id, carData) {
  const { data } = await api.put(`/cars/${id}`, carData);
  return data;
}

export async function deleteCar(id) {
  const { data } = await api.delete(`/cars/${id}`);
  return data;
}

export async function addCarReview(carId, reviewData) {
  const { data } = await api.post(`/cars/${carId}/reviews`, reviewData);
  return data;
}

export async function getCarReviews(carId) {
  const { data } = await api.get(`/cars/${carId}/reviews`);
  return data;
}
