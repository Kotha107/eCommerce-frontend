import { AsyncPipe, DecimalPipe } from '@angular/common';
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
import { ModalController } from '@ionic/angular/standalone';
import { CheckoutModalComponent } from '../checkout-modal/checkout-modal.component';

@Component({
  standalone: true,
  selector: 'app-right-side-panel',
  templateUrl: './right-side-panel.component.html',
  styleUrls: ['./right-side-panel.component.scss'],
  imports: [AsyncPipe, DecimalPipe],
})
export class RightSidePanelComponent implements OnInit {
  cartService = inject(CartService);
  private modalCtrl = inject(ModalController);

  @Input() mode!: 'upload' | 'cart';
  @HostBinding('class.panel-open')
  cartItems = this.cartService.getCartItems();
  isOpen = this.cartService.getPanelState();

  totalAmount = this.cartService.getTotalAmount();

  constructor() {}

  ngOnInit() {}
  async checkout() {
    const modal = await this.modalCtrl.create({
      component: CheckoutModalComponent,
      cssClass: 'checkout-modal',
    });

    await modal.present();
  }

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
