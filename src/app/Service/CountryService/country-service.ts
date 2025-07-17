import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private apiUrl = environment.apiUrl;
  
  constructor(private http:HttpClient) { }
    
  //------------- System Roles -------------

  getCountry(){
    return this.http.get<any>(`${this.apiUrl}/country/all`,{observe: 'response'});
  }

  createCountry(data:any){
    return this.http.post<any>(`${this.apiUrl}/country`, data,{observe: 'response'});
  }

  updateCountry(data:any){
    return this.http.put<any>(`${this.apiUrl}/country`, data,{observe: 'response'});
  }
  deleteCountry(data:any){
    return this.http.delete<any>(`${this.apiUrl}/country`, {body: data, observe: 'response'});
  }

  updateCountryStatus(data:any){
    return this.http.patch<any>(`${this.apiUrl}/country`, data,{observe: 'response'});
  }
}
