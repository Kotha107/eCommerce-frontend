export interface SaleItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}


export interface CustomerResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    phone: string;
    email?: string;
    totalSpent: number;
    totalOrders: number;
  };
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


export interface SaleModel {
  customerId: string;
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: string;
  createdAt: Date;
}