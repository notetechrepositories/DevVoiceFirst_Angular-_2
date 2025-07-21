import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private apiUrl = environment.apiUrl;
  
  constructor(private http:HttpClient) { }
    
  //------------- Country  -------------

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

  // ------------- Division One --------------

  getDivisionOne(id:string|null){
    return this.http.get<any>(`${this.apiUrl}/division-one/all?countryId=${id}`, {observe: 'response'});
  }
  createDivisionOne(data:any){
    return this.http.post<any>(`${this.apiUrl}/division-one`, data,{observe: 'response'});
  }
  updateDivisionOne(data:any){
    return this.http.put<any>(`${this.apiUrl}/division-one`, data,{observe: 'response'});
  }
  deleteDivisionOne(data:any){
    return this.http.delete<any>(`${this.apiUrl}/division-one`, {body: data, observe: 'response'});
  }

  // ------------- Division Two --------------

  getDivisionTwo(id:string|null){
    return this.http.get<any>(`${this.apiUrl}/division-two/all?division_one_id=${id}`, {observe: 'response'});
  }
  createDivisionTwo(data:any){
    return this.http.post<any>(`${this.apiUrl}/division-two`, data,{observe: 'response'});
  }
  updateDivisionTwo(data:any){
    return this.http.put<any>(`${this.apiUrl}/division-two`, data,{observe: 'response'});
  }
  deleteDivisionTwo(data:any){
    return this.http.delete<any>(`${this.apiUrl}/division-two`, {body: data, observe: 'response'});
  }

  // ------------- Division Three --------------
}
