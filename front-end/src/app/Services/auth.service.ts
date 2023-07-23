import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLogged = false;
  DJANGO_SERVER_URL = "https://projet-pro-final-azure-back.vercel.app/api";

  constructor(
    private http: HttpClient,
  ) { }

  login(mail: string, password: string): Observable<any> {
    const body = { mail, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.DJANGO_SERVER_URL}/login`, body, { headers, observe: 'response' })
      .pipe(
        map((response: HttpResponse<any>) => {
          const success = response.body.success;
          const message = response.body.message;
          const token = response.body.token;
          if (success) {
            this.isLogged = true;
          } else {
            this.isLogged = false;
          }
          return { success, message, token }
        })
      )
  }

  signup(firstname: string, mail: string, password: string): Observable<any> {
    const body = { firstname, mail, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.DJANGO_SERVER_URL}/register`, body, { headers, observe: 'response' })
      .pipe(
        map((response: HttpResponse<any>) => {
          const success = response.body.success;
          const message = response.body.message;
          const token = response.body.token;
          if (success) {
            this.isLogged = true;
          } else {
            this.isLogged = false;
          }
          return { success, message, token };
        })
      )
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isLogged = false;
  }

  isAuthenticated(): boolean{
    return this.isLogged;
  }

}
