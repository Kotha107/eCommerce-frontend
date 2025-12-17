import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular/standalone';
import { DecimalPipe } from '@angular/common';
import { CartService } from 'src/app/services/cartService/cart.service';
import { SaleItem } from 'src/models/sale.model';
import { SaleService } from 'src/app/services/saleService/sale-service';

@Component({
  standalone: true,
  selector: 'app-checkout-modal',
  templateUrl: './checkout-modal.component.html',
  styleUrls: ['./checkout-modal.component.scss'],
  imports: [ReactiveFormsModule, DecimalPipe],
})
export class CheckoutModalComponent implements OnInit {
  private modalCtrl = inject(ModalController);
  private cartService = inject(CartService);
  private salesService = inject(SaleService);
  private fb = inject(FormBuilder);

  cartItems$ = this.cartService.getCartItems();
  total$ = this.cartService.getTotalAmount();

  totalAmount = 0;
  isProcessing = false; // Add loading state

  checkoutForm = this.fb.group({
    name: ['', Validators.required],
    phone: [''],
    cashGiven: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit() {
    this.total$.subscribe((total) => {
      this.totalAmount = total;
    });
  }

  async confirmSale() {
    const formValue = this.checkoutForm.value;
    const cashGiven = formValue.cashGiven || 0;

    // Validate using service
    const validation = this.salesService.validateCheckout(
      formValue.name || '',
      cashGiven,
      this.totalAmount
    );

    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    // Prepare cart items
    const items: SaleItem[] = [];
    this.cartItems$.subscribe(cart => {
      cart.forEach(item => {
        items.push({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        });
      });
    }).unsubscribe();

    // Process checkout using service
    this.isProcessing = true;

    this.salesService
      .processCheckout({
        customerName: formValue.name!,
        customerPhone: formValue.phone || '',
        items,
        totalAmount: this.totalAmount,
        cashGiven,
      })
      .subscribe({
        next: async () => {
          this.isProcessing = false;
          this.cartService.clearCart();
          await this.modalCtrl.dismiss({ success: true });
        },
        error: (err) => {
          this.isProcessing = false;
          console.error('Sale error:', err);
          alert('Sale failed. Please try again.');
        },
      });
  }

  close() {
    this.modalCtrl.dismiss();
  }

  // Helper method to calculate change (optional, can use in template)
  get changeAmount(): number {
    const cashGiven = this.checkoutForm.value.cashGiven || 0;
    return this.salesService.calculateChange(cashGiven, this.totalAmount);
  }
}