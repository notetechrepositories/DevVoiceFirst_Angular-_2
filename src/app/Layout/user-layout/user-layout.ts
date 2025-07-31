import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-layout',
  imports: [RouterOutlet,RouterLink,RouterLinkActive,CommonModule],
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.css'
})
export class UserLayout {
 isMenuOpen = false;
 isloggedin = false;

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
}
