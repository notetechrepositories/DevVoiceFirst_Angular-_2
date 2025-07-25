import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AttachmentSevice {
 private apiUrl=environment.apiUrl;

  constructor(private http:HttpClient) { }
  getAttachment(){
    return this.http.get<any>(`${this.apiUrl}/attachment-type`,{observe:'response'});
  }
}
