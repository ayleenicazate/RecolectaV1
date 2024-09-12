import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoginModalComponent } from '../login-modal/login-modal.component'; 
import { WelcomeModalComponent } from '../welcome-modal/welcome-modal.component'; // Importa el modal de bienvenida

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private modalController: ModalController) {}

  // Este método abre el modal de login
  async openLoginModal() {
    const modal = await this.modalController.create({
      component: LoginModalComponent
    });
    return await modal.present();
  }

  // Mostrar modal de bienvenida al cargar la página
  async ngOnInit() {
    const modal = await this.modalController.create({
      component: WelcomeModalComponent
    });
    await modal.present();
  }
}

