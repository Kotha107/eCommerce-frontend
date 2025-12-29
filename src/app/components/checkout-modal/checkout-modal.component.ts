import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular/standalone';
import { DecimalPipe } from '@angular/common';
import { CartService } from 'src/app/services/cartService/cart.service';
import { CustomerModel, CustomerResponse, SaleItem } from 'src/models/sale.model';
import { SaleService } from 'src/app/services/saleService/sale-service';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  standalone: true,
  selector: 'app-checkout-modal',
  templateUrl: './checkout-modal.component.html',
  styleUrls: ['./checkout-modal.component.scss'],
  imports: [
    ReactiveFormsModule,
    DecimalPipe,
    MatInputModule,
    MatFormFieldModule,
  ],
})
export class CheckoutModalComponent implements OnInit {
  private modalCtrl = inject(ModalController);
  private cartService = inject(CartService);
  private salesService = inject(SaleService);
  private fb = inject(FormBuilder);

  cartItems$ = this.cartService.getCartItems();
  total$ = this.cartService.getTotalAmount();

  totalAmount = 0;
  suggestedCustomer: CustomerModel | null = null;
  isProcessing = false;

  checkoutForm = this.fb.group({
    name: ['', Validators.required],
    phone: [''],
    cashGiven: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit() {
    this.total$.subscribe((total) => {
      this.totalAmount = total;
    });

    this.checkoutForm
      .get('phone')
      ?.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((phone) => {
          if (phone && phone.length >= 3) {
            return this.salesService.searchCustomerByPhone(phone);
          }
          return of(null);
        })
      )
      .subscribe({
        next: (res: any) => {
          if (res && res.success) {
            this.suggestedCustomer = res.data;
          } else {
            this.suggestedCustomer = null;
          }
        },
        error: () => (this.suggestedCustomer = null),
      });
  }

  selectSuggestion() {
    if (this.suggestedCustomer) {
      this.checkoutForm.patchValue({
        name: this.suggestedCustomer.name,
        phone: this.suggestedCustomer.phone,
      });
      this.suggestedCustomer = null;
    }
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
    this.cartItems$
      .subscribe((cart) => {
        cart.forEach((item) => {
          items.push({
            productId: item.id,
            name: item.name,
            price: item.price,
            unit: item.unit,
            discountPercent: item.discountPercent,
            finalPrice: item.finalPrice,
            quantity: item.quantity,
          });
        });
      })
      .unsubscribe();

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
