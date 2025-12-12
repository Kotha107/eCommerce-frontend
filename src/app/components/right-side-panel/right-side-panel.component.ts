import { AsyncPipe } from '@angular/common';
import {
  Component,
  HostBinding,
  inject,
  Input,
  input,
  OnInit,
} from '@angular/core';
import { CartService } from 'src/app/services/cartService/cart.service';
import { ProductDetailsModel } from 'src/models/product.model';

@Component({
  standalone: true,
  selector: 'app-right-side-panel',
  templateUrl: './right-side-panel.component.html',
  styleUrls: ['./right-side-panel.component.scss'],
  imports: [AsyncPipe],
})
export class RightSidePanelComponent implements OnInit {
  cartService = inject(CartService);
  @Input() mode!: 'upload' | 'cart';
  @HostBinding('class.panel-open')

  cartItems = this.cartService.getCartItems();
  isOpen = this.cartService.getPanelState();

  constructor() {}

  ngOnInit() {}
  
  get isPanelOpen() {
    let open = false;
    this.isOpen.subscribe((val) => (open = val));
    return open;
  }

  close() {
    this.cartService.closePanel();
  }

  removeItem(item: ProductDetailsModel) {
    this.cartService.removeCartItem(item);
  }
}
