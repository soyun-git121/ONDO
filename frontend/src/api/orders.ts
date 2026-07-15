import { get, post } from "./client";
import type {
  OrderCreateRequest,
  OrderCreateResponse,
  OrderLookupResponse,
} from "../types/order";

export function createOrder(body: OrderCreateRequest): Promise<OrderCreateResponse> {
  return post<OrderCreateResponse>("/orders", body);
}

export function lookupOrder(orderNumber: string, phone: string): Promise<OrderLookupResponse> {
  return get<OrderLookupResponse>(`/orders/${orderNumber}`, { phone });
}
