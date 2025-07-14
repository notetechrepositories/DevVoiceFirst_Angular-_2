import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-registration',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './user-registration.html',
  styleUrl: './user-registration.css'
})
export class UserRegistration {
  registrationForm!:FormGroup;

  constructor(private fb:FormBuilder,private router:Router){}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address1: ['', Validators.required],
      address2: [''],
      birthYear: ['', Validators.required],
      gender: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      districtPlace: ['', Validators.required],
      zipcode: ['', Validators.required]
    });
  }
  

  onSubmit() {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }
  
    console.log(this.registrationForm.value);
    this.registrationForm.reset();
    this.router.navigate(['authentication/login']);
    alert('Registration successful!');
  }
  
}
