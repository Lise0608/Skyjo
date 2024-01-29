import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Compte } from '../model/compte';
import { API_SKYJO } from '../config/url';

@Injectable({
  providedIn: 'root',
})
export class AuthentificationService {
  authUrl = API_SKYJO + '/api/auth';

  constructor(private http: HttpClient) {}

  public authentication(login: string, password: string): Observable<Compte> {
    let httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + window.btoa(login + ':' + password),
    });
    return this.http.get<Compte>(this.authUrl, { headers: httpHeader });
  }

  public isAdmin(): boolean {
    if (!localStorage.getItem('token')) return false;
    let role = JSON.parse(localStorage.getItem('compte')!).role;
    return role == 'ROLE_ADMIN';
  }
}
