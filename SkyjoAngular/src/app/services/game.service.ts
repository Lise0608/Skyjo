import { Injectable } from '@angular/core';
import { API_SKYJO } from '../config/url';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game } from '../model/game';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  urlGame = API_SKYJO + '/api/game';

  constructor(private http: HttpClient) {}

  findall(): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.urlGame}/allGames`);
  }
}
