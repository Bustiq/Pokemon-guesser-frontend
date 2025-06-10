import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ConnectionService } from '../connection.service';
import { ActivatedRoute } from '@angular/router';


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

  // Add missing form controls for type_1 and type_2
  tipo1Pokemon = new FormControl<string>('');
  tipo2Pokemon = new FormControl<string>('');

  // Table, search, and pagination variables (for binding only)
  searchTerm: string = '';
  pokemons: any[] = [];
  filteredPokemons: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  constructor(private router: Router, private connectionService: ConnectionService, private route: ActivatedRoute) {}

  async agregarPokemon()
  {
    await this.connectionService.agregarPokemon(this.idPokemon.value).then(() => {
      alert("Pokemon agregado exitosamente ()");
    }).catch(e => {
      alert("Error al agregar el pokemon: " + e.message);
    });
  }

  async eliminarPokemon()
  {
    await this.connectionService.eliminarPokemon(this.idPokemonEliminar.value).then(() => {
      alert("Pokemon eliminado exitosamente ()");
    }).catch(e => {
      alert("Error al eliminar el pokemon: " + e.message);
    });
  }

  async modificarPokemon()
  {
    await this.connectionService.modificarPokemon(this.idPokemonActualizar.value, this.nombrePokemon.value).then(() => {
      alert("Pokemon modificado exitosamente ()");
    }).catch(e => {
      alert("Error al modificar el pokemon: " + e.message);
    });
  }
}
