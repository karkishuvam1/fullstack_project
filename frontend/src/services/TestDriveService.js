import api from "./api";

export async function bookTestDrive(bookingData) {
  // Routes to /orders with type test-drive or /testdrive/book
  try {
    const { data } = await api.post("/orders", {
      ...bookingData,
      orderType: "test-drive",
      carId: bookingData.car,
      firstName: bookingData.name,
      notes: bookingData.message,
    });
    return data;
  } catch (err) {
    const { data } = await api.post("/testdrive/book", bookingData);
    return data;
  }
}

export async function getMyBookings() {
  try {
    const { data } = await api.get("/orders/my-orders");
    return data;
  } catch (err) {
    const { data } = await api.get("/testdrive/my-bookings");
    return data;
  }
}

export async function getAllBookings() {
  try {
    const { data } = await api.get("/orders/all");
    return data;
  } catch (err) {
    const { data } = await api.get("/testdrive/all");
    return data;
  }
}

export async function updateBookingStatus(id, status) {
  try {
    const { data } = await api.put(`/orders/${id}/status`, { status });
    return data;
  } catch (err) {
    const { data } = await api.put(`/testdrive/${id}/status`, { status });
    return data;
  }
}
