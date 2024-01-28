import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Game } from 'src/app/model/game';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-list-game',
  templateUrl: './list-game.component.html',
  styleUrls: ['./list-game.component.css'],
})
export class ListGameComponent implements OnInit {
  observableGames!: Observable<Game[]>;

  constructor(private gameSrv: GameService) {}

  ngOnInit(): void {
    this.observableGames = this.gameSrv.findall();
  }
}
