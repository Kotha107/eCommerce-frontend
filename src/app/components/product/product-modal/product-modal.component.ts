import { Component, inject, Input, OnInit } from '@angular/core';
import {
  IonIcon,
  IonTitle,
  IonHeader,
  IonButton,
  IonToolbar,
  IonContent,
  IonButtons,
  ModalController,
} from '@ionic/angular/standalone';
import { RightSidePanelComponent } from '../../right-side-panel/right-side-panel.component';
import { CartService } from 'src/app/services/cartService/cart.service';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [
    IonIcon,
    IonTitle,
    IonHeader,
    IonButton,
    IonToolbar,
    IonContent,
    IonButtons,
  ],
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss'],
})
export class ProductModalComponent implements OnInit {
  @Input() product: any;
  private modalCtrl = inject(ModalController);
  cartService = inject(CartService);

  constructor() {}

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss();
  }

  addToCart() {
  this.cartService.addCartItem(this.product);
}
}
