import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel } from '@ionic/angular/standalone';
import { HttpClientService } from 'src/app/services/http-service/http-client.service';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { AllCategoriesResponseModel, CategoryModel, CategoryResponseModel } from 'src/models/category.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
  standalone: true,
  imports: [FormsModule, MatLabel, MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule, IonLabel]
})
export class CategoryPage implements OnInit {
  private http = inject(HttpClientService); 
  private fb = inject(FormBuilder)
  


  categories:CategoryModel[]=[]
  categoryForm : FormGroup;
  loading= false;

  constructor() { 
    this.categoryForm  = this.fb.group({
      name :['',Validators.required]
    })
   
  }

 

  ngOnInit() {
    this.loadCategories();

  }
  loadCategories() {
    this.loading=true
    this.http.allCategories().subscribe((res : AllCategoriesResponseModel)=>{
      this.categories=res.data


    });
    this.loading=false


  }
  createCategory(){
    const categoryData = this.categoryForm.value
    this.http.createCategory(categoryData).subscribe((res)=>{
      this.loadCategories()
    })

  }
   deleteCategory(id:string){
      this.http.deleteCategory(id).subscribe( {next : ()=>{
        this.categories = this.categories.filter(category => category.id !== id)

      }})

    }

  }



