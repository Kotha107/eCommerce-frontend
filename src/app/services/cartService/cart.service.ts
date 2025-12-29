import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductDetailsModel } from 'src/models/product.model';
import { CartItem } from 'src/models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private panelOpenState = new BehaviorSubject<boolean>(true);

  private totalAmount = new BehaviorSubject<number>(0);

  getCartItems() {
    return this.cartItems.asObservable();
  }
  getPanelState() {
    return this.panelOpenState.asObservable();
  }
  getTotalAmount() {
    return this.totalAmount.asObservable();
  }

  //  Calculate Total
  calculateTotal(items: CartItem[]) {
    const total = items.reduce(
      (sum, item) => sum + item.finalPrice * item.quantity,
      0
    );

    this.totalAmount.next(total);
  }

  addCartItem(product: ProductDetailsModel) {
    const currentItems = this.cartItems.value;

    const existingItem = currentItems.find((item) => item.id === product.id);

    const discount = product.discountPercent || 0;
    const finalPrice = product.price - (product.price * discount) / 100;

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      const newItem: CartItem = {
        id: product.id!,
        categoryId: product.categoryId!,
        category: product.category!,
        name: product.name,
        price: product.price,
        unit: product.unit,
        discountPercent: discount,
        finalPrice: Math.round(finalPrice),
        quantity: 1,
        imageUrl: product.imageUrl,
      };

      currentItems.push(newItem);
    }

    this.cartItems.next([...currentItems]);
    this.calculateTotal(currentItems);
    this.panelOpenState.next(true);
  }

  removeCartItem(product: ProductDetailsModel) {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.filter((item) => item.id !== product.id);

    this.cartItems.next(updatedItems);
    this.calculateTotal(updatedItems);
  }

  decreaseCartItem(product: ProductDetailsModel) {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find((item) => item.id === product.id);

    if (existingItem) {
      if (existingItem.quantity > 1) {
        existingItem.quantity -= 1;
        this.cartItems.next([...currentItems]);
      } else {
        this.removeCartItem(product);
        return;
      }
      this.calculateTotal(this.cartItems.value);
    }
  }

  clearCart() {
    this.cartItems.next([]);
    this.totalAmount.next(0);
  }

  closePanel() {
    this.panelOpenState.next(false);
  }

  togglePanel() {
    this.panelOpenState.next(!this.panelOpenState.value);
  }
}
