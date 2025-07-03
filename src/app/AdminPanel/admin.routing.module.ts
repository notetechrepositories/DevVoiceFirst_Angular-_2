import { Routes } from '@angular/router';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';


export const AdminRoutes: Routes = [
  {
    path: '', redirectTo: 'admin-dashboard', pathMatch: 'full' 
  },
  {
    path:'admin-dashboard',
    component:AdminDashboard
  },

];