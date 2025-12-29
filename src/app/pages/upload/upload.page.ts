import {
  FormGroup,
  Validators,
  FormBuilder,
  FormsModule,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Component, inject, OnInit } from '@angular/core';
import { HttpClientService } from 'src/app/services/http-service/http-client.service';
import {
  ProductDetailsModel,
  AllProductsResponseModel,
} from 'src/models/product.model';
import { IonicModule } from '@ionic/angular';
import { CategoryModel } from 'src/models/category.model';
import { RightSidePanelComponent } from 'src/app/components/right-side-panel/right-side-panel.component';
import { IonIcon } from '@ionic/angular/standalone';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonicModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    RightSidePanelComponent,
  ],
})
export class UploadPage implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClientService);

  loading = false;
  productForm: FormGroup;
  products: ProductDetailsModel[] = [];
  categories: CategoryModel[] = [];
  imageUrl!: string;
  isEditMode = false;
  editingProductId: string | null = null;
  selectedFile: File | null = null;

  constructor() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      unit: [''],
      discountPercent: [0],
      categoryName: [''],
      description: [''],
    });
  }
  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  editProduct(product: any) {
    this.isEditMode = true;
    this.editingProductId = product.id;
    this.imageUrl = product.imageUrl; // Keep existing image URL

    this.productForm.patchValue({
      name: product.name,
      price: product.price,
      unit: product.unit,
      categoryName: product.categoryName || '',
      discountPercent: product.discountPercent || 0,
      description: product.description,
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.isEditMode = false;
    this.editingProductId = null;
    this.productForm.reset();
    this.selectedFile = null;
  }

  upload() {
    this.loading = true;

    if (this.selectedFile) {
      this.http.uploadImage(this.selectedFile).subscribe((res) => {
        this.imageUrl = res.data.imageUrl;
        this.saveProductData();
      });
    } else if (this.isEditMode) {
      this.saveProductData();
    }
  }

  private saveProductData() {
    const productData = {
      ...this.productForm.value,
      imageUrl: this.imageUrl,
    };

    if (this.isEditMode && this.editingProductId) {
      this.http
        .updateProduct(this.editingProductId, productData)
        .subscribe(() => {
          this.completeAction('Product updated successfully');
        });
    } else {
      this.http.createProduct(productData).subscribe(() => {
        this.completeAction('Product created successfully');
      });
    }
  }

  private completeAction(message: string) {
    this.loadProducts();
    this.loading = false;
    this.cancelEdit();
  }
  loadProducts() {
    this.http.allProducts().subscribe((res: AllProductsResponseModel) => {
      this.products = res.data;
    });
  }

  deleteProduct(prodId: string) {
    this.http.deleteProduct(prodId).subscribe({
      next: () => {
        this.products = this.products.filter((prod) => prod.id !== prodId);
        this.loadProducts();
      },
    });
  }
  loadCategories() {
    this.http.allCategories().subscribe((res) => {
      this.categories = res.data;
    });
  }
  deleteCategory(id: string) {
    this.http.deleteCategory(id).subscribe({
      next: () => {
        this.categories = this.categories.filter((cat) => cat.id !== id);
        this.loadCategories();
      },
    });
  }
}
