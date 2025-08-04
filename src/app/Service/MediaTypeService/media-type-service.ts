import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MediaTypeService {

 private apiUrl=environment.apiUrl

  constructor(private http:HttpClient) { }
  // -------------------Sys MediaType-------------------------------------
  getAllMediatype(){

   return this.http.get<any>(`${this.apiUrl}/media-type/all`,{observe:'response'});
  }
  createMediaType(data:any){
    return this.http.post<any>(`${this.apiUrl}/media-type`,data,{observe:'response'});
  }
  updateMediaType(data:any){
    return this.http.put<any>(`${this.apiUrl}/media-type`,data ,{observe:'response'})
  }
  deleteMediaType(data:any){
    return this.http.delete<any>(`${this.apiUrl}/media-type`,{body:data,observe:'response'})
  }
  updateMediaTypeStatus(data:any){
    return this.http.patch<any>(`${this.apiUrl}/media-type`,data,{observe:'response'})
  }
  getMediatype(){

   return this.http.get<any>(`${this.apiUrl}/media-type`,{observe:'response'});
  }

// --------------Company Media Type---------------------------------------------------------

  getAllCompanyMediatype(){

   return this.http.get<any>(`${this.apiUrl}/company-media-type/all`,{observe:'response'});
  }
  createCompanyMediaType(data:any){
    return this.http.post<any>(`${this.apiUrl}/company-media-type`,data,{observe:'response'});
  }
  updateCompanyMediaType(data:any){
    return this.http.put<any>(`${this.apiUrl}/company-media-type`,data ,{observe:'response'})
  }
  deleteCompanyMediaType(data:any){
    return this.http.delete<any>(`${this.apiUrl}/company-media-type`,{body:data,observe:'response'})
  }
  updateCompanyMediaTypeStatus(data:any){
    return this.http.patch<any>(`${this.apiUrl}/company-media-type`,data,{observe:'response'})
  }
  getCompanyMediatype(){

   return this.http.get<any>(`${this.apiUrl}/company-media-type`,{observe:'response'});
  }
  
}
