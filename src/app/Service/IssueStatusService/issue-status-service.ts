import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class IssueStatusService {

  private apiUrl = environment.apiUrl;
  
  constructor(private http:HttpClient) { }

  //------------- System Answer Type -------------

  getAllIssueStatus(){
    return this.http.get<any>(`${this.apiUrl}/issue-status/all`,{observe: 'response'});
  }

  getIssueStatus(){
    return this.http.get<any>(`${this.apiUrl}/issue-status`,{observe: 'response'});
  }

  createIssueStatus(data:any){
    return this.http.post<any>(`${this.apiUrl}/issue-status`, data,{observe: 'response'});
  }

  updateIssueStatus(data:any){
    return this.http.put<any>(`${this.apiUrl}/issue-status`, data,{observe: 'response'});
  }
  
  deleteIssueStatus(data:any){
    return this.http.delete<any>(`${this.apiUrl}/issue-status`, {body: data, observe: 'response'});
  }

  updateIssueStatusStatus(data:any){
    return this.http.patch<any>(`${this.apiUrl}/issue-status`, data,{observe: 'response'});
  }


  
}
