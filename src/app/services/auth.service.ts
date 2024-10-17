import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<firebase.User | null>;

  constructor(private afAuth: AngularFireAuth) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => of(user))
    );
  }

  async register(email: string, password: string) {
    try {
      // Verifica si el correo ya está en uso
      const signInMethods = await this.afAuth.fetchSignInMethodsForEmail(email);
      if (signInMethods.length > 0) {
        throw new Error('El correo ya está en uso.'); // Lanza un error si el correo ya está registrado
      }

      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      return userCredential.user; // Contiene el UID y otros datos del usuario
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      throw error; // Lanza el error para que pueda ser manejado en la llamada
    }
  }

  async login(email: string, password: string) {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      return userCredential.user; // Devuelve el objeto del usuario
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error; // Lanza el error para manejarlo en la llamada
    }
  }

  async logout() {
    await this.afAuth.signOut();
    // Aquí deberías inyectar el Router y navegar a la página de login
    // this.router.navigate(['/login']); 
  }

  getUserProfile(): Observable<firebase.User | null> {
    return this.user$;
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated() {
    return this.afAuth.authState;
  }
}
