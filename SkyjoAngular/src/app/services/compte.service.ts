import { Injectable } from '@angular/core';
import { API_SKYJO } from '../config/url';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compte } from '../model/compte';

@Injectable({
  providedIn: 'root',
})
export class CompteService {
  urlCompte = `${API_SKYJO}/api/comptes`;

  constructor(public http: HttpClient) {}

  getCompteById(id: number): Observable<Compte> {
    return this.http.get<Compte>(`${this.urlCompte}/${id}`);
  }

  findAll(): Observable<Compte[]> {
    return this.http.get<Compte[]>(`${this.urlCompte}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlCompte}/${id}`);
  }

  reset(password: string, compteId: number) {
    const data = { newPassword: password, compteId: compteId.toString() };
    console.log(data);
    return this.http.post(`${this.urlCompte}/updatePassword`, data);
  }

  sendEmail(email: string): Observable<void> {
    console.log(`${this.urlCompte}/reset`);
    const data = { email: email };
    console.log('data :', data);
    return this.http.post<void>(`${this.urlCompte}/reset`, data);
  }
}
