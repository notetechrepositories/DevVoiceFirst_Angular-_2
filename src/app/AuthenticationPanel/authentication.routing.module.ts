import { Routes } from '@angular/router';
import { Login } from './login/login';
import { CompanyRegistration } from './company-registration/company-registration';
import { UserRegistration } from './user-registration/user-registration';

export const AuthRoutes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full' 
  },
  {
    path:'login',
    component:Login
  },
  {
    path:'company-registration',
    component:CompanyRegistration
  },
  {
    path:'user-registration',
    component:UserRegistration
  },
  
];