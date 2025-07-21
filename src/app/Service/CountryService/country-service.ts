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
    return this.http.get<any>(`${this.apiUrl}/division-one/all?country=${id}`, {observe: 'response'});
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

  updateDivisionOneStatus(data:any){
    return this.http.patch<any>(`${this.apiUrl}/division-one`, data,{observe: 'response'});
  }

  // ------------- Division Two --------------

  getDivisionTwo(id:string|null){
    return this.http.get<any>(`${this.apiUrl}/division-two/all?divisionOne=${id}`, {observe: 'response'});
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

  updateDivisionTwoStatus(data:any){
    return this.http.patch<any>(`${this.apiUrl}/division-two`, data,{observe: 'response'});
  }

  // ------------- Division Three --------------

  getDivisionThree(id:string|null){
    return this.http.get<any>(`${this.apiUrl}/division-three/all?divisionTwo=${id}`, {observe: 'response'});
  }

  createDivisionThree(data:any){
    return this.http.post<any>(`${this.apiUrl}/division-three`, data,{observe: 'response'});
  }

  updateDivisionThree(data:any){
    return this.http.put<any>(`${this.apiUrl}/division-three`, data,{observe: 'response'});
  }

  deleteDivisionThree(data:any){
    return this.http.delete<any>(`${this.apiUrl}/division-three`, {body: data, observe: 'response'});
  }

  updateDivisionThreeStatus(data:any){
    return this.http.patch<any>(`${this.apiUrl}/division-three`, data,{observe: 'response'});
  }
}
