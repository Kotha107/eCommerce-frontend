import { Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  ModalController,
} from '@ionic/angular/standalone';
import { HttpClientService } from '../services/http-service/http-client.service';
import {
  AllProductsResponseModel,
  ProductDetailsModel,
} from 'src/models/product.model';
import { ProductModalComponent } from '../components/product/product-modal/product-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage {
  private http = inject(HttpClientService);
  private modalCtrl = inject(ModalController);

  products: ProductDetailsModel[] = [];
  constructor() {}
  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.http.allProducts().subscribe((res: AllProductsResponseModel) => {
      this.products = res.data;
      console.log('Products loaded: ', res);
    });
  }

  deleteProduct(prodId: string) {
    this.http.deleteProduct(prodId).subscribe({
      next: () => {
        this.products = this.products.filter((prod) => prod.id !== prodId);
        this.loadProducts();
      },
    });
  }

    async openProductModal(product: any) {
    const modal = await this.modalCtrl.create({
      component: ProductModalComponent,
      componentProps: {
        product: product
      },
      cssClass: 'product-modal'
    });

    await modal.present();
  }
}
