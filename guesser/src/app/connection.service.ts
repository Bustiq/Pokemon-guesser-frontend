import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  url = 'http://localhost:3000/';
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

    const response = await axios.post(this.url + 'login', {
      username: username,
      password: password
    });

    // Store the token
    this.setToken(response.data.token);
    return response.data;
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

  
  resetPassword(newPassword: String | null) {

    if (newPassword == null || newPassword == "") {
      throw new Error("Contraseña vacia");
    }

    return axios.patch(this.url + 'reset-password', {
      password: newPassword
    }).then(response => {
        alert("Contraseña cambiada exitosamente");
        return response.data;
      })
      .catch(error => {
        console.error("Error al cambiar la contraseña:", error);
        throw error;
      });
  }


  enviarMailCambiarContrasenia(Email: String | null) {

    if (Email == null || Email == "") {
      throw new Error("Email vacio");
    }
    
    return axios.post(this.url + 'request-password-reset', {
      mail: Email
    }).then(response => {
        alert("Email enviado exitosamente");
        return response.data;
      })
      .catch(error => {
        console.error("Error al enviar el email: ", this.url + 'request-password-reset', " ", error);
        throw error;
      });
  }





  datosSonValidos(id: number | null, Nombre: String | null, Precio: number | null, enStock: boolean | null) {
    if (id == null || Nombre == null || Nombre == "" || Precio == null || enStock == null) {
      return false;
    }
    return true;
  }

}