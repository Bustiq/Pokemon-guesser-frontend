import { Component } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import axios from 'axios';


@Component({
  selector: 'app-daily-challenge',
  imports: [CommonModule],
  templateUrl: './daily-challenge.component.html',
  styleUrl: './daily-challenge.component.css'
})
export class DailyChallengeComponent {
 @ViewChild('tipo_1', { static: false }) tipo1HTML: ElementRef;
  pokemons: any[] = [];

  comparison: any;

  constructor(private router: Router, private connectionService: ConnectionService, private elementRef: ElementRef) {
    this.tipo1HTML = new ElementRef(null);
    this.pokemons = [];

  }
  ngOnInit() {
    this.connectionService.asignDailyChallenge().then(() => {
      
    }).catch((error) => {
      console.error("Error al asignar el desafío diario:", error);

    });
  }

  

   async guessPokemon(guess: string) {

    try{
      const response = await this.connectionService.sendPokemonGuess(guess)
      
      var guessedPokemon = response.pokemonData

      
      if(this.pokemonWasAttempted(guessedPokemon)) {
        return
      }
      
      if (this.tipo1HTML && this.tipo1HTML.nativeElement) {
        this.tipo1HTML.nativeElement.style.backgroundColor = "red";
      }
      this.comparison = response.dataComparison;
      alert(JSON.stringify(this.comparison))
      this.pokemons.push(guessedPokemon);

      if (response.dataComparison.correct) {
          alert("¡Felicidades! Has adivinado el Pokémon correctamente.");
      } else {
        /*
        var comparison = response.dataComparison;
        var entries = Object.entries(comparison);
        for (let [key, value] of entries) {
         // alert(`${key}: ${value}`);
        }*/
      }
    } catch(error) {
      console.error("Error al enviar el guess:", error);
      alert("Error al enviar el guess. Por favor, inténtalo de nuevo.");
    }
  }

  pokemonWasAttempted(pokemon: any): boolean {
  
    return this.pokemons.some(p => p.nombre === pokemon.nombre);
  }
  
  getCSSClass(field : string): string {
    
    alert(field  + ": " + this.comparison[field])
    return "red"
    //return this.comparison[field];
  }
}
