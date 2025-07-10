import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

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

    userDetails: User[] = [
      {
        id: 1,
        email: "athulks@notetech.com",
        name: "Athul",
        password: null,
        sub: "113306282126888142011",
        type: "admin"
      },
      {
        id: 2,
        email: "bincy@notetech.com",
        name: "Bincy",
        password: null,
        sub: "113306282126888142011",
        type: "company"
      },
      {
        id: 3,
        email: "thomasjordy@gmail.com",
        name: "Thomas Jordy",
        password: null,
        sub: "113306282126888142011",
        type: "admin"
      }
    ];


  constructor(
    private router:Router
  ) {}

  userExists(email: string): Observable<{ exists: boolean; user?: User }> {
    const user = this.userDetails.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );
    return of({
      exists: !!user,
      user: user || undefined
    });
}


   signUpUser(payload: any) {
    const newUser = {
      id: this.userDetails.length + 1,
      email: payload.email,
      name: payload.name || '',
      password: null,
      sub: payload.sub ,
      type:null// Google user ID
    };
    this.userDetails.push(newUser);
  }

  loginWithCredentials(email: string, password: string): Observable<{ success: boolean; user?: User }> {
    // You can later replace this with a real backend API call.
    const user = this.userDetails.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );
  
    // NOTE: Since your user data has null passwords, this is placeholder logic.
    // Replace this with hashed password comparison or backend check.
    if (user && password === '123456') { // Hardcoded for demo; you must improve this
      return of({ success: true, user });
    }
  
    return of({ success: false });
  }
  

  

  logout(){
    sessionStorage.clear();
    this.router.navigate(['']);
  }
}
