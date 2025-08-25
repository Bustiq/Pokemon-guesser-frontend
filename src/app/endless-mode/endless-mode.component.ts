
import { Component } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import axios from 'axios';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-endless-mode',
  imports: [FormsModule, CommonModule],
  templateUrl: './endless-mode.component.html',
  styleUrl: './endless-mode.component.css'
})
export class EndlessModeComponent {

  generations: number[] = [];
  
  constructor(private router: Router, private connectionService: ConnectionService) {

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
    await this.connectionService.asignEndlessModePokemon(this.generations).then( (response) => {
      console.log("Ok")
    
    }).catch( (error) => {
      console.error("Error al iniciar el modo endless: " + error);
    });
  }




}
