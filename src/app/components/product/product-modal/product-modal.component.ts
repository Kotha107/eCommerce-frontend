import { Component, inject, Input, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonModal,
  ModalController,
  IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonModal,
    IonIcon
  ],
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss'],
})
export class ProductModalComponent implements OnInit {
  @Input() product: any;
  private modalCtrl = inject(ModalController);

  constructor() {}

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss();
  }
}
