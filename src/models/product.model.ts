export interface ProductDetailsModel {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  imageUrl: string;
  createdAt?: Date;
}

export interface UploadProductResponseModel {
  success: boolean;
  message: string;
  data: any;
}

export interface ProductDetailsResponseModel {
  success: boolean;
  message: string;
  data: ProductDetailsModel;
}

export interface AllProductsResponseModel {
  success: boolean;
  message: string;
  data: ProductDetailsModel[];
}
