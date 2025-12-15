import axios from 'axios';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import {
  ProductDetailsModel,
  UploadProductResponseModel,
  ProductDetailsResponseModel,
  AllProductsResponseModel,
} from 'src/models/product.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiEndPoint } from './endPoints';
import { AllCategoriesResponseModel, CategoryModel, CategoryResponseModel } from 'src/models/category.model';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  private http = inject(HttpClient);

  uploadImage =(file: File): Observable<UploadProductResponseModel> =>{
    const form = new FormData();
    form.append('image', file);

    return this.http.post<UploadProductResponseModel>(
      ApiEndPoint.upload,
      form
    );
  }

  createProduct = (
    product: ProductDetailsModel
  ): Observable<ProductDetailsResponseModel>=> {
    return this.http.post<ProductDetailsResponseModel>(
      ApiEndPoint.product,
      product
    );
  }

  allProducts = (): Observable<AllProductsResponseModel> => {
    return this.http.get<AllProductsResponseModel>(
      ApiEndPoint.product
    );
  }
  deleteProduct =(id: string)=> {
    return this.http.delete(`${ApiEndPoint.product}/${id}`);
  }

  createCategory = (category: CategoryModel):Observable<CategoryResponseModel> => {
    return this.http.post<CategoryResponseModel>(`${ApiEndPoint.createCategory}`, category);
  }

  allCategories = () : Observable<AllCategoriesResponseModel> => {
    return this.http.get<AllCategoriesResponseModel>(`${ApiEndPoint.allCategories}`);
  }
  deleteCategory = (id: string) => {
    return this.http.delete(`${ApiEndPoint.deleteCategory}/${id}`);
  }
}
