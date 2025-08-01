import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AnswerTypeService {

  private apiUrl = environment.apiUrl;
  
  constructor(private http:HttpClient) { }

  //------------- System Answer Type -------------

  getAllAnswerType(){
    return this.http.get<any>(`${this.apiUrl}/answer-type/all`,{observe: 'response'});
  }

  createAnswertype(data:any){
    return this.http.post<any>(`${this.apiUrl}/answer-type`, data,{observe: 'response'});
  }

  updateAnswerType(data:any){
    return this.http.put<any>(`${this.apiUrl}/answer-type`, data,{observe: 'response'});
  }
  deleteAnswerType(data:any){
    return this.http.delete<any>(`${this.apiUrl}/answer-type`, {body: data, observe: 'response'});
  }

  updateAnswerTypeStatus(data:any){
    return this.http.patch<any>(`${this.apiUrl}/answer-type`, data,{observe: 'response'});
  }

   getAnswerType(){
    return this.http.get<any>(`${this.apiUrl}/answer-type`,{observe: 'response'});
  }
// -----------------------Company Answer type ----------------------------------------
 getAllCompanyAnswerType(){ 
    return this.http.get<any>(`${this.apiUrl}/company-answer-type/all`,{observe: 'response'});
  }
  createCompanyAnswertype(data:any){
    return this.http.post<any>(`${this.apiUrl}/company-answer-type`, data,{observe: 'response'});
  }

  updateCompanyAnswerType(data:any){
    return this.http.put<any>(`${this.apiUrl}/company-answer-type`, data,{observe: 'response'});
  }
  deleteCompanyAnswerType(data:any){
    return this.http.delete<any>(`${this.apiUrl}/company-answer-type`, {body: data, observe: 'response'});
  }

  updateCompanyAnswerTypeStatus(data:any){
    return this.http.patch<any>(`${this.apiUrl}/company-answer-type`, data,{observe: 'response'});
  }

   getCompanyAnswerType(){
    return this.http.get<any>(`${this.apiUrl}/company-answer-type`,{observe: 'response'});
  }

}
