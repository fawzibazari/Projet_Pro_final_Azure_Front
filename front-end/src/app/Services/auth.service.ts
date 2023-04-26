import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  DJANGO_SERVER_URL = "http://127.0.0.1:8000/api";

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
