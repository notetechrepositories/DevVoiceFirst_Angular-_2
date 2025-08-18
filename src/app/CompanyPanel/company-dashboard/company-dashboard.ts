import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-company-dashboard',
  imports: [FormsModule,CommonModule],
  templateUrl: './company-dashboard.html',
  styleUrl: './company-dashboard.css'
})
export class CompanyDashboard {

}
