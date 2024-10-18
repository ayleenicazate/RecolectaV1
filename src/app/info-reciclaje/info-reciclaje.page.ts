import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-reciclaje',
  templateUrl: './info-reciclaje.page.html',
  styleUrls: ['./info-reciclaje.page.scss'],
})
export class InfoReciclajePage implements OnInit {

  // Opciones del slider
  slideOpts = {
    initialSlide: 0, // Empezar desde el primer slide
    speed: 400, // Velocidad de la animación
    slidesPerView: 1, // Mostrar una tarjeta a la vez
    spaceBetween: 10 // Espacio entre las tarjetas
  };

  constructor() { }

  ngOnInit() {
  }

}
