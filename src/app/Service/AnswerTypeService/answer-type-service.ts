import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AnswerTypeService {

  private apiUrl = environment.apiUrl;
  
  constructor(private http:HttpClient) { }

  //------------- System Roles -------------

  getAnswerType(){
    return this.http.get<any>(`${this.apiUrl}/issue-answer-type/all`,{observe: 'response'});
  }

  createAnswertype(data:any){
    return this.http.post<any>(`${this.apiUrl}/issue-answer-type`, data,{observe: 'response'});
  }

  updateAnswerType(data:any){
    return this.http.put<any>(`${this.apiUrl}/issue-answer-type`, data,{observe: 'response'});
  }

  // updateRoleDynamic(data:any){
  //   return this.http.put<any>(`${this.apiUrl}/roles/dynamic`, data,{observe: 'response'});
  // }

  deleteAnswerType(data:any){
    return this.http.delete<any>(`${this.apiUrl}/issue-answer-type`, {body: data, observe: 'response'});
  }

  updateAnswerTypeStatus(data:any){
    return this.http.patch<any>(`${this.apiUrl}/issue-answer-type`, data,{observe: 'response'});
  }
}
