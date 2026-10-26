/** Reservation interval sent to payment calculation, ready, and approval APIs. */
export interface ReservationRangeDto {
  startTime: string;
  endTime: string;
}

export interface ReservationSaveDto extends ReservationRangeDto {
  bayId: number;
}

export interface PaymentCalculationResponse {
  price: number;
}

export interface KakaoReadyRequestDto {
  cid: string;
  partner_order_id: string;
  partner_user_id: string;
  item_name: string;
  quantity: number;
  total_amount: number;
  tax_free_amount: number;
}

export interface PaymentReadyRequestDto {
  requestDto: KakaoReadyRequestDto;
  saveDTO: ReservationSaveDto;
}

export interface PaymentReadyResponse {
  tid: string;
  next_redirect_pc_url?: string;
  next_redirect_mobile_url?: string;
}

export interface PaymentApprovalRequestDto {
  cid: string;
  tid: string;
  partner_order_id: string;
  partner_user_id: string;
  pg_token: string;
}

export interface PaymentApproveRequestDto {
  payApprovalRequestDTO: PaymentApprovalRequestDto;
  saveDTO: ReservationSaveDto;
}

export interface PaymentApprovalResponse {
  reservation: {
    time: { start: string; end: string };
    price: number;
  };
  carwash: {
    name: string;
    location: { latitude: number; longitude: number };
  };
}

export interface ApiEnvelope<T> {
  success?: boolean;
  response: T;
  error?: { code?: string | number; message?: string } | null;
}

export type Identifier = string | number;

export const isPaymentCalculationResponse = (
  value: unknown,
): value is PaymentCalculationResponse =>
  typeof value === "object" &&
  value !== null &&
  "price" in value &&
  typeof value.price === "number" &&
  Number.isFinite(value.price);

export const isPaymentReadyResponse = (
  value: unknown,
): value is PaymentReadyResponse =>
  typeof value === "object" &&
  value !== null &&
  "tid" in value &&
  typeof value.tid === "string" &&
  value.tid.trim().length > 0;

export const isPaymentApprovalResponse = (
  value: unknown,
): value is PaymentApprovalResponse => {
  if (typeof value !== "object" || value === null || !("reservation" in value) || !("carwash" in value)) return false;
  const reservation = value.reservation;
  const carwash = value.carwash;
  return (
    typeof reservation === "object" && reservation !== null &&
    "time" in reservation && typeof reservation.time === "object" && reservation.time !== null &&
    "start" in reservation.time && typeof reservation.time.start === "string" &&
    "end" in reservation.time && typeof reservation.time.end === "string" &&
    "price" in reservation && typeof reservation.price === "number" && Number.isFinite(reservation.price) &&
    typeof carwash === "object" && carwash !== null && "name" in carwash && typeof carwash.name === "string" &&
    "location" in carwash && typeof carwash.location === "object" && carwash.location !== null &&
    "latitude" in carwash.location && typeof carwash.location.latitude === "number" && Number.isFinite(carwash.location.latitude) &&
    "longitude" in carwash.location && typeof carwash.location.longitude === "number" && Number.isFinite(carwash.location.longitude)
  );
};
