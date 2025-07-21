import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationStateService {
  private country: any;

  constructor() { }

  setCountry(country: any) {
    this.country = country;
    console.log("Set country",this.country);
  }

  getCountry() {
    console.log("Get country",this.country);
    return this.country;
  }
}
