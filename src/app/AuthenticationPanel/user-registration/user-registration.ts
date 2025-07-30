import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CountryModel, DivisionOneModel, DivisionThreeModel, DivisionTwoModel } from '../../Models/CountryModel';
import { CountryService } from '../../Service/CountryService/country-service';

@Component({
  selector: 'app-user-registration',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './user-registration.html',
  styleUrl: './user-registration.css'
})
export class UserRegistration {
  registrationForm!:FormGroup;

  countries : CountryModel [] =[];
  divisionOneList : DivisionOneModel []=[];
  divisionTwoList : DivisionTwoModel []= [];
  divisionThreeList : DivisionThreeModel [] = [];

  divisionLabels = {
    one: '',
    two: '',
    three: ''
  };

  constructor(
    private fb:FormBuilder,
    private router:Router,
    private countryService:CountryService
  ){}

  ngOnInit(): void {
    this.formInit();
    this.loadCountry();
  }

  formInit(){
    this.registrationForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: [''],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address1: ['', Validators.required],
      address2: [''],
      birthYear: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      gender: ['', Validators.required],
      country: ['', Validators.required],
      divisionOne: [''],
      divisionTwo: [''],
      divisionThree: [''],
      place: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      zipcode: ['', [Validators.required, Validators.pattern(/^\d{5,6}$/)]]
    });
  }

  loadCountry(){
    this.countryService.getActiveCountries().subscribe({
      next:res=>{
        if(res.status==200){
          this.countries=res.body.data;
        }
      },
      error:err=>{

      }
    });
  }

  onCountryChange(event: Event) {
    const eventValue = event.target as HTMLInputElement;
    const selectedCountryId = eventValue.value;
    const selectedCountry = this.countries.find(c => c.id === selectedCountryId);
  
    if (selectedCountry) {
      this.divisionLabels.one = selectedCountry.divisionOneLabel?.trim() || '';
      this.divisionLabels.two = selectedCountry.divisionTwoLabel?.trim() || '';
      this.divisionLabels.three = selectedCountry.divisionThreeLabel?.trim() || '';
  
      // Optionally reset division values
      this.registrationForm.patchValue({
        divisionOne: '',
        divisionTwo: '',
        divisionThree: ''
      });
    }

    this.countryService.getActiveDivisionOne(selectedCountryId).subscribe({
      next:res=>{
        if(res.status == 200){
          this.divisionOneList=res.body.data
        }
      },
      error:err=>{

      }
    });
  }

  onDivisionOneChange(event:Event){
    const eventValue = event.target as HTMLInputElement;
    const selectedDivisionOneId = eventValue.value;

    this.countryService.getActiveDivisionTwo(selectedDivisionOneId).subscribe({
      next:res=>{
        if(res.status == 200){
          this.divisionTwoList=res.body.data
        }
      },
      error:err=>{

      }
    });
  }

  onDivisionTwoChange(event:Event){
    const eventValue = event.target as HTMLInputElement;
    const selectedDivisionTwoId = eventValue.value;

    this.countryService.getActiveDivisionThree(selectedDivisionTwoId).subscribe({
      next:res=>{
        if(res.status == 200){
          this.divisionThreeList=res.body.data
        }
      },
      error:err=>{

      }
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
