import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationStateService {
  private readonly countryKey = 'app_selected_country';

  setCountry(country: any): void {
    localStorage.setItem(this.countryKey, JSON.stringify(country));
    console.log('Country stored:', country);
  }

  getCountry(): any {
    const data = localStorage.getItem(this.countryKey);
    try {
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to parse stored country:', e);
      return null;
    }
  }

  clearCountry(): void {
    localStorage.removeItem(this.countryKey);
  }
}
