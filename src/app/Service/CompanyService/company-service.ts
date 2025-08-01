import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

private apiUrl= environment.apiUrl;

  constructor(private http:HttpClient) 
  { }
      
  getAllCompany(){
    return this.http.get<any>(`${this.apiUrl}/company/all`,{observe:'response'});
  }
  createCompany(data:any){

    return this.http.post<any>(`${this.apiUrl}/company`,data,{observe:'response'});
  }
  updateCompany(data:any){
    return this.http.put<any>(`${this.apiUrl}/company`,data,{observe:'response'});
  }
  updateCompanyStatus(data:any){
     return this.http.patch<any>(`${this.apiUrl}/company`,data,{observe:'response'});
  }
  deleteCompany(data:any){
      return this.http.delete<any>(`${this.apiUrl}/company`,{body:data, observe:'response'});
  }
}
