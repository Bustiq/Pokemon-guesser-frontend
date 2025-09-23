import { Component } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-match',
  imports: [CommonModule, FormsModule],
  templateUrl: './match.component.html',
  styleUrl: './match.component.css'
})
export class MatchComponent {
pokemons: Map<string, any> = new Map;


  opponentName = "";
  matchStake = 0;
  hasReceivedRematchRequest = false
  matchGenerations : number[] = [];
  names: string[] = [];
  showLosePopup = false;
  showWinPopup = false;
  comparisons: Map<string, any> = new Map;
  guessInput: string = '';
  
  constructor(private router: Router, private connectionService: ConnectionService) {
    
  }
  ngOnInit() {
    //to do: Debería vaciar toda la informacion de la partida sin reiniciar la pagina
    this.connectionService.generateWebSocket();
    this.connectionService.getAllPokemonNames().then((response) => {
      
      response.forEach((pokemon: any) => {
        this.names.push(pokemon.nombre);
      });
      
    }).catch((error) => {
      console.error("Error al obtener los nombres de los pokemons:", error);
    });
    this.checkForCurrentMatch();
    
    this.connectionService.socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.purpose === "notifyWin") {
        this.showWinPopup = true;
        this.showLosePopup = false;
      }
      else if (message.purpose === "notifyLoss")
        {
          this.showLosePopup = true;
          this.showWinPopup = false;
        }

      else if (message.purpose === 'challengeDelivery' && message.rematch)
      {
        this.hasReceivedRematchRequest = true
        
      }
      })
    }
    
  async answerRematch(answer : boolean)
  {
    await this.connectionService.answerChallenge(answer);
    this.hasReceivedRematchRequest = false
    if(!answer)
    {
      this.router.navigate(['/'])
    }
  }


  checkForCurrentMatch()
    {
      
      this.connectionService.checkCurrentMatch().then(v => {
        alert(JSON.stringify(v))
        if (v.hasMatch)
        { 
          this.matchStake = v.stake
          this.matchGenerations = v.generations
          this.opponentName = v.opponent
        }
  
      })
    }

  requestRematch() {
    if(!this.hasReceivedRematchRequest) {
    this.connectionService.sendChallenge(this.opponentName, this.matchGenerations, this.matchStake, true)
    }
    else {
      this.answerRematch(true);
    }
  }

  goHome() {
    this.router.navigate(['/'])
  }

  

   async guessPokemon(guess: string) {

    try{

      this.connectionService.sendMatchPokemonGuessWebSocket(guess)




      const response = await this.connectionService.sendMatchPokemonGuess(guess)
      
      
      var guessedPokemon = response.pokemonData


      
      if(this.pokemonWasAttempted(guessedPokemon)) {
        return
      }
      

      
      var comparison = response.dataComparison;
      this.comparisons.set(guessedPokemon.nombre, comparison);


      const tempMap = new Map<string, number>();
      tempMap.set(guessedPokemon.nombre, guessedPokemon);


      this.pokemons.forEach((value, key) => {
        tempMap.set(key, value);
      });

      this.pokemons = tempMap

      
      console.log(this.pokemons);
     
      
      if (response.dataComparison.correct) {
        alert("¡Felicidades! Has adivinado el Pokémon correctamente.");
      } else {
        this.guessInput = ''; // Vacía el input también en caso de fallo
        /*
        var comparison = response.dataComparison;
        var entries = Object.entries(comparison);
        for (let [key, value] of entries) {
         // alert(`${key}: ${value}`);
        }*/
      }
    } catch(error) {
      console.error("Error al enviar el guess:", error);
      alert(error);
    }
  }

  pokemonWasAttempted(pokemon: any): boolean {
  
    return this.pokemons.has(pokemon.nombre);
  }
  
  getCSSClass(field : string, pokemonName : string): string {
    
    //alert(field  + ": " + this.comparisons.get(pokemonName)[field])

    return this.comparisons.get(pokemonName)[field];
  }
}
