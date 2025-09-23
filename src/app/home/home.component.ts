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
  challengeStake = 0;
  challengeUserName = '';
  mailSent = false;
  sendingMail = false;
  challengeGenerations: number[] = [];
  currentName = ""
  currentStatus = false
  currentCoins = 0
  hasReceivedChallenge = false;
  challengerName = ''
  receivedChallengeGenerations : number[] = [];
  receivedChallengeStake : number = 0
  isWaitingForChallengeResponse = false


  async ngOnInit() {
    await this.connectionService.loadUserData();
    this.currentName = this.connectionService.currentUserName;
    this.currentStatus = this.connectionService.currentUserStatus;
    this.currentCoins = this.connectionService.currentCoins;
    this.connectionService.socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if(message.purpose === 'challengeDelivery') {
        this.challengerName = message.challengerName
        this.receivedChallengeGenerations = message.challengeGenerations
        this.receivedChallengeStake = message.challengeStake
        this.hasReceivedChallenge = true;
       
      }
      if (message.purpose === 'challengeSuccess')
      {
        this.wantsToChallengeUser = false
        this.isWaitingForChallengeResponse = true
      }

      if (message.purpose === 'cancelChallenge')
      {
        this.hasReceivedChallenge = false;
        this.receivedChallengeGenerations = []
        this.receivedChallengeStake = 0
        this.challengerName = ''
      }
      if (message.purpose === 'challengeDeclined')
      {
        this.isWaitingForChallengeResponse = false;
        this.challengeUserName = ''
        this.challengeStake = 0
        this.challengeGenerations = []

      }

      if (message.purpose === 'matchStart')
      {
        //this.router.navigate(['/match'])
      }

    })
    this.checkForCurrentMatch()
  }


  checkForCurrentMatch()
  {
    this.connectionService.checkCurrentMatch().then(v => {

      if (v.hasMatch)
      {
        if(v.matchState == 0)
        {
          if (v.isChallenger)
          {
            this.challengeStake = v.stake
            this.challengeGenerations = v.generations
            this.challengeUserName = v.opponent
            this.isWaitingForChallengeResponse = true
          }
          else
          {
            this.receivedChallengeGenerations = v.generations;
            this.receivedChallengeStake = v.stake;
            this.challengerName = v.opponent
            this.hasReceivedChallenge = true
          }
        }
        
      }

    }).catch(e => {
      if (e instanceof AccountError) {
        this.setCodigoDeError(e.codigo);
      } else {
        this.setCodigoDeError(1);
      }
    })
    
  }

  cancelChallengeProposal() {
    return
  }



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
  this.connectionService.sendChallenge(this.challengeUserName, this.challengeGenerations, this.challengeStake)

}

cancelChallenge() {
  this.wantsToChallengeUser = false;
}

answerChallenge(accept : boolean) {
  this.connectionService.answerChallenge(accept)
  this.hasReceivedChallenge = false;
  this.isWaitingForChallengeResponse = false;
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
    this.wantsToChallengeUser = false;
  }

goToUserSettings() {
  //this.router.navigate(['/user-settings']);
}

openChallengeUserForm() {
  if (!this.isLoggedIn()){
    return
  }
  this.wantsToChallengeUser = !this.wantsToChallengeUser;
}

  //asdasdasd

  goToDailyChallenge(){

    if (!this.isLoggedIn()){
      return
    }
    this.router.navigate(['/daily-challenge']);
  }
  goToEndlessMode(){
    if (!this.isLoggedIn()){
      return
    }
    this.router.navigate(['/endless-mode']);
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


      this.connectionService.loadUserData().then(() => {
        this.currentName = this.connectionService.currentUserName;
        this.currentStatus = this.connectionService.currentUserStatus;
        this.currentCoins = this.connectionService.currentCoins;
      })
      
    }).catch(e => {
      if (e instanceof AccountError) {
        this.setCodigoDeError(e.codigo);
      } else {
        this.setCodigoDeError(1);
      }})
  }

  getUserName() {
    return this.currentName;
  }

  getUserStatus() {
    return this.currentStatus;
  }

  getUserCoins(){

    return this.currentCoins;
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


  getButtonClass(): string {
    return this.isLoggedIn() ? 'colored-button' : 'greyed-out-button';
  }
}


