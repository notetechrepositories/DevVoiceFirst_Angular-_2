import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IssueTypeService {

  private apiUrl=environment.apiUrl
  constructor(private http:HttpClient) { }

  getAllIssueType(){
    return this.http.get<any>(`${this.apiUrl}/issue-type/all`,{observe:'response'});
  }
  createIssueType(data:any){
    return this.http.post<any>(`${this.apiUrl}/issue-type`,data,{observe:'response'})
  }
  deleteIssueType(data:any){
    return this.http.delete<any>(`${this.apiUrl}/issue-type`,{body:data,observe:'response'});
  }
  updateIssueTypeStatus(data:any){
    return this.http.patch<any>(`${this.apiUrl}/issue-type`,data,{observe:'response'});
  }
  getIssueTypeBYId(id:any){
    return this.http.get<any>(`${this.apiUrl}/issue-type/id?Id=${id}`,{observe:'response'});
  }
}
