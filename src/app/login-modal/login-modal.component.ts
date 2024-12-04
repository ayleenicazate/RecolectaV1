import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';  // Importa el servicio de autenticación

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent implements OnInit {
  myForm!: FormGroup;
  isLoading: boolean = false;  // Para manejar el estado de carga
  errorMessage: string = '';  // Para mostrar mensajes de error

  constructor(
    private modalController: ModalController,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService  // Inyecta el servicio de autenticación
  ) {}

  dismissModal() {
    this.modalController.dismiss();
  }

  // Navega a la página de registro
  async navigateToRegister() {
    this.dismissModal(); // Cierra el modal
    this.router.navigate(['/registro']);
  }

  // Método para restablecer la contraseña
  async resetPassword() {
    const email = prompt('Por favor, ingresa tu correo electrónico:');
    if (email) {
      try {
        await this.authService.resetPassword(email);
        alert('Correo de restablecimiento enviado exitosamente.');
      } catch (error) {
        alert('Error al enviar el correo de restablecimiento.');
      }
    }
  }

  ngOnInit() {
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  // Valida un correo válido
      password: ['', [Validators.required, Validators.minLength(6)]]  // Valida una contraseña de al menos 6 caracteres
    });
  }

  onSubmit() {
    if (this.myForm.valid) {
      this.isLoading = true;
      const { email, password } = this.myForm.value;

      this.authService.login(email, password).then((user) => { // Agrega user para manejar el ID
        this.isLoading = false;
        if (user) {
          console.log('Login exitoso, ID:', user.uid); // Asegúrate de que user tenga la propiedad id
          this.dismissModal();  // Cierra el modal al iniciar sesión exitosamente
          this.router.navigate(['/home']);  // Redirige a la página principal
        } else {
          console.error('Error de login: Usuario no encontrado');
          this.errorMessage = 'Correo o clave incorrectos. Inténtalo de nuevo.';
        }
      }).catch((error: any) => {  // Agrega el tipo 'any' aquí
        this.isLoading = false;
        console.error('Error al iniciar sesión:', error);
        this.errorMessage = 'Correo o clave incorrectos. Inténtalo de nuevo.'; // Manejo de error para mostrar al usuario
      });
    } else {
      console.log('Formulario inválido');
    }
  }
}
