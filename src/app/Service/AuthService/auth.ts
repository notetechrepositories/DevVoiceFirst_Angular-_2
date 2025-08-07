import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '../../../environment/environment';
import { SecurityService } from '../SecurityService/security-service';

export interface User {
  id: number;
  email: string;
  name: string;
  password: null;
  sub: string;
  type: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private apiUrl = environment.apiUrl;

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  private skipAuth = new HttpHeaders().set('skip-auth', 'true');

  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(
    private router:Router,
    private http:HttpClient,
    private securityService:SecurityService
  ) {}


  // -----------------------------------------------------------

  login(data:any){
    return this.http.post<any>(`${this.apiUrl}/Auth/login`, data, {observe: 'response', headers:this.skipAuth});
  }

  googleLogin(data:any){
    return this.http.post<any>(`${this.apiUrl}/Auth/google-login`, data,{observe: 'response', headers:this.skipAuth});
  }


  userRegistration(data:any){
    return this.http.post<any>(`${this.apiUrl}/Auth/register`, data,{observe: 'response', headers:this.skipAuth});
  }

  googleRegistration(data:any){
    return this.http.post<any>(`${this.apiUrl}/Auth/google-registration`, data,{observe: 'response', headers:this.skipAuth});
  }



  // ------------------------------------------------------------------------------------------------------

  private hasToken(): boolean {
    return !!sessionStorage.getItem('token');
  }

  getLoggedInUser() {
    const userData = sessionStorage.getItem('loggedInUser');
    if(userData) return this.securityService.decryptObject(userData);
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }
  
  logout(){
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['']);
    this.isLoggedInSubject.next(false);
  }

}
