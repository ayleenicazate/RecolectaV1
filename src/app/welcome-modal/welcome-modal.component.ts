import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-welcome-modal',
  templateUrl: './welcome-modal.component.html',
  styleUrls: ['./welcome-modal.component.scss'],
})
export class WelcomeModalComponent {

  constructor(private modalCtrl: ModalController) { }

  close() {
    this.modalCtrl.dismiss();
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: WelcomeModalComponent,
      cssClass: 'custom-modal-class'  // Asigna una clase personalizada
    });
    return await modal.present();
  }

}



