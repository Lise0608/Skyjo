import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Compte } from '../model/compte';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private http: HttpClient) {}

  // public register(login: string, password: string): Observable<Compte> {
  //   let user = {
  //     username: login,
  //     password: password,
  //   };
  //   return this.http.post<Compte>(API_HR + '/api/register', user);
  // }

  // public checkLogin(login: string): Observable<boolean> {
  //   return this.http.get<boolean>(API_HR + '/api/check/' + login);
  // }
}
