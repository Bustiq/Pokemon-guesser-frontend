
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
  selector: 'app-endless-mode',
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: './endless-mode.component.html',
  styleUrl: './endless-mode.component.css'
})
export class EndlessModeComponent {

  names: Map<string, number> = new Map;
  filteredNames!: Observable<string[]>;
  guessInput = new FormControl('');
  pokemons: Map<string, any> = new Map;
  comparisons: Map<string, any> = new Map;

  
  generations: number[] = [];
  generationsToPlay : number[] = []


  
  constructor(private router: Router, private connectionService: ConnectionService, private guessService : GuessService) {

  }



  ngOnInit() {



    this.filteredNames = this.guessInput.valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value || '')),
    );

  }
  filter(value: string): string[] {
    return this.guessService.filter(value, this.names)
  }

  addGeneration(gen: number) {
    if (!this.generations.includes(gen)) {
      this.generations.push(gen);
    }
  }

  removeGeneration(gen: number) {
    const index = this.generations.indexOf(gen);
    if (index > -1) {
      this.generations.splice(index, 1);
    }
  }

  onGenerationChange(gen: number, checked: boolean) {
    if (checked) {
      this.addGeneration(gen);
    } else {
      this.removeGeneration(gen);
    }
    console.log(this.generations);
  }


  async startGame(){


    this.pokemons.clear();
    this.comparisons.clear();
    this.guessInput.setValue('');

    await this.connectionService.asignEndlessModePokemon(this.generations).then( (response) => {
      console.log("Ok")
      
    }).catch( (error) => {
      console.error("Error al iniciar el modo endless: " + error);
    });
    
    this.generationsToPlay = []
    this.names = new Map()
    for (const gen of this.generations)
    {
      this.generationsToPlay.push(gen)
    }


    this.generationsToPlay.sort()


    this.connectionService.getAllPokemonFromGenerations(this.generationsToPlay).then((response) => {

      response.forEach((pokemon: any) => {
        this.names.set(pokemon.nombre, pokemon.numeroPokedex);
      });
      
    }).catch((error) => {
      console.error("Error al obtener los nombres de los pokemons:", error);
    });
  }


  async guessPokemon(guess: string) {

    try{
      const response = await this.connectionService.sendEndlessPokemonGuess(guess)
      
      
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
        this.guessInput.setValue('');  // Vacía el input también en caso de fallo
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
