import { Component } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { GuessService } from '../guess.service';
import { Observable } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import {map, startWith} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field'

@Component({
  selector: 'app-match',

  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: './match.component.html',
  styleUrl: './match.component.css'
})
export class MatchComponent {

  opponentName = "";
  matchStake = 0;
  hasReceivedRematchRequest = false
  matchGenerations : number[] = [];
  names: Map<string, number> = new Map;
  filteredNames!: Observable<string[]>;
  guessInput = new FormControl('');
  pokemons: Map<string, any> = new Map;
  comparisons: Map<string, any> = new Map;
  showLosePopup = false;
  showWinPopup = false;
  

  constructor(private router: Router, private connectionService: ConnectionService, private guessService: GuessService) {

  }
  ngOnInit() {
    //to do: Debería vaciar toda la informacion de la partida sin reiniciar la pagina
    this.connectionService.generateWebSocket();
    this.checkForCurrentMatch();
    
    this.filteredNames = this.guessInput.valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value || '')),
    );

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

    getImageUrl(pokemonName : string){
    pokemonName = pokemonName.toLocaleLowerCase()
    return this.guessService.getImageUrl(this.names.get(pokemonName))
  }

  filter(value: string): string[] {
    return this.guessService.filter(value, this.names)
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
        if (v.hasMatch && v.matchState == 1)
        { 
          this.matchStake = v.stake
          this.matchGenerations = v.generations
          this.opponentName = v.opponent

          this.connectionService.getAllPokemonFromGenerations(this.matchGenerations).then((response) => {

            response.forEach((pokemon: any) => {
              this.names.set(pokemon.nombre, pokemon.numeroPokedex);
            });
            
          }).catch((error) => {
            console.error("Error al obtener los nombres de los pokemons:", error);
          });
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
        this.guessInput.setValue(''); // Vacía el input también en caso de fallo
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
