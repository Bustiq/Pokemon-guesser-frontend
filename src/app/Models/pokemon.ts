export class Pokemon {
  id: number;
  nombre: string;
  tipo1: string;
  tipo2: string;
  height: number;
  weight: number;
  eggType: string;
  eggType2: string;
  bodyShape: string;


  constructor(id: number, nombre: string, tipo1: string, tipo2: string, height: number, weight: number, eggType: string, eggType2: string, bodyShape: string) {
    this.id = id;
    this.nombre = nombre;
    this.tipo1 = tipo1;
    this.tipo2 = tipo2;
    this.height = height;
    this.weight = weight;
    this.eggType = eggType;
    this.eggType2 = eggType2;
    this.bodyShape = bodyShape;
  }

}