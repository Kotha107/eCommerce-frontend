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

  processCheckout(checkoutData: CheckoutData): Observable<any> {
    const customerPayload = {
      name: checkoutData.customerName,
      phone: checkoutData.customerPhone,
    };

    return this.api.createOrGetCustomer(customerPayload).pipe(
      switchMap((customerResponse) => {
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

  calculateChange(cashGiven: number, totalAmount: number): number {
    return cashGiven - totalAmount;
  }

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

  searchCustomerByPhone(phone: string): Observable<any> {
    return this.api.searchCustomerByPhone(phone);
  }
}
