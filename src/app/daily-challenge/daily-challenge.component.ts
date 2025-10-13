import { Component } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { GuessService } from '../guess.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import axios from 'axios';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field'

@Component({
  selector: 'app-daily-challenge',
  imports: [CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,],
  templateUrl: './daily-challenge.component.html',
  styleUrl: './daily-challenge.component.css'
})
export class DailyChallengeComponent {

  names: Map<string, number> = new Map;
  filteredNames!: Observable<string[]>;
  guessInput = new FormControl('');
  pokemons: Map<string, any> = new Map;
  comparisons: Map<string, any> = new Map;



  constructor(private router: Router, private connectionService: ConnectionService, private guessService: GuessService) {

  }
  ngOnInit() {
    this.connectionService.asignDailyChallenge().then(() => {
      
    }).catch((error) => {
      console.error("Error al asignar el desafío diario:", error);

    });


    this.connectionService.getAllPokemonFromGenerations([1]).then((response) => {

      response.forEach((pokemon: any) => {
        this.names.set(pokemon.nombre, pokemon.numeroPokedex);
      });
      
    }).catch((error) => {
      console.error("Error al obtener los nombres de los pokemons:", error);
    });

    this.filteredNames = this.guessInput.valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value || '')),
    );

  }

  
  filter(value: string): string[] {
    return this.guessService.filter(value, this.names)
  }

   async guessPokemon(guess: string) {

    if (!this.names.has(guess.toLowerCase()))
    {
      return
    }

    try{
      const response = await this.connectionService.sendDailyPokemonGuess(guess)
      
      
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
    }
  }

  pokemonWasAttempted(pokemon: any): boolean {
  
    return this.pokemons.has(pokemon.nombre);
  }
  
  getCSSClass(field : string, pokemonName : string): string {
    
    //alert(field  + ": " + this.comparisons.get(pokemonName)[field])

    return this.comparisons.get(pokemonName)[field];
  }

  getImageUrl(pokemonName : string){
    pokemonName = pokemonName.toLocaleLowerCase()
    return this.guessService.getImageUrl(this.names.get(pokemonName))
  }
}
