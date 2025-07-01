import { Component } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginError } from '../Models/loginError';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

protected errorMessages: string[] = []


protected indiceCodigoError = 0
protected mensajeError = "Todo bien (no mostrar)"

constructor(private router: Router, private connectionService: ConnectionService) {

}
protected Password = new FormControl<String>('')
protected NombreUsuario = new FormControl<String>('')
protected Mail = new FormControl<String>('')
protected forgotPassword = false
wantsToRegister = false;
wantsToLogin = false;
isViewingUserOptions = false;

openUserOptions() {
this.isViewingUserOptions = !this.isViewingUserOptions;
}

isLoggedIn() : boolean{
  return localStorage.getItem("jwtToken") != null
}
protected isLoggedOut = !this.isLoggedIn()

logout() {
  this.connectionService.setToken("");
  this.isLoggedOut = true;
  this.isViewingUserOptions = false;
  this.connectionService.currentUserName = "";
  this.setCodigoDeError(0);
  alert("Logged out successfully");
}

goToUserSettings() {
  //this.router.navigate(['/user-settings']);
}

goToABM() {
  this.router.navigate(['/abm']);
}
showRegister() {
  this.setCodigoDeError(0);
  this.wantsToRegister = true;
  this.wantsToLogin = false;
  this.forgotPassword = false;
}
showLogin() {
  this.setCodigoDeError(0);
  this.wantsToLogin = true;
  this.wantsToRegister = false;
  this.forgotPassword = false;
}
cancel() {
  this.setCodigoDeError(0);
  this.wantsToRegister = false;
  this.wantsToLogin = false;
  this.forgotPassword = false;
}
resetPass() {
  this.setCodigoDeError(0);
  this.forgotPassword = true;
  this.wantsToRegister = false;
  this.wantsToLogin = false;
}



cancelarCambioContrasenia(){
  this.setCodigoDeError(0);
  this.forgotPassword = false
}

login(){
  const body = {
    "nombre" : this.NombreUsuario.value,
    "password" : this.Password.value
  }

    this.connectionService.login(body.nombre, body.password).then(v => {
      alert("Login exitoso")
      this.setCodigoDeError(0);
      alert(v)
      this.connectionService.setToken(v)
      this.isLoggedOut = false;
      
    }).catch(e => {
      if (e instanceof LoginError) {
        this.setCodigoDeError(e.codigo);
      } else {
        this.setCodigoDeError(1);
      }})
  }

  getUserName() {
    this.connectionService.loadUserName();
    return this.connectionService.currentUserName;
   
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
      this.setCodigoDeError(0);
    }).catch(e => {
      if (e instanceof LoginError) {
        this.setCodigoDeError(e.codigo);
      } else {
        this.setCodigoDeError(1);
      }
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



  setCodigoDeError(codigo: number) {
      this.errorMessages = [
        "No hay error (que no se vea en rojo)",
        "Error desconocido. Perdón bro.",
        "Nombre de usuario o contraseña incorrectos",
        "Nombre de usuario o contraseña vacíos",
        "El nombre de usuario ya está en uso",
        "El email ya está en uso",
        "El email no es válido",
        "El email no existe",
        "El email no puede estar vacío",
        "La contraseña no puede estar vacía",
        "El nombre de usuario no puede estar vacío",
        "El nombre de usuario no puede contener espacios ni arrobas",
        "Mail inválido"
    ]

    this.indiceCodigoError = codigo;
    
    if (this.indiceCodigoError < 0 || this.indiceCodigoError >= this.errorMessages.length) {
      this.mensajeError = "Error desconocido";
      alert(this.mensajeError)
      return
    }
    this.mensajeError = this.errorMessages[this.indiceCodigoError];
  }

  hayError(): boolean {
    return this.indiceCodigoError != 0;
  }


}


