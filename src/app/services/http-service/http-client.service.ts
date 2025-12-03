import { Injectable } from '@angular/core';
import axios from 'axios'
import { environment } from 'src/environments/environment';
import { ProductDetailsModel } from 'src/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
    async uploadImage(file: File) {
    const form = new FormData();
    form.append("image", file);

    const res = await axios.post(`${environment.BASE_URL}/upload`, form);
    return res.data;  
  }

  async createProduct(product: ProductDetailsModel) {
    const res = await axios.post(`${environment.BASE_URL}/products`, product);
    console.log("createProduct response:", res.data);
    return res.data;
  }

  async allProducts() {
    const res = await axios.get(`${environment.BASE_URL}/products`);
    return res.data.data;
  }
  
}
