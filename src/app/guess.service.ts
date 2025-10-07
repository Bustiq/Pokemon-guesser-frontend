import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GuessService {

  constructor() { }

  getImageUrl(pokedexNumber : number | undefined){
    return "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/" + pokedexNumber + ".svg"
  }

   filter(value: string, namesMap : Map<string, number>): string[] {
    if (value == "")
    {
      return []
    }
    const filterValue = value.toLowerCase();


    return Array.from(namesMap.keys()).filter(option => option.toLowerCase().startsWith(filterValue));
  }
}
