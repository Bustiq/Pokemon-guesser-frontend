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
  matchGenerations : number[] = [];
  names: string[] = [];
  showLosePopup = false;
  showWinPopup = false;
  comparisons: Map<string, any> = new Map;
  guessInput: string = '';

  constructor(private router: Router, private connectionService: ConnectionService) {

  }
  ngOnInit() {
    this.connectionService.getAllPokemonNames().then((response) => {

      response.forEach((pokemon: any) => {
        this.names.push(pokemon.nombre);
      });
      
    }).catch((error) => {
      console.error("Error al obtener los nombres de los pokemons:", error);
    });

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
    })
  }

  requestRematch() {
    return
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
