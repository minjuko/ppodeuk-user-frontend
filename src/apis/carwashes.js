// @ts-check
import { instance } from "./instance";

/** @param {number} u_latitude @param {number} u_longitude */
export const carwashesRecommended = (u_latitude, u_longitude) => {
  return instance.get(
    `/api/open/carwashes/recommended?latitude=${u_latitude}&longitude=${u_longitude}`,
  );
};

/** @param {number} u_latitude @param {number} u_longitude */
export const carwashesNearby = (u_latitude, u_longitude) => {
  return instance.get(
    `/api/open/carwashes/nearby?latitude=${u_latitude}&longitude=${u_longitude}`,
  );
};

/** @param {Array<string | number>} keywordIds @param {number} u_latitude @param {number} u_longitude */
export const carwashesSearch = (keywordIds, u_latitude, u_longitude) => {
  return instance.get(
    `/api/open/carwashes/search?keywordIdList=${keywordIds}&latitude=${u_latitude}&longitude=${u_longitude}`,
  );
};

/** @param {string | number} carwash_id */
export const carwashesInfo = (carwash_id) => {
  return instance.get(`/api/open/carwashes/${carwash_id}/info`);
};

/** @param {string | number} carwash_id */
export const carwashesReviews = (carwash_id) => {
  return instance.get(`/api/open/carwashes/${carwash_id}/reviews`);
};

/** @typedef {import("./paymentTypes").ReservationRangeDto} ReservationRangeDto */
/** @typedef {import("./paymentTypes").ApiEnvelope<import("./paymentTypes").PaymentCalculationResponse>} PaymentCalculationEnvelope */
/** @param {number} bay_id
 * @param {ReservationRangeDto} data
 * @returns {import("axios").AxiosPromise<PaymentCalculationEnvelope>}
 */
export const calculatePayment = (bay_id, data) => {
  return instance.post(`/api/user/carwashes/${bay_id}/payment`, data);
};

/** @param {unknown} data */
export const postReviews = (data) => {
  return instance.post("/api/user/reviews", data);
};

/** @param {string | number} carwash_id */
export const carwashesBays = (carwash_id) => {
  return instance.get(`/api/open/carwashes/${carwash_id}/bays`);
};
