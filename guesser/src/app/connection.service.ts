import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  url = 'http://localhost:3000/';
  pokemonRouter = 'pokemon/';
  private token: string | null = null;

  constructor() {
    // Retrieve token from localStorage on service initialization
    const storedToken = localStorage.getItem('jwtToken');
    if (storedToken) {
      this.token = storedToken;
    }
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
        Authorization: `Bearer ${this.token}`
      }
    };
  }

  async login(username: String | null, password: String | null) {
    if (username == null || password == null || username == "" || password == "" ) {
      throw new Error("Nombre de usuario o contraseña vacios");
    }

    try{

      const response = await axios.post(this.url + 'login', {
        username: username,
        password: password
      });

      this.setToken(response.data.token);
      return response.data;
    }
    catch (error) {
      throw new Error("Nombre de usuario o contraseña incorrectos");
    }

  }

  async signup(username: String | null, password: String | null, email: String | null) {

    
    if (username == null || password == null || username == "" || password == "") {
      throw new Error("Nombre de usuario o contraseña vacios");
    }
      console.log("Registrando usuario: " + username + " con email: " + email + " y contraseña: " + password);

    alert("Creando...");
    const response = await axios.post(this.url + 'register', {
      username: username,
      password: password,
      mail: email
    });

    alert("Usuario creado");
    return response.data;
  }

  
  resetPassword(newPassword: String | null, token: String | null) {

    if (newPassword == null || newPassword == "" ) {
      throw new Error("Contraseña vacia");
    }
    if (token == null || token == "" ) {
      throw new Error("Token vacio");
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


  async enviarMailCambiarContrasenia(Email: String | null) {

    if (Email == null || Email == "") {
      throw new Error("Email vacio");
    }
    
    axios.post(this.url + 'request-password-reset', {
      mail: Email
    }).then(response => {
        alert("Email enviado exitosamente");
        return response.data;

    }).catch(error => {
        alert(":(")
        console.error("Error al enviar el email: ", this.url + 'request-password-reset', " ", error);
        throw error;
    });
  }

  async agregarPokemon(pokedexNumber : number | null) {
    var response;
    if (pokedexNumber == null || pokedexNumber < 1) {
      throw new Error("Numero de pokedex invalido");
    }

    try {
      response = await axios.post(this.url + this.pokemonRouter + "addPokemon/" +String(pokedexNumber), this.getHeaders());
    } catch (error) {
      throw error;
    }

    alert(response.data.name + " agregado exitosamente");
  }

  async eliminarPokemon(pokedexNumber: number | null) {
    const response = await axios.delete(this.url + this.pokemonRouter + "deletePokemon/" + String(pokedexNumber), this.getHeaders());
    alert("Pokemon eliminado exitosamente");
    return response.data;
  }

  async modificarPokemon(id: number | null, Nombre: String | null) {
    if (id == null || Nombre == null || Nombre == "") {
      throw new Error("Datos invalidos para modificar el Pokemon");
    }

    const response = await axios.patch(this.url + this.pokemonRouter + "updatePokemon/" + String(id), {
      nombre: Nombre
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