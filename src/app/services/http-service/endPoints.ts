import { environment } from 'src/environments/environment.prod';

export const ApiEndPoint = {
  upload: `${environment.BASE_URL}upload`,
  product: `${environment.BASE_URL}products`,
  allProducts: `${environment.BASE_URL}products`,
  deleteProduct: `${environment.BASE_URL}products`,
  updateProduct: `${environment.BASE_URL}products`,
  createCategory: `${environment.BASE_URL}categories`,
  allCategories: `${environment.BASE_URL}categories`,
  deleteCategory: `${environment.BASE_URL}categories`,
  updatecategory: `${environment.BASE_URL}categories`,
  createSale: `${environment.BASE_URL}sale`,
  searchCustomerByPhone: `${environment.BASE_URL}customer/search`,
  createOrGetCustomer: `${environment.BASE_URL}customer`,
  
};
