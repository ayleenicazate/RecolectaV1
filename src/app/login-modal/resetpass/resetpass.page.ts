import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';



@Component({
  selector: 'app-resetpass',
  templateUrl: './resetpass.page.html',
  styleUrls: ['./resetpass.page.scss'],
})
export class ResetpassPage implements OnInit {

  constructor(private router: Router, private modalController: ModalController) {}

  ngOnInit() {
    
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  ResetPass() {
    this.router.navigate(['/resetpass']);
    
  }
}
