import {
  FormGroup,
  Validators,
  FormBuilder,
  FormsModule,
} from '@angular/forms';
import {
  IonTitle,
  IonHeader,
  IonContent,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';
import { Component, inject, OnInit } from '@angular/core';
import { HttpClientService } from 'src/app/services/http-service/http-client.service';
import { AllProductsResponseModel, ProductDetailsModel } from 'src/models/product.model';
import { CategoryModel } from 'src/models/category.model';
import { RightSidePanelComponent } from 'src/app/components/right-side-panel/right-side-panel.component';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
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
  selectedFile: File | null = null;

  constructor() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
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

  upload() {
    if (!this.selectedFile) return;
    this.loading = true;

    this.http.uploadImage(this.selectedFile).subscribe((res) => {
      this.imageUrl = res.data.imageUrl;

      const productData = {
        ...this.productForm.value,
        imageUrl: this.imageUrl,
      };

      this.http.createProduct(productData).subscribe((res) => {
        console.log(res);
      });
      this.loadProducts();
      this.loading = false;
      this.productForm.reset();
      this.selectedFile = null;
    });
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
  loadCategories(){

  };
  
}
