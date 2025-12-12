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

    console.log(`${ApiEndPoint.product}/${id}`);
    return this.http.delete(`${ApiEndPoint.product}/${id}`);
  }

  createCategory = (categoryName: string) => {
    return this.http.post(`${ApiEndPoint.createCategory}`, { name: categoryName });
  }

  allCategories = () => {
    return this.http.get(`${ApiEndPoint.allCategories}`);
  }
  deleteCategory = (id: string) => {
    return this.http.delete(`${ApiEndPoint.deleteCategory}/${id}`);
  }
}
