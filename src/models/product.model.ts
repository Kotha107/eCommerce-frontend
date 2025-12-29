export interface ProductDetailsModel {
  id: string;
  categoryId? : string;
  name: string;
  price: number;
  unit: string;
  discountPercent?: number;
  category: string;
  description?: string;
  imageUrl: string;
  createdAt?: Date;
}

export interface UploadProductResponseModel {
  success: boolean;
  message: string;
  data : {
    categoryId :string,
      deleteUrl:string,
      imageUrl:string,
  }
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
