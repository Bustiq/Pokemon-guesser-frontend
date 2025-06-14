import { Component } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
constructor(private router: Router, private connectionService: ConnectionService) {}
protected Password = new FormControl<String>('')
protected NombreUsuario = new FormControl<String>('')
protected Mail = new FormControl<String>('')
protected forgotPassword = false


resetPass(){
  this.forgotPassword = true
}

cancelarCambioContrasenia(){
  this.forgotPassword = false
}

login(){

  const body = {
    "nombre" : this.NombreUsuario.value,
    "password" : this.Password.value
  }

    this.connectionService.login(body.nombre, body.password).then(v => {
      alert("Login exitoso")
      alert(v)
      this.connectionService.setToken(v)
      
    }).catch(e => {
      alert(e.message)
    })
  }

  registrar(){
    const body = {
      "nombre" : this.NombreUsuario.value,
      "password" : this.Password.value,
      "email" : this.Mail.value
    }

    alert("Registrando usuario: " + body.nombre + " con email: " + body.email + " y contraseña: " + body.password)
    this.connectionService.signup(body.nombre, body.password, body.email).then(v => {
      alert("Registro exitoso")
      
    }).catch(e => {

      alert(e.message);
    })
  }

 enviarMailCambiarContrasenia() {
    const body = {
      "email": this.Mail.value
    };
    alert("Intentando mandar mail de cambiar contraseña")
    

    this.connectionService.enviarMailCambiarContrasenia(body.email).then(() => {
      alert("Email enviado exitosamente");
    }).catch(e => {
      alert("Error al enviar el email " + e.message);
    }).finally(() => {
      alert("Mail handleado")
    });
 }
}
