import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersRoutes } from './user.routing.module';
import { Landing } from './landing/landing';
import { Home } from './home/home';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(UsersRoutes),
    RouterOutlet,
    ReactiveFormsModule,
    Home
  ],
  declarations: [

  ],
  exports: [],
})
export class UsersModule {}