import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Compte } from 'src/app/model/compte';
import { Game } from 'src/app/model/game';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-list-games-user',
  templateUrl: './list-games-user.component.html',
  styleUrls: ['./list-games-user.component.css'],
})
export class ListGamesUserComponent implements OnInit {
  observableGames!: Observable<Game[]>;
  userAccount!: Compte;

  constructor(private gameSrv: GameService) {}

  ngOnInit(): void {
    this.userAccount = localStorage.getItem('token')
      ? JSON.parse(localStorage.getItem('compte')!)
      : null;
    console.log('userAccount :', this.userAccount);

    this.observableGames = this.gameSrv.findUserGames(this.userAccount.id!);
  }

  toggleShowDetails(game: Game) {
    game.showDetails = !game.showDetails;
  }
}
