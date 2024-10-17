import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';  // Importa el servicio de autenticación
import { IonicModule } from '@ionic/angular';  // Importa IonicModule


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
    private authService: AuthService  // Inyecta el servicio de autenticación
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
}
