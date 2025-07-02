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

  logout(){
    sessionStorage.clear();
    this.router.navigate(['']);
  }
}
