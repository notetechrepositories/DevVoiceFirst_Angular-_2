import { Routes } from '@angular/router';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { SysRoles } from './sys-roles/sys-roles';
import { TestModule } from './test-module/test-module';
import { SysBusinessActivity } from './sys-business-activity/sys-business-activity';


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
    path:'business-activity',
    component:SysBusinessActivity
  },
  {
    path:'test',
    component:TestModule
  }

];