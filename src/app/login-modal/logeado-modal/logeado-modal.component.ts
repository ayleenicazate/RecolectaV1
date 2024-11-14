import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';  // Importa el servicio de autenticación
import { IonicModule } from '@ionic/angular';  // Importa IonicModule
import { FirebaseError } from 'firebase/app';
import { FirestoreService } from '../../services/firestore.service'; // Asegúrate de tener este servicio
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage'; // Importa Firebase Storage




@Component({
  selector: 'app-logeado-modal',
  templateUrl: './logeado-modal.component.html',
  styleUrls: ['./logeado-modal.component.scss'],
})
export class LogeadoModalComponent implements OnInit {
  userProfileImage: string = 'path/to/default-profile-image.jpg';  // Ruta de imagen de perfil predeterminada
  userName: string = ''; // Para mostrar el nombre del usuario
  userEmail: string = ''; // Para mostrar el correo del usuario
  userPhone: string = '';  
  successMessage: string = ''; // Para mostrar mensajes de éxito
  phoneErrorMessage: string = ''; // Para mostrar mensajes de error



  constructor(
    private modalController: ModalController,
    private router: Router,
    private authService: AuthService,  // Inyecta el servicio de autenticación
    private fireStoreService: FirestoreService

  ) {}

  ngOnInit() {
    // Aquí podrías cargar la imagen de perfil del usuario desde el servicio de autenticación
    this.authService.getUserProfile().subscribe(user => {
      if (user) {
        this.userProfileImage = user.photoURL || this.userProfileImage;
        this.userName = user.displayName || 'Usuario';
        this.userEmail = user.email || '';
      }
    });
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  async changeProfilePicture() {
    console.log("Botón 'Cambiar Foto' presionado"); // Verificación de ejecución


    try {
      // Llamada a la cámara o galería
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt, // Permite seleccionar entre cámara y galería
      });

      if (image && image.dataUrl) {
        const storage = getStorage();
        const storageRef = ref(storage, `profile_pictures/${this.authService.getCurrentUserId()}.jpg`);
        await uploadString(storageRef, image.dataUrl, 'data_url'); // Subir la imagen a Firebase Storage
        const downloadURL = await getDownloadURL(storageRef); // Obtener la URL de descarga

        // Actualizar la imagen de perfil del usuario en Firebase Authentication
        await this.authService.updateUserProfileImage(downloadURL);
        this.userProfileImage = downloadURL; // Actualizar la imagen de perfil en la interfaz
        this.successMessage = 'Foto de perfil actualizada con éxito.';
      }
    } catch (error) {
      console.error('Error al cambiar la foto de perfil:', error);
      this.phoneErrorMessage = 'Hubo un problema al actualizar la foto de perfil. Intenta de nuevo.';
    }
  }

  // Método para actualizar el número de teléfono
  async updatePhone() {
    this.phoneErrorMessage = ''; // Limpia el mensaje de error
    this.successMessage = ''; // Limpia el mensaje de éxito

    // Validar que el número de teléfono tenga 9 dígitos y solo contenga números
    const phonePattern = /^\d{9}$/;
    if (!phonePattern.test(this.userPhone)) {
      this.phoneErrorMessage = 'El número de teléfono debe tener exactamente 9 dígitos.';
      return;
    }

    try {
      // Actualizar el teléfono en Firestore
      await this.fireStoreService.updateUsuarioPhone(this.userPhone);
      this.successMessage = 'Número de teléfono actualizado correctamente.';
    } catch (error) {
      console.error('Error al actualizar el número de teléfono:', error);
      this.phoneErrorMessage = 'Hubo un error al actualizar el número. Intenta de nuevo.';
    }
  }

  logout() {
    this.authService.logout().then(() => {
      this.dismissModal();
      this.router.navigate(['/login']);
    }).catch(error => {
      console.error('Error al cerrar sesión:', error);
    });
  }

  async confirmDeleteAccount() {
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.');
    if (confirmDelete) {
      try {
        const password = prompt('Por favor, introduce tu contraseña para confirmar la eliminación de la cuenta:');
        if (password) {
          // Reautentica al usuario
          const credential = await this.authService.reauthenticate(this.userEmail, password);
          
          // Elimina la cuenta de Firebase Auth
          await this.authService.deleteAccount();
  
          // Asegúrate de que el UID esté disponible
          const userUID = credential?.user?.uid;
          if (userUID) {
            // Elimina el usuario de Firestore usando el UID
            await this.fireStoreService.deleteUserFromFirestore(userUID);
            alert('Cuenta eliminada con éxito');
          } else {
            alert('No se pudo obtener el UID del usuario para eliminar de Firestore.');
          }
  
          this.dismissModal();
          this.router.navigate(['/login']);
        } else {
          alert('Eliminación de cuenta cancelada.');
        }
      } catch (error) {
        if (error instanceof FirebaseError && error.code === 'auth/wrong-password') {
          alert('Contraseña incorrecta. Intenta de nuevo.');
        } else {
          alert('Error al eliminar la cuenta. Intenta nuevamente.');
          console.error('Error:', error);
        }
      }
    }
  }
}

