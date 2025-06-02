import { Component } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-pass',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-pass.component.html',
  styleUrl: './reset-pass.component.css'
})
export class ResetPassComponent {
  Contrasenia = new FormControl<string>('');
  Confirmacion = new FormControl<string>('');

  constructor(private router: Router, private connectionService: ConnectionService) {}
  
  cambiarContrasenia() {
    if (this.Contrasenia.value !== this.Confirmacion.value) {
      alert("Las contraseñas no coinciden");
      return;
    }
    this.connectionService.resetPassword(this.Contrasenia.value).then(() => {
      alert("Contraseña cambiada exitosamente");
      this.router.navigate(['/']);
    }
    
    );
}
}