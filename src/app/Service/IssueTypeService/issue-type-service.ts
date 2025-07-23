import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IssueTypeService {

  private apiUrl=environment.apiUrl
  constructor(private http:HttpClient) { }

  getIssueTypeService(){
    return this.http.get<any>(`${this.apiUrl}/issue-type/all`,{observe:'response'});
  }
  createIssueTypeService(data:any){
    return this.http.post<any>(`${this.apiUrl}/issue-type`,data,{observe:'response'})
  }

}
