import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { HttpClientService } from 'src/app/services/http-service/http-client.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class UploadPage implements OnInit {
  private fb = inject(FormBuilder);
  private httpservice = inject(HttpClientService);

  productForm: FormGroup;
  loading = false;
  selectedFile: File | null = null;

  constructor() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      category: [''],
      description: [''],
    });
  }
  ngOnInit(): void {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async upload() {
    if (!this.selectedFile) return;
    this.loading = true;

    try {
      const response = await this.httpservice.uploadImage(this.selectedFile);
      const imageUrl = response?.data?.imageUrl;
      console.log("response from uploadImage:", response);
      console.log("Image uploaded at URL:", imageUrl);

      if (imageUrl) {
        console.log("Image uploaded at URL:", imageUrl);
        const productData = { ...this.productForm.value, imageUrl };
        const productResp = await this.httpservice.createProduct(productData);
        console.log("Product created:", productResp);
      }
      this.productForm.reset();
      this.selectedFile = null;
    } catch (err) {
      alert('Something went wrong!');
    } finally {
      this.loading = false;
    }
  }
}
