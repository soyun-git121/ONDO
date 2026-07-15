/** Order DTO — api.md §4와 1:1. 실결제 없음, PENDING까지. */

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PREPARING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "결제 대기",
  PAID: "결제 완료",
  PREPARING: "상품 준비 중",
  SHIPPED: "배송 중",
  DELIVERED: "배송 완료",
  CANCELLED: "취소됨",
};

export interface OrderCreateRequest {
  ordererName: string;
  phone: string;
  email: string;
  zipcode: string;
  address: string;
  addressDetail: string;
  memo: string;
  items: { productId: number; quantity: number }[];
}

export interface OrderCreateResponse {
  orderNumber: string;
  totalAmount: number;
  status: OrderStatus;
}

export interface OrderLookupResponse {
  orderNumber: string;
  status: OrderStatus;
  ordererName: string;
  totalAmount: number;
  createdAt: string;
  items: {
    productName: string;
    artisanName: string;
    price: number;
    quantity: number;
  }[];
}
