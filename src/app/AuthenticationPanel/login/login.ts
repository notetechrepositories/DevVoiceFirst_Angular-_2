declare var google: any;
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../Service/AuthService/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Deviceinfo } from '../../Service/DeviceinfoService/deviceinfo';
import { UtilityService } from '../../Service/UtilityService/utility-service';
import { SecurityService } from '../../Service/SecurityService/security-service';


@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  username:string='';
  password:string='';

  deviceInfo: any;

  isUserTypeVisible:boolean=false;
  isLoading:boolean=false;

  selectedToken: string | null = null;


  constructor(
      private router:Router,
      private authService:Auth,
      private deviceInfoService:Deviceinfo,
      private utilityService:UtilityService,
      private securityService:SecurityService
    ){}

  ngOnInit(): void {
   sessionStorage.clear();
  }

  ngAfterViewInit(): void {
  this.googleInit();
}

  getDeviceDetails() {
    return this.deviceInfo;
  }

   googleInit(){
    google.accounts.id.initialize({
      client_id: '1058839439916-ish868v28g5j4fa0jilg5qf4hdbqm7v2.apps.googleusercontent.com',
      callback: (res: any)=>{
        console.log(res);
        this.onGoogleLogin(res);
      },
      error:(err:any)=>{
        this.utilityService.showError(err.status, err.error.message);
      }
    });
     google.accounts.id.renderButton(document.getElementById('google-btn'),{
      theme:'filled_black',
      size:'large',
      text:'continue_with',
      shape:'pill',
      width: 350
    });
  }

  private decodeToken(token: string) {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/'); 
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }


  onGoogleLogin(response: any) {
    if (response) {
      const decodedPayload = this.decodeToken(response.credential);
      const googleToken = response.credential;
      const payload = { googleToken };
      this.isLoading=true;
      this.authService.googleLogin(payload).subscribe({
        next: res => {
          if (res.status === 200) {
            this.isLoading=false;
            const responseData = res.body.data;
           this.selectedToken = responseData.accessToken;
  
            if (responseData.user && responseData.company) {
              // Don't store token, just pass to modal
              this.openUserTypeModal();
            } else {
              // Store token and navigate accordingly
              sessionStorage.setItem("token", JSON.stringify(this.selectedToken));
              const encryptedData = this.securityService.encryptObject(decodedPayload);
              sessionStorage.setItem("loggedInUser",encryptedData);
              if (responseData.user) {
                this.router.navigate(['user/home']);
              } else if (responseData.company) {
                this.router.navigate(['admin/dashboard']);
              } else {
                this.utilityService.info("Please contact admin for access");
              }
            }
          }
        },
        error: err => {
          this.isLoading=false;
          if(err.status === 404){
            const encryptedData = this.securityService.encryptObject(decodedPayload);
            sessionStorage.setItem("loggedInUser", encryptedData);
            this.router.navigate(['authentication/user-registration']);
          }
          else{
            this.utilityService.showError(err.status, err.error.message);
          }
         
        }
      });
    }
  }
  
 loginResponseData: any;

  onLogin() {
    this.isLoading=true;
    if (!this.username || !this.password) {
      this.isLoading=false;
      this.utilityService.info("Please enter both username and password.");
      return;
    }
  
    const payload = {
      username: this.username,
      password: this.password
    };
    this.authService.login(payload).subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.isLoading=false;
         this.loginResponseData = res.body.data;

          if (this.loginResponseData.userAccessToken && this.loginResponseData.companyAccessToken) {
            this.openUserTypeModal();
          } else {
            // Store token and route accordingly
            if (this.loginResponseData.userAccessToken) {
              sessionStorage.setItem("token", this.loginResponseData.userAccessToken);
              this.router.navigate(['user/home']);
            } else if (this.loginResponseData.companyAccessToken) {
              sessionStorage.setItem("token", this.loginResponseData.companyAccessToken);
              this.router.navigate(['admin/dashboard']);
            } else {
              this.utilityService.info("Please contact admin for access");
            }
          }
  
          const deviceData = this.deviceInfoService.getFullDeviceInfo();
          console.log("Device Info:", deviceData);
        } 
        else {
          this.utilityService.error("Invalid username or password.");
        }
      },
      error: (err) => {
        this.isLoading=false;
        this.utilityService.showError(err.status, err.error.message);
      }
    });
  }
  
    
    openUserTypeModal() {
      this.isUserTypeVisible=true;
    }

    closeModal(){
      this.isUserTypeVisible=false;
      sessionStorage.clear();
    }

    onChooseUserType(type: string) {
      this.isLoading = true; // Start spinner

      if (this.loginResponseData.userAccessToken === null && this.loginResponseData.companyAccessToken === null) {
        this.utilityService.warning("Missing token. Please log in again.");
        this.isLoading = false;
        return;
      }
      this.isUserTypeVisible = false;
      // Show spinner for 2 seconds before navigating
      setTimeout(() => {
        if (type === "user") {
          sessionStorage.setItem("token", this.loginResponseData.userAccessToken);
          this.router.navigate(['user/home']);
        } else if (type === "company") {
          sessionStorage.setItem("token", this.loginResponseData.companyAccessToken);
          this.router.navigate(['admin/dashboard']);
        } else {
          this.utilityService.info("Please contact admin for access");
        }
        this.isLoading = false;         // Hide spinner
      }, 2000);
      
    }

    onForgotPassword(){

    }



}
