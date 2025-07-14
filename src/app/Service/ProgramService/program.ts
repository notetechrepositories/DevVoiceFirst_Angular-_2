import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Program {

  private apiUrl = environment.apiUrl;
  
  constructor(private http:HttpClient) { }

  getPrograms(){
    return this.http.get<any>(`${this.apiUrl}/programs`,{observe: 'response'});
  }
}
