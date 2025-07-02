declare var google: any;
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../Service/AuthService/auth';



@Component({
  selector: 'app-landing',
  imports: [],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing implements OnInit {

  constructor(
    private router:Router,
  ){}

  ngOnInit(): void {
   
  }

}
