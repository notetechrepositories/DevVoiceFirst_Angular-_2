import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutes } from './admin.routing.module';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';






@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(AdminRoutes),
    RouterOutlet,
    ReactiveFormsModule,
    AdminDashboard
  ],
  declarations: [

  ],
  exports: [],
})
export class AdminModule {}