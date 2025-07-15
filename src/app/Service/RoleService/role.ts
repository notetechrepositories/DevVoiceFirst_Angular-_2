import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private apiUrl = environment.apiUrl;
  
  constructor(private http:HttpClient) { }

  //------------- System Roles -------------

  getRoles(){
    return this.http.get<any>(`${this.apiUrl}/roles`,{observe: 'response'});
  }

  createRole(data:any){
    return this.http.post<any>(`${this.apiUrl}/roles`, data,{observe: 'response'});
  }

  updateRole(data:any){
    return this.http.put<any>(`${this.apiUrl}/roles`, data,{observe: 'response'});
  }

  updateRoleDynamic(data:any){
    return this.http.put<any>(`${this.apiUrl}/roles/dynamic`, data,{observe: 'response'});
  }

  deleteRole(data:any){
    return this.http.delete<any>(`${this.apiUrl}/roles`, {body: data, observe: 'response'});
  }

  updateRoleStatus(data:any){
    return this.http.patch<any>(`${this.apiUrl}/roles`, data,{observe: 'response'});
  }
}
