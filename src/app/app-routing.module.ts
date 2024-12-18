import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'registro',
    loadChildren: () => import('./login-modal/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'resetpass',
    loadChildren: () => import('./login-modal/resetpass/resetpass.module').then( m => m.ResetpassPageModule)
  },
  {
    path: 'login-modal',
    loadChildren: () => import('./login-modal/resetpass/resetpass.module').then( m => m.ResetpassPageModule)
  },  {
    path: 'info-reciclaje',
    loadChildren: () => import('./info-reciclaje/info-reciclaje.module').then( m => m.InfoReciclajePageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
