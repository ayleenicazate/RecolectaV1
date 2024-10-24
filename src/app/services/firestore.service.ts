import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) {}

  createUsuario(uid: string, usuario: any): Promise<void> {
    return this.firestore.collection('usuarios').doc(uid).set(usuario)
      .then(() => {
        console.log('Usuario registrado en Firestore correctamente');
      })
      .catch((error) => {
        console.error('Error al guardar el usuario en Firestore:', error); 
        throw error;
      });
  }

  // Obtiene todos los usuarios de la colección 'usuarios'
  getUsuarios(): Observable<any[]> {
    return this.firestore.collection('usuarios').valueChanges({ idField: 'id' });
  }

  // Actualiza un usuario existente
  updateUsuario(id: string, usuario: any): Promise<void> {
    return this.firestore.collection('usuarios').doc(id).update(usuario);
  }

  // Elimina un usuario de Firestore
  deleteUsuario(id: string): Promise<void> {
    return this.firestore.collection('usuarios').doc(id).delete();
  }

  checkEmailExists(email: string): Promise<boolean> {
    return this.firestore.collection('usuarios', ref => ref.where('correo', '==', email))
      .get()
      .toPromise()
      .then(snapshot => {
        if (snapshot) {
          return !snapshot.empty;  
        }
        return false; 
      });
  }

//PARA VALIDAR SI EL USUARIO EXISTE YA EN LA BASE DE DATOS.
checkUsernameExists(username: string): Promise<boolean> {
  return this.firestore.collection('usuarios', ref => ref.where('username', '==', username))
    .get()
    .toPromise()
    .then(snapshot => {
      return snapshot ? !snapshot.empty : false; // Retorna true si se encontró un username
    });
  }

    // Elimina al usuario de Firestore basado en el UID
    async deleteUserFromFirestore(uid: string): Promise<void> {
      return this.firestore.collection('usuarios').doc(uid).delete();
    }
  }
