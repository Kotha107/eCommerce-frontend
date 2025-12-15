import { Component, inject } from '@angular/core';
import {
  IonTitle,
  IonHeader,
  IonToolbar,
  IonContent,
  ModalController,
  IonButtons,
  IonButton,
} from '@ionic/angular/standalone';

import { CartService } from '../services/cartService/cart.service';
import { HttpClientService } from '../services/http-service/http-client.service';
import {AllProductsResponseModel, ProductDetailsModel,} from 'src/models/product.model';
import { ProductModalComponent } from '../components/product/product-modal/product-modal.component';
import { RightSidePanelComponent } from '../components/right-side-panel/right-side-panel.component';
import { CategoryModel } from 'src/models/category.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonTitle,
    IonHeader,
    IonToolbar,
    IonContent,
    IonButtons,
    IonButton,
    RightSidePanelComponent,
  ],
})
export class HomePage {
  cartService = inject(CartService);
  private http = inject(HttpClientService);
  private modalCtrl = inject(ModalController);

  products: ProductDetailsModel[] = [];
  categories: CategoryModel[] = [];
  constructor() {}
  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.http.allProducts().subscribe((res: AllProductsResponseModel) => {
      this.products = res.data;
      console.log('Products loaded: ', res);
    });
  }
  loadCategories() {
    this.http.allCategories().subscribe((res) => {
      this.categories = res.data;
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
        product: product,
      },
      cssClass: 'product-modal',
    });

    await modal.present();
  }

  addToCart(product: any) {
    this.cartService.addCartItem(product);
  }
}
