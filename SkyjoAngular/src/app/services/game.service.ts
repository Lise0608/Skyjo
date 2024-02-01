import { Injectable } from '@angular/core';
import { API_SKYJO } from '../config/url';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, mergeAll } from 'rxjs';
import { Game } from '../model/game';
import { CompteService } from './compte.service';
import { Compte } from '../model/compte';
import { Player } from '../model/player';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  urlGame = `${API_SKYJO}/api/game`;
  private stompClient?: Stomp.Client;
  private urlWebsocket = `${API_SKYJO}/websocket`;

  constructor(private http: HttpClient, private compteSrv: CompteService) {
    this.initializeWebSocketConnection();
  }

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

  initializeWebSocketConnection() {
    const socket = new SockJS(this.urlWebsocket);
    this.stompClient = Stomp.over(socket);
    const that = this;
    this.stompClient.connect({}, function (frame) {
      that.stompClient!.subscribe('/topic/public', (message) => {
        if (message.body) {
          console.log('Received: ' + message.body);
        }
      });
    });
  }

  createGame(token: string, compte: Compte) {
    console.log('CREATE GAME');

    const requestData = { token: token, compteResponse: compte };
    console.log('GAME ENVOYÉE :', requestData);
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient!.send(
        '/app/game.create',
        {},
        JSON.stringify(requestData)
      );
    } else {
      console.error('Stomp client is not initialized or not connected.');
    }
  }

  joinGame(token: string, compte: Compte): boolean {
    console.log('JOIN GAME');
    if (this.stompClient && this.stompClient.connected) {
      const requestData = {
        token: token,
        compteResponse: compte,
      };
      this.stompClient.send('/app/game.join', {}, JSON.stringify(requestData));

      // Écouter la réponse du serveur
      this.stompClient.subscribe('/topic/public', (message) => {
        if (message.body) {
          const gameData = JSON.parse(message.body);
          console.log('Game data received from server:', gameData);
        } else {
          console.error('No game data received from server.');
        }
      });
      return true;
    } else {
      console.error('Stomp client is not initialized or not connected.');
      return false;
    }
  }
}
