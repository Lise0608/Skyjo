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
}
