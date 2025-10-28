import { Component } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leaderboard',
  imports: [CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent {
leaderBoard : any[] = [];

constructor(private router: Router, private connectionService: ConnectionService) {

  }

  async ngOnInit() {
    this.getLeaderBoard();
  }


  async getLeaderBoard()
  {
    this.leaderBoard = await this.connectionService.fetchLeaderBoard();
  }
}
