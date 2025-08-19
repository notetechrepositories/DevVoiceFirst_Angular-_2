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
import { SysAnswerType } from './sys-answer-type/sys-answer-type';
import { Country } from './country/country';
import { Divisions } from './divisions/divisions';
import { AddIssueType } from './sys-issue-type/add-issue-type/add-issue-type';
import { AddAnswerType } from './sys-answer-type/add-answer-type/add-answer-type';
import { EditIssueType } from './sys-issue-type/edit-issue-type/edit-issue-type';
import { Company } from './company/company';
import { SysIssueStatus } from './sys-issue-status/sys-issue-status';
import { AddIssueStatus } from './sys-issue-status/add-issue-status/add-issue-status';
import { SysIssueType } from './sys-issue-type/sys-issue-type';
import { SysMediaType } from './sys-media-type/sys-media-type';

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
    SysAnswerType,
    AddAnswerType,
    Country,
    Divisions,
    SysMediaType,
    SysIssueType,
    AddIssueType,
    EditIssueType,
    Company,
    SysIssueStatus,
    AddIssueStatus
  ],
  declarations: [

  ],
  exports: [],
})
export class AdminModule {}