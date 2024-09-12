import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ModalController } from '@ionic/angular';
import { LoginModalComponent } from '../login-modal.component'; 



@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  myForm!: FormGroup; 

  constructor(private fb: FormBuilder,private modalController: ModalController, private navController: NavController
  ) {}

  // Este método abre el modal de login
  async openLoginModal() {
    await this.navController.navigateRoot('/home');
    const modal = await this.modalController.create({
      component: LoginModalComponent
    });
    return await modal.present();
  }

  dismissModal() {
    this.modalController.dismiss();
  }


  ngOnInit() {
    this.myForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.myForm.valid) {
      console.log('Form Data:', this.myForm.value);
    } else {
      console.log('Form Invalid');
    }
  }
}
