import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConnectionService } from './connection.service';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountError } from './Models/accountError';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'guesser';
/*
  constructor(private router: Router, private connectionService: ConnectionService) {
  }

  async ngOnInit() {
    console.log("zingaba")
    this.connectionService.socket.addEventListener('message', (event) =>
    {
      const message = JSON.parse(event.data);
      console.log("mensaje")
      if (message.purpose === 'matchStart')
      {
        this.router.navigate(['/match'])
      }
    })
  }*/
}
