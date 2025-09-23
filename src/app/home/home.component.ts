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

  
  
  protected accountErrorMessages: string[] = []
  protected indiceCodigoErrorCuenta = 0
  protected mensajeErrorCuenta = "Todo bien (no mostrar)"

  protected matchErrorMessages: string[] = []
  protected indiceCodigoErrorMatch = 0
  protected mensajeErrorMatch = "Todo bien (no mostrar)"

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
  challengeIsARematch = false
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

        if (message.rematch)
        {
          this.challengeIsARematch = true;
        }
        this.challengerName = message.challengerName
        this.receivedChallengeGenerations = message.challengeGenerations
        this.receivedChallengeStake = message.challengeStake
        this.hasReceivedChallenge = true;
       
      }
      if(message.purpose === 'matchError')
      {

        this.setCodigoDeErrorMatch(message.errorCode)
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
        this.setCodigoDeErrorCuenta(e.codigo);
      } else {
        this.setCodigoDeErrorCuenta(1);
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
  this.connectionService.sendChallenge(this.challengeUserName, this.challengeGenerations, this.challengeStake, false)

}

cancelChallenge() {
  this.wantsToChallengeUser = false;
  this.setCodigoDeErrorMatch(0)
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
    this.setCodigoDeErrorCuenta(0);
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
    this.setCodigoDeErrorCuenta(0);
    this.wantsToRegister = true;
    this.wantsToLogin = false;
    this.forgotPassword = false;
  }
  showLogin() {
    this.setCodigoDeErrorCuenta(0);
    this.wantsToLogin = true;
    this.wantsToRegister = false;
    this.forgotPassword = false;
  }
  cancel() {
    this.setCodigoDeErrorCuenta(0);
    this.wantsToRegister = false;
    this.wantsToLogin = false;
    this.forgotPassword = false;
  }
  resetPass() {
    this.setCodigoDeErrorCuenta(0);
    this.forgotPassword = true;
    this.wantsToRegister = false;
    this.wantsToLogin = false;
  }



  cancelarCambioContrasenia(){
    this.setCodigoDeErrorCuenta(0);
    this.forgotPassword = false
  }

login(){
  const body = {
    "nombre" : this.NombreUsuario.value,
    "password" : this.Password.value
  }



    this.connectionService.login(body.nombre, body.password).then(v => {
      this.setCodigoDeErrorCuenta(0);
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
        this.setCodigoDeErrorCuenta(e.codigo);
      } else {
        this.setCodigoDeErrorCuenta(1);
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
      this.setCodigoDeErrorCuenta(0);
      this.registered = true;


    }).catch(e => {
      if (e instanceof AccountError) {
        this.setCodigoDeErrorCuenta(e.codigo);
      } else {
        this.setCodigoDeErrorCuenta(1);
      }
    })
  }

 enviarMailCambiarContrasenia() {
    const body = {
      "email": this.Mail.value
    };
    this.setCodigoDeErrorCuenta(0);
    this.sendingMail = true;

    this.connectionService.enviarMailCambiarContrasenia(body.email).then(() => {
      this.setCodigoDeErrorCuenta(0);
      this.mailSent = true;
    }).catch(e => {
      this.mailSent = false;

      if (e instanceof AccountError) {
        this.setCodigoDeErrorCuenta(e.codigo);
      } else {
        this.setCodigoDeErrorCuenta(1);
      }
    }).finally(() => {
        this.sendingMail = false;
    });
 }



  setCodigoDeErrorCuenta(codigo: number) {
      this.accountErrorMessages = [
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

    this.indiceCodigoErrorCuenta = codigo;
    
    if (this.indiceCodigoErrorCuenta < 0 || this.indiceCodigoErrorCuenta >= this.accountErrorMessages.length) {
      this.mensajeErrorCuenta = "Error super desconocido";
      alert(this.mensajeErrorCuenta)
      return
    }
    this.mensajeErrorCuenta = this.accountErrorMessages[this.indiceCodigoErrorCuenta];
  }


  setCodigoDeErrorMatch(codigo: number) {
    this.matchErrorMessages = [
      "No hay error (que no se vea en rojo)",
      "Error desconocido. Perdón bro.",
      "Algún campo está vacío",
      "Error de base de datos. por favor reportar",
      "No tienes monedas suficientes",
      "Tienes una partida pendiente o activa. Mira tus notificaciones",
      "No puedes desafiarte a ti mismo",
      "No hay nadie con ese nombre",
      "Esa cuenta no tiene suficientes monedas",
      "Esa cuenta tiene una partida pendiente o activa",
      "Esa cuenta está offline"
    ]


    this.indiceCodigoErrorMatch = codigo;
    
    if (this.indiceCodigoErrorMatch < 0 || this.indiceCodigoErrorMatch >= this.matchErrorMessages.length) {
      this.mensajeErrorCuenta = "Error super desconocido";
      alert(this.mensajeErrorCuenta)
      return
    }
    this.mensajeErrorMatch = this.matchErrorMessages[this.indiceCodigoErrorMatch];
  }




  getButtonClass(): string {
    return this.isLoggedIn() ? 'colored-button' : 'greyed-out-button';
  }
}


