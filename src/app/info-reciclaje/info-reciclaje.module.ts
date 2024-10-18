import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { InfoReciclajePageRoutingModule } from './info-reciclaje-routing.module';
import { InfoReciclajePage } from './info-reciclaje.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfoReciclajePageRoutingModule
  ],
  declarations: [InfoReciclajePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Asegúrate de agregar esta línea
})
export class InfoReciclajePageModule {}
