export interface ProductDetailsModel {
  name: string;
  price: number;
  category: string;
  description?: string;
  imageUrl: string;
  id: string;
  createdAt?: Date;
}

export interface UploadProdRespModel {
  success: boolean;
  message: string;
  data: any;
}

export interface ProductDetailsRespModel {
  success: boolean;
  message: string;
  data: ProductDetailsModel;
}

export interface AllProductsRespModel {
  success: boolean;
  message: string;
  data: ProductDetailsModel[];
}
