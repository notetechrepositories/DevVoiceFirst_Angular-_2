import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { MenuItem } from '../../Layout/admin-layout/admin-layout';

@Injectable({
  providedIn: 'root'
})
export class Menu {

   private apiUrl = environment.apiUrl;

  constructor(
    private http:HttpClient
  ) { }

  getMenu(){
    return this.http.get<any>(this.apiUrl+'/menus/web');
  }
}
