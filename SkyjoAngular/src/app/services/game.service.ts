import { Injectable } from '@angular/core';
import { API_SKYJO } from '../config/url';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, mergeAll } from 'rxjs';
import { Game } from '../model/game';
import { CompteService } from './compte.service';
import { Compte } from '../model/compte';
import { Player } from '../model/player';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  urlGame = `${API_SKYJO}/api/game`;

  constructor(private http: HttpClient, private compteSrv: CompteService) {}

  findall(): Observable<Game[]> {
    return this.getPlayerName(
      this.http.get<Game[]>(`${this.urlGame}/allGames`)
    );
  }

  findUserGames(id: number): Observable<Game[]> {
    return this.getPlayerName(
      this.http.get<Game[]>(`${this.urlGame}/userGames?userId=${id}`)
    );
  }

  // Récupération du username de chaque player de chaque partie dans le compteService à partir de l'id du player
  getPlayerName(games: Observable<Game[]>): Observable<Game[]> {
    return games.pipe(
      map((games: Game[]) => {
        const observables: Observable<any>[] = [];

        games.forEach((game: Game) => {
          game.players!.forEach((player: Player) => {
            observables.push(this.compteSrv.getCompteById(player.userid!));
          });
        });

        // forkJoin pour attendre que toutes les requetes asynchrones soient terminées
        return forkJoin(observables).pipe(
          map((comptes: Compte[]) => {
            let index = 0;
            games.forEach((game: Game) => {
              game.players!.forEach((player: Player) => {
                player.username = comptes[index].login;
                index++;
              });
            });
            return games;
          })
        );
      }),

      // merge pour passer d'un Observable<Observable Game[]> à Observable<Game[]>
      mergeAll()
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlGame}/${id}`);
  }

  saveGame(data: any): Observable<Game> {
    return this.http.post<Game>(`${this.urlGame}`, data);
  }
}
