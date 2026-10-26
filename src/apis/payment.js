// @ts-check
import { instance } from "./instance";
/** @typedef {import("./paymentTypes").PaymentReadyRequestDto} PaymentReadyRequestDto */
/** @typedef {import("./paymentTypes").PaymentApproveRequestDto} PaymentApproveRequestDto */
/** @typedef {import("./paymentTypes").ApiEnvelope<import("./paymentTypes").PaymentReadyResponse>} PaymentReadyEnvelope */
/** @typedef {import("./paymentTypes").ApiEnvelope<import("./paymentTypes").PaymentApprovalResponse>} PaymentApprovalEnvelope */

/** @param {PaymentReadyRequestDto} data
 * @returns {import("axios").AxiosPromise<PaymentReadyEnvelope>}
 */
export const pgpayment = (data) => {
  return instance.post(`/api/user/payment/ready`, data, {
    withCredentials: true,
  });
};

/** @param {PaymentApproveRequestDto} data
 * @returns {import("axios").AxiosPromise<PaymentApprovalEnvelope>}
 */
export const pgapprove = (data) => {
  return instance.post(`/api/user/payment/approve`, data);
};
