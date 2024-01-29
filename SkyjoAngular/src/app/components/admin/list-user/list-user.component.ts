import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Compte } from 'src/app/model/compte';
import { CompteService } from 'src/app/services/compte.service';

@Component({
  selector: 'admin-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css'],
})
export class ListUserComponent implements OnInit {
  observableComptes!: Observable<Compte[]>;

  constructor(private compteSrv: CompteService) {}

  ngOnInit(): void {
    this.observableComptes = this.compteSrv.findAll();
  }

  delete(id: number) {
    this.compteSrv.delete(id).subscribe(() => {
      this.observableComptes = this.compteSrv.findAll();
    });
  }
}
