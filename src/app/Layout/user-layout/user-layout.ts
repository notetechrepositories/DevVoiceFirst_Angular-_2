import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Auth } from '../../Service/AuthService/auth';
import { UtilityService } from '../../Service/UtilityService/utility-service';

@Component({
  selector: 'app-user-layout',
  imports: [RouterOutlet,RouterLink,RouterLinkActive,CommonModule],
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.css'
})
export class UserLayout {
 isMenuOpen = false;
 isLoggedIn : boolean = false;


constructor(private authService:Auth, private utilityService:UtilityService){}

ngOnInit(){
  this.loginCheck();
}

 loginCheck(){
  // this.authService.isLoggedIn$.subscribe((status) => {
  //   this.isLoggedIn = status;
  // })
  this.isLoggedIn= this.authService.isLoggedIn();
  // console.log("working" , this.isLoggedIn);

  
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

  async logout(){
    const message = 'Are you sure want to logout?'
    const result = await this.utilityService.confirmDialog(message,'logout');
    if(result.isConfirmed){
      this.authService.logout();
    }
  }


}
