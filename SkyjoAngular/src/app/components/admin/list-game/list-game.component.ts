import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Game } from 'src/app/model/game';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'admin-list-game',
  templateUrl: './list-game.component.html',
  styleUrls: ['./list-game.component.css'],
})
export class ListGameComponent implements OnInit {
  observableGames!: Observable<Game[]>;

  constructor(private gameSrv: GameService) {}

  ngOnInit(): void {
    this.observableGames = this.gameSrv.findall();
  }

  delete(id: number) {
    this.gameSrv.delete(id).subscribe(() => {
      this.observableGames = this.gameSrv.findall();
    });
  }

  toggleShowDetails(game: Game) {
    game.showDetails = !game.showDetails;
  }
}
