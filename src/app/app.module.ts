import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { WelcomeModalComponent } from './welcome-modal/welcome-modal.component'; 

// Firebase imports
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';  // Para autenticación
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';  // Para Firestore

// Importa el environment con la configuración de Firebase
import { environment } from '../environments/environment';

// Importa el módulo login-modal
import { LoginModalModule } from './login-modal/login-modal.module';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeModalComponent,  // Mantén WelcomeModalComponent aquí
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    LoginModalModule,  // Añade LoginModalModule aquí

    // Inicialización de Firebase
    AngularFireModule.initializeApp(environment.firebaseConfig),  // Inicializa Firebase con tus credenciales
    AngularFireAuthModule,  // Habilita autenticación de Firebase
    AngularFirestoreModule  // Habilita Firestore para base de datos en tiempo real
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, 
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
