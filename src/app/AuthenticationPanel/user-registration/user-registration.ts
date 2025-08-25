import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CountryModel, DivisionOneModel, DivisionThreeModel, DivisionTwoModel } from '../../Models/CountryModel';
import { CountryService } from '../../Service/CountryService/country-service';
import { Auth } from '../../Service/AuthService/auth';
import { UtilityService } from '../../Service/UtilityService/utility-service';

@Component({
  selector: 'app-user-registration',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
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

  isgoogleAuthenticated : boolean = false;
  authenticatedUser : any ;

  years: number[] = [];

  constructor(
    private fb:FormBuilder,
    private router:Router,
    private countryService:CountryService,
    private authService:Auth,
    public utilityService:UtilityService
  ){}

  ngOnInit(): void {
    this.formInit();
    this.loadCountry();
    this.googleAuthenticationCheck();
  }

  formInit(){
    this.registrationForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: [''],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{7}$/)]],
      addressOne: ['', Validators.required],
      addressTwo: [''],
      birthYear: ['', Validators.required],
      gender: ['', Validators.required],
      country: ['', Validators.required],
      countryCode: ['',Validators.required],
      divisionOne: [''],
      divisionTwo: [''],
      divisionThree: [''],
      place: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      zipcode: ['', Validators.required]
    },{
      validators: this.passwordMatchValidator
    });


    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
      this.years.push(year);
    }
  }

  passwordMatchValidator(form: AbstractControl): null | object {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Group-level validator that checks length based on selected country
  // private mobileByCountryValidator() {
  //   return (group: AbstractControl) => {
  //     const id = group.get('countryCode')?.value;
  //     const mobile: string = group.get('mobile')?.value ?? '';
  //     const country = this.countries.find(c => c.id === id);

  //     // Clear previous group error
  //     if (group.hasError('mobileLengthMismatch')) {
  //       const currentErrors = { ...group.errors };
  //       delete currentErrors['mobileLengthMismatch'];
  //       group.setErrors(Object.keys(currentErrors).length ? currentErrors : null);
  //     }

  //     if (!country || !mobile) return null;

  //     // allow leading zeroes but enforce length
  //     if (mobile.length !== country.mobileLength) {
  //       group.setErrors({ ...(group.errors || {}), mobileLengthMismatch: true });
  //       return { mobileLengthMismatch: true };
  //     }
  //     return null;
  //   };
  // }

  googleAuthenticationCheck(){
    this.authenticatedUser =this.authService.getLoggedInUser();
    console.log(this.authenticatedUser);
    if(this.authenticatedUser){
      this.isgoogleAuthenticated = true;
      if (!this.registrationForm.contains('subject')) {
        this.registrationForm.addControl('subject', this.fb.control('', Validators.required));
      }

      this.registrationForm.get('password')?.clearValidators();
      this.registrationForm.get('confirmPassword')?.clearValidators();

      this.registrationForm.patchValue({
        firstname:this.authenticatedUser.given_name,
        lastname:this.authenticatedUser.family_name,
        email:this.authenticatedUser.email,
        subject:this.authenticatedUser.sub,
      });
    }
  }

  loadCountry(){
    this.countryService.getActiveCountries().subscribe({
      next:res=>{
        if(res.status==200){
          this.countries=res.body.data;
        }
      },
      error:err=>{
        this.utilityService.showError(err.status , err.error.message);
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
        this.utilityService.showError(err.status , err.error.message);
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
        this.utilityService.showError(err.status , err.error.message);
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
        this.utilityService.showError(err.status , err.error.message);
      }
    });
  }
  

  onRegister() {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }
    const payload=this.registrationForm.value;
    payload.birthYear = Number(payload.birthYear);
    this.authService.userRegistration(payload).subscribe({
      next:res=>{
        if(res.status==201){
          this.utilityService.success(res.body.message);
          this.registrationForm.reset();
          this.router.navigate(['authentication/login']);
        }
      },
      error:err=>{
        this.utilityService.showError(err.status , err.error.message);
      }
    });
  }

  onGoogleRegister(){
    console.log("working");
    
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }
    const payload=this.registrationForm.value;
    payload.birthYear = Number(payload.birthYear);
    console.log(payload);
    
    this.authService.googleRegistration(payload).subscribe({
      next:res=>{
        if(res.status==201){
          this.utilityService.success(res.body.message);
          this.registrationForm.reset();
          this.router.navigate(['user/home']);
        }
      },
      error:err=>{
        this.utilityService.showError(err.status , err.error.message);
      }
    });
  }
  
}
