import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Compte } from '../model/compte';
import { API_SKYJO } from '../config/url';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private http: HttpClient) {}

  public register(
    login: string,
    password: string,
    email: string
  ): Observable<Compte> {
    let user = {
      login: login,
      password: password,
      email: email,
    };
    return this.http.post<Compte>(API_SKYJO + '/api/inscription', user);
  }

  public checkLogin(login: string): Observable<boolean> {
    return this.http.get<boolean>(API_SKYJO + '/api/check/' + login);
  }

  public checkEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${API_SKYJO}/api/check/email/${email}`);
  }
}
