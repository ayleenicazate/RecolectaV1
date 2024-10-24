import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';  // Importa el servicio de autenticación
import { IonicModule } from '@ionic/angular';  // Importa IonicModule
import { FirebaseError } from 'firebase/app';
import { FirestoreService } from '../../services/firestore.service'; // Asegúrate de tener este servicio



@Component({
  selector: 'app-logeado-modal',
  templateUrl: './logeado-modal.component.html',
  styleUrls: ['./logeado-modal.component.scss'],
})
export class LogeadoModalComponent implements OnInit {
  userProfileImage: string = 'path/to/default-profile-image.jpg';  // Ruta de imagen de perfil predeterminada
  userName: string = ''; // Para mostrar el nombre del usuario
  userEmail: string = ''; // Para mostrar el correo del usuario

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

  changeProfilePicture() {
    // Implementa la lógica para cambiar la foto de perfil
    console.log('Cambiar foto de perfil');
    // Aquí podrías abrir un selector de archivos y actualizar la foto de perfil
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

