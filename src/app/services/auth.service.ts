import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserCredential } from 'firebase/auth';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<firebase.User | null>;
  authState$: any;

  constructor(private afAuth: AngularFireAuth) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => of(user))
    );
  }

  // Método para reautenticar al usuario
  async reauthenticate(email: string, password: string): Promise<firebase.auth.UserCredential> {
    const user = await this.afAuth.currentUser;
    if (user) {
      const credential = firebase.auth.EmailAuthProvider.credential(email, password);
      return await user.reauthenticateWithCredential(credential);
    } else {
      throw new Error('Usuario no autenticado.');
    }
  }

  async register(email: string, password: string): Promise<firebase.auth.UserCredential> {
    try {
      // Verifica si el correo ya está en uso
      const signInMethods = await this.afAuth.fetchSignInMethodsForEmail(email);
      if (signInMethods.length > 0) {
        throw new Error('El correo ya está en uso.'); // Lanza un error si el correo ya está registrado
      }
  
      // Aquí retornamos el UserCredential completo
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      return userCredential; // Retornamos el UserCredential
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
  isAuthenticated(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      switchMap(user => of(!!user)) // Devuelve true si hay un usuario, false si no
    );
  }

  async getCurrentUserUid(): Promise<string | null> {
    const user = await this.afAuth.currentUser;
    return user ? user.uid : null;
  }

  async deleteAccount(): Promise<void> {
    const user = await this.afAuth.currentUser;
    if (user) {
      await user.delete(); // Elimina la cuenta de Firebase Authentication
    } else {
      throw new Error('No hay un usuario autenticado.');
    }
  }

  

}
