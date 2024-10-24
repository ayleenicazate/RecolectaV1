import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ModalController } from '@ionic/angular';
import { LoginModalComponent } from '../login-modal.component';
import { FirestoreService } from 'src/app/services/firestore.service';  
import { AuthService } from 'src/app/services/auth.service'; 

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  myForm!: FormGroup; 

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private navController: NavController,
    private firestoreService: FirestoreService,
    private authService: AuthService 
  ) {}

  ngOnInit() {
    this.myForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|cl)$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      username: ['', [Validators.required, Validators.minLength(3)]], 
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]] 
    });
  }

  async onSubmit() {
    if (this.myForm.valid) {
      const { name, email, password, username, phone } = this.myForm.value;
  
      try {
        // Verifica si el correo ya está registrado en Firestore
        const usuarioExistente = await this.firestoreService.checkEmailExists(email);
        if (usuarioExistente) {
          this.myForm.get('email')?.setErrors({ emailTaken: true });
          return; 
        }
  
        // Verifica si el nombre de usuario ya está registrado
        const usernameExistente = await this.firestoreService.checkUsernameExists(username);
        if (usernameExistente) {
          this.myForm.get('username')?.setErrors({ usernameTaken: true });
          return;
        }
  
        // Registra al usuario en Firebase Authentication
        const userCredential = await this.authService.register(email, password);
  
        // Verifica que el usuario fue creado
        if (userCredential && userCredential.user) {
          const uid = userCredential.user.uid; // Obtenemos el UID del usuario registrado en Firebase Auth
  
          // Crea el objeto del nuevo usuario con el UID como parte de los datos
          const newUser = {
            nombre: name,
            correo: email,
            username: username,
            telefono: phone,
            id: uid // Usamos el UID como el ID del documento en Firestore
          };
  
          // Guarda el usuario en Firestore usando el UID como ID
          await this.firestoreService.createUsuario(uid, newUser);
          console.log('Usuario añadido con éxito en Firestore:', newUser);
  
          // Navega a la página principal
          this.navController.navigateRoot('/home');
        } else {
          console.error('No se pudo registrar al usuario en Firebase Authentication.');
        }
      } catch (error) {
        console.error('Error al registrar el usuario:', error);
      }
    } else {
      console.log('Formulario inválido');
    }
  }
}