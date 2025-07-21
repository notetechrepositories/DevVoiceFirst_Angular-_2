import { Routes } from '@angular/router';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { SysRoles } from './sys-roles/sys-roles';
import { TestModule } from './test-module/test-module';
import { SysBusinessActivity } from './sys-business-activity/sys-business-activity';
import { UnderDevelopment } from './under-development/under-development';
import { Country } from './country/country';
import { SysAnswerType } from './sys-answer-type/sys-answer-type';
import { Divisions } from './divisions/divisions';
import { MediaType } from './media-type/media-type';


export const AdminRoutes: Routes = [
  {
    path: '', redirectTo: 'admin-dashboard', pathMatch: 'full' 
  },
  {
    path:'admin-dashboard',
    component:AdminDashboard
  },
  {
    path:'system-roles',
    component:SysRoles
  },
  {
    path:'system-business-activity',
    component:SysBusinessActivity
  },
  {
    path:'system-answer-type',
    component:SysAnswerType
  },
  {
    path:'media-type',
    component:MediaType
  },
  {
    path:'test',
    component:TestModule
  },
  {
    path:'under-development',
    component:UnderDevelopment
  },
  {
    path:'country',
    component:Country
  },
  {
    path:'divisions/:id',
    component:Divisions
  }

];