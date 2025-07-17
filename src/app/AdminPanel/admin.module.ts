import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutes } from './admin.routing.module';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { SysRoles } from './sys-roles/sys-roles';
import { TestModule } from './test-module/test-module';
import { SysBusinessActivity } from './sys-business-activity/sys-business-activity';
import { UnderDevelopment } from './under-development/under-development';
import { Country } from './country/country';






@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(AdminRoutes),
    RouterOutlet,
    ReactiveFormsModule,
    AdminDashboard,
    SysRoles,
    SysBusinessActivity,
    TestModule,
    UnderDevelopment,
    Country
  ],
  declarations: [

  ],
  exports: [],
})
export class AdminModule {}