export interface SaleItem {
  productId: string;
  name: string;
  price: number;
  unit: string;
  discountPercent?: number;
  finalPrice: number;
  quantity: number;
}
export interface CustomerModel {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalSpent: number;
  totalOrders: number;
}
export interface CustomerResponse {
  success: boolean;
  data: CustomerModel
}

export interface CreateCustomerPayload {
  name: string;
  phone: string;
  email?: string;
}

export interface CreateSalePayload {
  customerId: string;
  items: SaleItem[];
  totalAmount: number;
  paymentMethod?: string;
}

export interface CreateSaleResponse {
  success: boolean;
  message: string;
  data: CreateSalePayload;
}

export interface SaleModel {
  customerId: string;
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: string;
  createdAt: Date;
}
