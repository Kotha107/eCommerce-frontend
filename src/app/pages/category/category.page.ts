import { Component, inject, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonLabel,
} from '@ionic/angular/standalone';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { HttpClientService } from 'src/app/services/http-service/http-client.service';
import {
  AllCategoriesResponseModel,
  CategoryModel,
  CategoryResponseModel,
} from 'src/models/category.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatLabel,
    IonLabel,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
})
export class CategoryPage implements OnInit {
  private http = inject(HttpClientService);
  private fb = inject(FormBuilder);
  
  categories: CategoryModel[] = [];
  categoryForm: FormGroup;
  loading = false;

  constructor() {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.http.allCategories().subscribe({
      next: (res: AllCategoriesResponseModel) => {
        this.categories = res.data;
      },
      error: (err) => {
        console.error('Failed to load categories:', err);
        alert('Failed to load categories');
      },
    });
  }

  createCategory() {
    if (this.categoryForm.invalid) {
      alert('Please enter a valid category name (at least 2 characters)');
      return;
    }

    this.loading = true;
    const categoryData = this.categoryForm.value;

    this.http.createCategory(categoryData).subscribe({
      next: (res: CategoryResponseModel) => {
        this.loading = false;
        this.categoryForm.reset();
        this.loadCategories();
        alert('Category created successfully!');
      },
      error: (err) => {
        this.loading = false;
        console.error('Failed to create category:', err);
        alert('Failed to create category');
      },
    });
  }

  deleteCategory(id: string) {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    this.http.deleteCategory(id).subscribe({
      next: () => {
        this.categories = this.categories.filter(
          (category) => category.id !== id
        );
        alert('Category deleted successfully!');
      },
      error: (err) => {
        console.error('Failed to delete category:', err);
        alert('Failed to delete category. It may be in use by products.');
      },
    });
  }
}