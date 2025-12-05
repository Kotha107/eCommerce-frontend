import axios from 'axios';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import {
  ProductDetailsModel,
  UploadProdRespModel,
  AllProductsRespModel,
  ProductDetailsRespModel,
} from 'src/models/product.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  private http = inject(HttpClient);

  uploadImage(file: File): Observable<UploadProdRespModel> {
    const form = new FormData();
    form.append('image', file);

    return this.http.post<UploadProdRespModel>(
      `${environment.BASE_URL}/upload`,
      form
    );
  }

  createProduct(
    product: ProductDetailsModel
  ): Observable<ProductDetailsRespModel> {
    return this.http.post<ProductDetailsRespModel>(
      `${environment.BASE_URL}/products`,
      product
    );
  }

  allProducts(): Observable<AllProductsRespModel> {
    return this.http.get<AllProductsRespModel>(
      `${environment.BASE_URL}/products`
    );
  }
  deleteProduct(id: string) {
    return this.http.delete(`${environment.BASE_URL}/products/${id}`);
  }
}
