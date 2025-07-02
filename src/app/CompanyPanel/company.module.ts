import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanyRoutes } from './company.routing.module';
import { CompanyDashboard } from './company-dashboard/company-dashboard';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(CompanyRoutes),
    CompanyDashboard
  ],
  declarations: [

  ],
  exports: [],
})
export class CompanyModule {}