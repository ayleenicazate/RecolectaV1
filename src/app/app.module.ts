import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';


import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { WelcomeModalComponent } from './welcome-modal/welcome-modal.component';  // Asegúrate de que esto esté


@NgModule({
  declarations: [
    AppComponent,
    LoginModalComponent,
    WelcomeModalComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule {}


