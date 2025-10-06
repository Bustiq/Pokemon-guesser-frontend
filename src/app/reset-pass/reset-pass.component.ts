import { Component } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-reset-pass',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-pass.component.html',
  styleUrl: './reset-pass.component.css'
})
export class ResetPassComponent {
  hasChangedPassword = false;
  Contrasenia = new FormControl<string>('');
  Confirmacion = new FormControl<string>('');
  token: string | null = "";
  errorMessage: string = '';

  constructor(private router: Router, private connectionService: ConnectionService, private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
  }

  cambiarContrasenia() {
    this.errorMessage = '';
    if (this.Contrasenia.value !== this.Confirmacion.value) {
      this.errorMessage = "Las contraseñas no coinciden";
      return;
    }

    this.connectionService.resetPassword(this.Contrasenia.value, this.token).then(() => {
      this.hasChangedPassword = true; 
      
    });
  }
}