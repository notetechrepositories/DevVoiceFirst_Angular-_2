import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class BusinessActivityService {

 private apiUrl = environment.apiUrl;
  
  constructor(private http:HttpClient) { }

  //------------- System BusinessActivity -------------

  getBusinessActivity(){
    return this.http.get<any>(`${this.apiUrl}/business-activities/all`,{observe: 'response'});
  }

  createBusinessActivity(data:any){
    return this.http.post<any>(`${this.apiUrl}/business-activities`, data,{observe: 'response'});
  }

  updateBusinessActivity(data:any){
    return this.http.put<any>(`${this.apiUrl}/business-activities`, data,{observe: 'response'});
  }

   deleteBusinessActivity(data:any){
    return this.http.delete<any>(`${this.apiUrl}/business-activities`, {body: data, observe: 'response'});
  }
}
