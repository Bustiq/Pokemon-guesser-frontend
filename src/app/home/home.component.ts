import { Component } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountError } from '../Models/accountError';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
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
wantsToChallengeUser = false;
isViewingUserOptions = false;
registered = false;
challengeAmount = 0;
challengeUserName = '';
mailSent = false;
sendingMail = false;

challengeGenerations: number[] = [];

onChallengeGenerationChange(gen: number, checked: boolean) {
  if (checked) {
    if (!this.challengeGenerations.includes(gen)) {
      this.challengeGenerations.push(gen);
    }
  } else {
    this.challengeGenerations = this.challengeGenerations.filter(g => g !== gen);
  }
}

openUserOptions() {
this.isViewingUserOptions = !this.isViewingUserOptions;
}

sendChallenge() {
  return
}

cancelChallenge() {
  return;
}

isLoggedIn() : boolean{
  return localStorage.getItem("jwtToken") != null && localStorage.getItem("jwtToken")?.trim() != "";
}
protected isLoggedOut = !this.isLoggedIn()

logout() {
  this.connectionService.setToken("");
  this.isLoggedOut = true;
  this.isViewingUserOptions = false;
  this.connectionService.currentUserName = "";
  this.setCodigoDeError(0);
}

goToUserSettings() {
  //this.router.navigate(['/user-settings']);
}

openChallengeUserForm() {
  this.wantsToChallengeUser = !this.wantsToChallengeUser;
}

//asdasdasd

goToDailyChallenge(){
  this.router.navigate(['/daily-challenge']);
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
      this.setCodigoDeError(0);
      this.connectionService.setToken(v)
      this.isLoggedOut = false;
      this.wantsToRegister = false;
      this.wantsToLogin = false;
      this.forgotPassword = false;
      
    }).catch(e => {
      if (e instanceof AccountError) {
        this.setCodigoDeError(e.codigo);
      } else {
        this.setCodigoDeError(1);
      }})
  }

   getUserName() {
     this.connectionService.loadUserData();
    return this.connectionService.currentUserName;
   
  }

   getUserStatus() {
     this.connectionService.loadUserData();
    return this.connectionService.currentUserStatus;
  }

  goToEndlessMode(){
    return;
  }

  registrar(){
    const body = {
      "nombre" : this.NombreUsuario.value,
      "password" : this.Password.value,
      "email" : this.Mail.value
    }

    this.connectionService.signup(body.nombre, body.password, body.email).then(v => {
      this.setCodigoDeError(0);
      this.registered = true;


    }).catch(e => {
      if (e instanceof AccountError) {
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
    this.setCodigoDeError(0);
    this.sendingMail = true;

    this.connectionService.enviarMailCambiarContrasenia(body.email).then(() => {
      this.setCodigoDeError(0);
      this.mailSent = true;
    }).catch(e => {
      this.mailSent = false;

      if (e instanceof AccountError) {
        this.setCodigoDeError(e.codigo);
      } else {
        this.setCodigoDeError(1);
      }
    }).finally(() => {
        this.sendingMail = false;
    });
 }



  setCodigoDeError(codigo: number) {
      this.errorMessages = [
        "No hay error (que no se vea en rojo)",
        "Error desconocido. Perdón bro.",
        "Nombre de usuario o contraseña incorrectos",
        "Algún campo está vacío",
        "El nombre de usuario ya está en uso",
        "El email ya está en uso",
        "Inicia sesión nuevamente",
        "Cuenta no verificada. Revisa tu mail para loguearte",
        "Ese mail no está registrado",
        "El nombre de usuario no puede contener espacios ni arrobas",
        "El email no es válido",
        "El email no existe"
    ]

    if (codigo != 0){
      this.registered = false
    }

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


