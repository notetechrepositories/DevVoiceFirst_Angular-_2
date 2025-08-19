import { Routes } from '@angular/router';
import { CompanyDashboard } from './company-dashboard/company-dashboard';
import { Roles } from './roles/roles';
import { BusinessActivity } from './business-activity/business-activity';
import { AnswerType } from './answer-type/answer-type';
import { MediaType } from './media-type/media-type';



export const CompanyRoutes: Routes = [
  {
    path: '', redirectTo: 'dashboard', pathMatch: 'full' 
  },
  {
    path: 'dashboard',
    component: CompanyDashboard
  },
  {
    path: 'roles',
    component: Roles
  },
  {
    path: 'business-activity',
    component: BusinessActivity
  },
  {
    path: 'answer-type',
    component: AnswerType
  },
  {
    path: 'media-type',
    component: MediaType
  }
];