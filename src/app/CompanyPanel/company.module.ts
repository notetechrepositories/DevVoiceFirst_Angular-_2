import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanyRoutes } from './company.routing.module';
import { CompanyDashboard } from './company-dashboard/company-dashboard';
import { Roles } from './roles/roles';
import { BusinessActivity } from './business-activity/business-activity';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(CompanyRoutes),
    CompanyDashboard,
    Roles,
    BusinessActivity
  ],
  declarations: [

  ],
  exports: [],
})
export class CompanyModule {}