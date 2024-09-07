// login-modal.component.ts

import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent {

  constructor(private modalController: ModalController,private router: Router ) {}

  dismissModal() {
    this.modalController.dismiss();
  }
  ResetPass() {
    this.router.navigate(['/resetpass']);
    
  }
}
