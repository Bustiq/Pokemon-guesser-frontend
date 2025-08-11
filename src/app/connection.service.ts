import { Injectable } from '@angular/core';
import axios from 'axios';
import { filter } from 'rxjs';
import { AccountError, EmptyFieldError, MissingTokenError } from './Models/accountError';



@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  currentUserName : string;
  currentUserStatus : boolean;
  url = 'http://localhost:3000/' ;
  pokemonRouter = 'pokemon/';

  private token: string | null = null;

  constructor() {
    this.currentUserName = "";
    this.currentUserStatus = false;
    const storedToken = localStorage.getItem('jwtToken');
    if (storedToken) {
      this.token = storedToken;
    }
  }

  attempts = 10;

  async loadUserData() {

    const token = localStorage.getItem("jwtToken");
    if (!token){
      return
    }

    this.attempts -= 1;
    if (this.attempts <= 0) {
      console.error("No se pudo cargar el usuario después de varios intentos.");
      return;
    }

    //alert("nombre de usuaro:" + this.currentUserName)
    if (this.currentUserName != "") {
      
      //alert(this.currentUserName)
      return
    } 
    //alert("?????")
    
    try{
      var response = await axios.get(this.url + 'getUserData', this.getHeaders())
      // alert("Respuesta del servidor: " + JSON.stringify(response.data))
      this.currentUserName = response.data.username;
      this.currentUserStatus = response.data.admin;
      
      //alert(this.currentUserName)
    }
    catch(error) {
      //alert("errorrrrrrrrr: #" + JSON.stringify(error))
    }
    //this.currentUserName = 

  }

  setToken(token: string) {
    this.token = token;
    // Store the token in localStorage
    localStorage.setItem('jwtToken', token);
  }

  private getHeaders() {
    if (!this.token) {
      throw new Error("Token no disponible. Por favor, inicie sesión.");
    }
    return {
      headers: {
        authorization: `Bearer ${this.token}`
      }
    };
  }

  async login(username: String | null, password: String | null) {

    if (username == null || password == null || username == "" || password == "" ) {
      throw new EmptyFieldError()
    }

    try{
            
      alert("Intentando loguear usuario: ")
      const response = await axios.post(this.url + 'login', {
        username: username,
        password: password
      });
      
      this.setToken(response.data.token);
      return response.data;
    }
    catch (error) {
      
      throw new AccountError((error as any).response.data.error, (error as any).response.data.errorCode)
      /*if ((error as any).response.data.errorCode)
      {
        throw new AccountError((error as any).response.data.error, (error as any).response.data.errorCode)
      }
      throw new Error("Nombre de usuario o contraseña incorrectos");
      */
    }

  }

  async signup(username: String | null, password: String | null, email: String | null) {

    
    if (username == null || password == null || email == null || username == "" || password == "" || email == "" ) {
      throw new EmptyFieldError();
    }

    try{
    console.log("Registrando usuario: " + username + " con email: " + email + " y contraseña: " + password);

    alert("Creando...");
    const response = await axios.post(this.url + 'register', {
      username: username,
      password: password,
      mail: email
    });

    alert("Usuario creado");
    return response.data;
    } catch (error) {
      if ((error as any).response.data.errorCode) {
        throw new AccountError((error as any).response.data.error, (error as any).response.data.errorCode);
      }
      throw new AccountError("Error al registrar el usuario: " + (error as any).message);
    }
  }

  
  resetPassword(newPassword: String | null, token: String | null) {

    if (newPassword == null || newPassword == "" ) {
      throw new EmptyFieldError();
    }
    if (token == null || token == "" ) {
      throw new MissingTokenError();
    }

    return axios.patch(this.url + 'reset-password/' + token,  {
      newPassword: newPassword
    }).then(response => {
        alert("Contraseña cambiada exitosamente");
        return response.data;
      })
      .catch(error => {
        console.error("Error al cambiar la contraseña:", error);
        throw error;
      });
  }

  async getPokemons(searchTerm: string = "", numeroPagina: number = 1, filters: any = {}) {
    const params = {
      nombre: searchTerm,
      filtros: filters

    };
    console.log("Obteniendo pokemons con los siguientes parametros: ", params, " desde la URL: ", this.url + this.pokemonRouter + 'pagina/' + String(numeroPagina));
    try {
      const response = await axios.post(this.url + this.pokemonRouter + 'pagina/' + String(numeroPagina), {
        params: params,

      }, this.getHeaders());
      return response.data;
    } catch (error) {
      console.error("Error al obtener los pokemons:", error);
      throw error;
    }
  }


  async enviarMailCambiarContrasenia(Email: String | null) {

    if (Email == null || Email == "") {
      throw new EmptyFieldError()
    }
    
    try{
      const response = await axios.post(this.url + 'request-password-reset', {
        mail: Email
      })
      return response.data;
    }
    catch (error) {
      if ((error as any).response.data.errorCode) {
        throw new AccountError((error as any).response.data.error, (error as any).response.data.errorCode);
      }

      throw new AccountError("Error al registrar el usuario: " + (error as any).message);
    }
  }

  async agregarPokemon(pokedexNumber : number | null) {
    var response;
    if (pokedexNumber == null || pokedexNumber < 1) {
      throw new Error("Numero de pokedex invalido");
    }
    console.log(this.getHeaders())

    try {
      alert("Comenzando comunicacion con el back (si no hay más alerts está mal)")
      response = await axios.post(this.url + this.pokemonRouter + "addPokemon/" +String(pokedexNumber),undefined , this.getHeaders());
      alert("Backend respondio exitosamente");
    } catch (error) {
      
    }

    alert(pokedexNumber + " agregado exitosamente");
  }

  async eliminarPokemon(pokedexNumber: number | null) {
  
    console.log("Eliminando Pokemon con numero de pokedex: " + String(pokedexNumber), " desde la URL: " + this.url + this.pokemonRouter + "deletePokemon/" + String(pokedexNumber));
    const response = await axios.delete(this.url + this.pokemonRouter + "deletePokemon/" + String(pokedexNumber), this.getHeaders());
    alert("Pokemon eliminado exitosamente");
    return response.data;
  }

  async modificarPokemon(id: number | null, updateData: any = {}) {
    
   
    const response = await axios.patch(this.url + this.pokemonRouter + "updatePokemon/" + String(id), {
      updateData

    }, this.getHeaders());

    alert("Pokemon modificado exitosamente");
    return response.data;
  }
 

  datosSonValidos(id: number | null, Nombre: String | null, Precio: number | null, enStock: boolean | null) {
    if (id == null || Nombre == null || Nombre == "" || Precio == null || enStock == null) {
      return false;
    }
    return true;
  }

}