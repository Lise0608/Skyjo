import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private aR: ActivatedRoute) {}

  ngOnInit(): void {}

  get login(): string {
    return localStorage.getItem('token')
      ? JSON.parse(localStorage.getItem('compte')!).login
      : '';
  }
}
