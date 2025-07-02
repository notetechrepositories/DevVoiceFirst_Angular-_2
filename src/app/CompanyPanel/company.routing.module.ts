import { Routes } from '@angular/router';
import { CompanyDashboard } from './company-dashboard/company-dashboard';



export const CompanyRoutes: Routes = [
  {
    path: '', redirectTo: 'company-dashboard', pathMatch: 'full' 
  },
  {
    path: 'company-dashboard',
    component: CompanyDashboard
  },

];