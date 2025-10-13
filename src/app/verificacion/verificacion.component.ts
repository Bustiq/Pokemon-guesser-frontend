import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from '../connection.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verificacion',
  imports: [CommonModule],
  templateUrl: './verificacion.component.html',
  styleUrl: './verificacion.component.css'
})
export class VerificacionComponent {

  token: string | null = "";
  error: boolean = false;
  accountVerified: boolean = false;

  constructor(private router: Router, private connectionService: ConnectionService, private route: ActivatedRoute) {}
  

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token');
    this.connectionService.verify(this.token).then(() => {
      // Success: you can add a success message or redirect
      this.accountVerified = true;
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    
    }).catch(e => {
      alert("etiopia")
      this.error = true;
    });
  }

}
