// @ts-check
import { instance } from "./instance";
/** @typedef {import("./paymentTypes").Identifier} Identifier */
/** @typedef {import("./paymentTypes").ReservationRangeDto} ReservationRangeDto */

export const reservationsCurrentstatus = () => {
  return instance.get("/api/user/reservations/current-status");
};
export const reservationsRecent = () => {
  return instance.get("/api/user/reservations/recent");
};

/** @param {Identifier} reservation_id */
export const cancelReservation = (reservation_id) => {
  return instance.delete(`/api/user/reservations/${reservation_id}`);
};

/** @param {Identifier} reservation_id
 * @param {string} startTime
 * @param {string} endTime
 */
export const modifyReservation = (reservation_id, startTime, endTime) => {
  return instance.put(`/api/user/reservations/${reservation_id}`, {
    startTime,
    endTime,
  });
};
