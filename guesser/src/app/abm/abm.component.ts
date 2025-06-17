import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ConnectionService } from '../connection.service';
import { ActivatedRoute } from '@angular/router';
import { Pokemon } from '../Models/pokemon';

@Component({
  selector: 'app-abm',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './abm.component.html',
  styleUrl: './abm.component.css'
})
export class AbmComponent {
  idPokemon = new FormControl<number>(0);
  nombrePokemon = new FormControl<string>('');
  idPokemonEliminar = new FormControl<number>(0);
  idPokemonActualizar = new FormControl<number>(0);
  tipo1Pokemon = new FormControl<string>('');
  tipo2Pokemon = new FormControl<string>('');
  searchTerm: string = '';
  maxPage: number = 130;
  pokemons: any[] = [];
  filteredPokemons: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  selectedPokemonId : number | null = null;
  isEditing: boolean = false;

  constructor(private router: Router, private connectionService: ConnectionService, private route: ActivatedRoute) {}


  ngOnInit() {
      this.searchTerm = "";
      this.loadPokemons();
      
  }

  async loadPokemons() {
    try {
      const response = await this.connectionService.getPokemons(this.searchTerm, this.currentPage);
      console.log(response);
      this.pokemons = response;
      
      this.filteredPokemons = this.pokemons;
     
    } catch (error) {
      console.error('Error al cargar los pokemons:', error);
    }
  }

  searchPokemons(value: string) {
    this.searchTerm = value;
    this.loadPokemons();
  }
  async changePage(difference: number) {
    if (this.currentPage + difference < 1) {
      return;
    }
    this.currentPage += difference;
    await this.loadPokemons();
  }

  goToPage(page: any) {
    const pageNum = Number(page);
  
    if (pageNum && pageNum >= 1 && (!this.maxPage || pageNum <= this.maxPage)) {
      this.currentPage = pageNum;
      this.loadPokemons();
    } else {
      setTimeout(() => {
        const input = document.querySelector('.page-number') as HTMLInputElement;
        if (input) input.value = String(this.currentPage);
      });
    }
  }
    async agregarPokemon()
  {
    await this.connectionService.agregarPokemon(this.idPokemon.value).then(() => {
      alert("Pokemon agregado exitosamente (component)");
    }).catch(e => {
      alert("Error al agregar el pokemon: " + e.message);
    });
  }

  async eliminarPokemon(idPokemon: number)
  {
    await this.connectionService.eliminarPokemon(idPokemon).then(() => {
      alert("Pokemon eliminado exitosamente (component)");
    }).catch(e => {
      alert("Error al eliminar el pokemon: " + e.message);
    });
  }



  async startEdit(pokemonId: number) {
    this.isEditing = true;
    this.selectedPokemonId = pokemonId;
    console.log("Editando Pokemon con ID: " + pokemonId);
  }

  async modificarPokemon(id: number, newNombre: string, newTipo1: string, newTipo2: string)
  {
    const updateData: any = {};

    if (newNombre !== '') {
      updateData.nombre = newNombre;
    }
    if (newTipo1 !== '') {
      updateData.tipo_1 = newTipo1;
    }
    if (newTipo2 !== '') {
      updateData.tipo_2 = newTipo2;
    }

    // Only send updateData if it has properties
    if (Object.keys(updateData).length > 0) {
      // Send updateData to backend
      this.connectionService.modificarPokemon(id, updateData);
    }
  }
}
