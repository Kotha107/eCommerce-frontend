import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductDetailsModel } from 'src/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = new BehaviorSubject<ProductDetailsModel[]>([]);
  private panelOpenState = new BehaviorSubject<boolean>(true);

  getCartItems() {
    return this.cartItems.asObservable();
  }
  getPanelState() {
    return this.panelOpenState.asObservable();
  }

  addCartItem(product: ProductDetailsModel) {
    const currentItems = this.cartItems.value;
    this.cartItems.next([...currentItems, product]);
    this.panelOpenState.next(true);
  }

  removeCartItem(product: ProductDetailsModel) {
    const currentItems = [...this.cartItems.value]; 
    const index = currentItems.findIndex((item) => item.id === product.id);

    if (index > -1) {
      currentItems.splice(index, 1);
      this.cartItems.next(currentItems);
    }
  }

  clearCart() {
    this.cartItems.next([]);
  }

  closePanel() {
    this.panelOpenState.next(false);
  }

  togglePanel() {
    this.panelOpenState.next(!this.panelOpenState.value);
  }
}
