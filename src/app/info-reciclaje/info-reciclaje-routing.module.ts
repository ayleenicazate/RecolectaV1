import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfoReciclajePage } from './info-reciclaje.page';

const routes: Routes = [
  {
    path: '',
    component: InfoReciclajePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfoReciclajePageRoutingModule {}
