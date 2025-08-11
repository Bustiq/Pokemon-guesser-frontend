import { Component } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';



@Component({
  selector: 'app-daily-challenge',
  imports: [CommonModule],
  templateUrl: './daily-challenge.component.html',
  styleUrl: './daily-challenge.component.css'
})
export class DailyChallengeComponent {


  constructor(private router: Router, private connectionService: ConnectionService) {

  }
  ngOnInit() {
    this.connectionService.asignDailyChallenge().then(() => {
      // mostrar mensaje de éxito
    }).catch((error) => {
      console.error("Error al asignar el desafío diario:", error);

    });
  }


}
