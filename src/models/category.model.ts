export interface CategoryModel {
  id: string;
  name: string;
  createdAt?: Date;
}
export interface AllCategoriesResponseModel {
  success: boolean;
  message: string;
  data: CategoryModel[];
}
export interface CategoryResponseModel {
  success: boolean;
  message: string;
  data: CategoryModel;
}