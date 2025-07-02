import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Login } from './login/login';
import { AuthRoutes } from './authentication.routing.module';
import { CompanyRegistration } from './company-registration/company-registration';
import { UserRegistration } from './user-registration/user-registration';





@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(AuthRoutes),
    RouterOutlet,
    ReactiveFormsModule,
    Login,
    CompanyRegistration,
    UserRegistration
  ],
  declarations: [

  ],
  exports: [],
})
export class AuthModule {}