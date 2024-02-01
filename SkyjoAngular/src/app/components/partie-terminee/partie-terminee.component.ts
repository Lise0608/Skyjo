import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CompteService } from 'src/app/services/compte.service';

@Component({
  selector: 'app-partie-terminee',
  templateUrl: './partie-terminee.component.html',
  styleUrls: ['./partie-terminee.component.css'],
})
export class PartieTermineeComponent {
  data: any;
  playerScoresWithUsername: any[] = [];

  constructor(private router: Router, private compteService: CompteService) {
    const navigation = this.router.getCurrentNavigation(); // On récupère le formulaire de création de partie
    if (navigation && navigation.extras.state) {
      this.data = navigation.extras.state['data'];

      // Fetch users and update playerScoresWithUsername
      this.compteService.getAllUsers().subscribe((users) => {
        Object.keys(this.data.playerScores).forEach((id) => {
          const username = this.compteService.getUserById(Number(id));
          const score = this.data.playerScores[id];
          this.playerScoresWithUsername.push({ username, score });
        });
      });
    }
  }

  isWinner(score: number): boolean {
    return (
      score ===
      Math.min(
        ...this.playerScoresWithUsername.map((playerScore) => playerScore.score)
      )
    );
  }
}
