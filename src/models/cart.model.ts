import { ProductDetailsModel } from './product.model';
export interface CartItem extends ProductDetailsModel {
  quantity: number;
  finalPrice: number;
}