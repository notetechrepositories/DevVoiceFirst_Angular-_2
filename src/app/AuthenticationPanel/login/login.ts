declare var google: any;
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../Service/AuthService/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Deviceinfo } from '../../Service/DeviceinfoService/deviceinfo';


@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  username:string='';
  password:string='';

  deviceInfo: any;

  constructor(
      private router:Router,
      private authService:Auth,
      private deviceInfoService:Deviceinfo
    ){}

  ngOnInit(): void {
   
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
        this.handleLogin(res);
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

handleLogin(response:any){
    if(response){
      const payload=this.decodeToken(response.credential);
      console.log(payload);
      if(payload.email_verified){
        this.authService.userExists(payload.email).subscribe({
          next:res=>{
            console.log("User Details", res);
            
            if(res.exists){
              sessionStorage.setItem("loggedInUser",JSON.stringify(payload));
              if(res.user?.type=="admin"){
                this.router.navigate(['admin/admin-dashboard']);
              }
              else if(res.user?.type=="company"){
                this.router.navigate(['company/company-dashboard']);
              }
              else{
                this.router.navigate(['user/home']);
              }
              const deviceData =  this.deviceInfoService.getFullDeviceInfo();
              console.log(deviceData);
              
            }
            else{
              this.authService.signUpUser(payload);
              sessionStorage.setItem("loggedInUser", JSON.stringify(payload));
              this.router.navigate(['authentication/user-registration']);
            }
          }
        })
      }
      
    }
  }

  onForgotPassword(){

  }

  onLogin(){

  }



}
