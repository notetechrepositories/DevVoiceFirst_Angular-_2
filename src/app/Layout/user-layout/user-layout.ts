import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Auth } from '../../Service/AuthService/auth';

@Component({
  selector: 'app-user-layout',
  imports: [RouterOutlet,RouterLink,RouterLinkActive,CommonModule],
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.css'
})
export class UserLayout {
 isMenuOpen = false;
 isLoggedIn : boolean = false;

constructor(private authService:Auth){}

ngOnInit(){
  this.loginCheck();
}

 loginCheck(){
  this.authService.isLoggedIn$.subscribe((status) => {
    this.isLoggedIn = status;
  });
}

 navigateToLogin(){

 }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;

    // Disable scrolling when the menu is open
    if (this.isMenuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }

  onMenuClick(){
    if(this.isMenuOpen){
      this.isMenuOpen=false;
    }
  }

  logout(){
    this.authService.logout();
  }
}
