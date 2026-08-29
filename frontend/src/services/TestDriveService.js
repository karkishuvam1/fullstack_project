import api from "./Api";

export async function bookTestDrive(bookingData, protectedRoute = false) {
  const endpoint = protectedRoute ? "/testdrive/protected" : "/testdrive";
  const response = await api.post(endpoint, bookingData);
  return response.data;
}

export async function getMyBookings() {
  const response = await api.get("/testdrive/my-bookings");
  return response.data;
}

export async function getAllBookings() {
  const response = await api.get("/testdrive/all");
  return response.data;
}

export async function updateBookingStatus(id, status) {
  const response = await api.put(`/testdrive/${id}/status`, { status });
  return response.data;
}
