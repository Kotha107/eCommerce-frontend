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
    FormsModule,
    MatInputModule,
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
  isEditMode = false;
  editingCategoryId: string | null = null;

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

  editCategory(category: CategoryModel) {
    this.isEditMode = true;
    this.editingCategoryId = category.id!;
    this.categoryForm.patchValue({
      name: category.name,
    });
  }

  cancelEdit() {
    this.isEditMode = false;
    this.editingCategoryId = null;
    this.categoryForm.reset();
  }
  saveCategory() {
    if (this.categoryForm.invalid) {
      alert('Please enter a valid category name');
      return;
    }

    this.loading = true;
    const categoryData = this.categoryForm.value;

    if (this.isEditMode && this.editingCategoryId) {
      this.http.updateCategory(this.editingCategoryId, categoryData).subscribe({
        next: () => this.finalizeAction('Category updated successfully!'),
        error: (err) => this.handleError(err, 'update'),
      });
    } else {
      this.http.createCategory(categoryData).subscribe({
        next: () => this.finalizeAction('Category created successfully!'),
        error: (err) => this.handleError(err, 'create'),
      });
    }
  }

  private finalizeAction(message: string) {
    this.loading = false;
    alert(message);
    this.cancelEdit();
    this.loadCategories();
  }

  private handleError(err: any, action: string) {
    this.loading = false;
    console.error(`Failed to ${action} category:`, err);
    alert(`Failed to ${action} category`);
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
