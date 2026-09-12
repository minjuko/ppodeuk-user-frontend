import { instance } from "./instance";

export const reservationsCurrentstatus = (selectedAt) => {
  return instance.get("/api/user/reservations/current-status", {
    params: selectedAt ? { "selected-at": selectedAt } : undefined,
  });
};
export const reservationsRecent = (selectedAt) => {
  return instance.get("/api/user/reservations/recent", {
    params: selectedAt ? { "selected-at": selectedAt } : undefined,
  });
};

export const cancelReservation = (reservation_id) => {
  return instance.delete(`/api/user/reservations/${reservation_id}`);
};

export const modifyReservation = (reservation_id, startTime, endTime) => {
  return instance.put(`/api/user/reservations/${reservation_id}`, {
    startTime,
    endTime,
  });
};
