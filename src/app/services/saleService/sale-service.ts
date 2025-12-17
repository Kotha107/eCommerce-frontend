import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { HttpClientService } from '../http-service/http-client.service';
import { SaleItem } from 'src/models/sale.model';

export interface CheckoutData {
  customerName: string;
  customerPhone: string;
  items: SaleItem[];
  totalAmount: number;
  cashGiven: number;
}

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private api = inject(HttpClientService);

  /**
   * Process complete checkout: create/get customer, then create sale
   */
  processCheckout(checkoutData: CheckoutData): Observable<any> {
    // Step 1: Create or get customer
    const customerPayload = {
      name: checkoutData.customerName,
      phone: checkoutData.customerPhone,
    };

    // Step 2: Chain the customer creation with sale creation
    return this.api.createOrGetCustomer(customerPayload).pipe(
      switchMap((customerResponse) => {
        // Step 3: Create sale with customer ID
        const salePayload = {
          customerId: customerResponse.data.id,
          items: checkoutData.items,
          totalAmount: checkoutData.totalAmount,
          paymentMethod: 'cash',
        };

        return this.api.createSale(salePayload);
      })
    );
  }

  /**
   * Calculate change amount
   */
  calculateChange(cashGiven: number, totalAmount: number): number {
    return cashGiven - totalAmount;
  }

  /**
   * Validate checkout data
   */
  validateCheckout(
    customerName: string,
    cashGiven: number,
    totalAmount: number
  ): { valid: boolean; error?: string } {
    if (!customerName || customerName.trim() === '') {
      return { valid: false, error: 'Please enter customer name' };
    }

    if (cashGiven < totalAmount) {
      return { valid: false, error: 'Insufficient cash' };
    }

    return { valid: true };
  }
}