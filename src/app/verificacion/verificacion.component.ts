import { Component } from '@angular/core';

@Component({
  selector: 'app-verificacion',
  imports: [],
  templateUrl: './verificacion.component.html',
  styleUrl: './verificacion.component.css'
})
export class VerificacionComponent {
  ngOnInit() {
    
    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
  }

}
