import { instance } from "./instance";

export const reservationsCurrentstatus = () => {
  return instance.get("/api/user/reservations/current-status");
};
export const reservationsRecent = () => {
  return instance.get("/api/user/reservations/recent");
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
