import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  DJANGO_SERVER_URL = "https://azuroo-api.azurewebsites.net/api";

  constructor(
    private http: HttpClient,
  ) { }

  login(firstname: string, mail: string, password: string): Observable<any> {
    const body = { firstname, mail, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.DJANGO_SERVER_URL}/login`, body, { headers });
  }

  signup(firstname: string, mail: string, password: string): Observable<any> { 
    const body = { firstname, mail, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.DJANGO_SERVER_URL}/register`, body, { headers });
  }

}
