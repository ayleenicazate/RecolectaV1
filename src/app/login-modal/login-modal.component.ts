// login-modal.component.ts
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent implements OnInit{
  myForm!: FormGroup; 


  constructor(private modalController: ModalController,private router: Router, private fb: FormBuilder ) {}

  dismissModal() {
    this.modalController.dismiss();
  }

  async navigateToRegister() {
    this.dismissModal(); // Cierra el modal
    this.router.navigate(['/registro']);
  }

  async resetPass() {
    this.dismissModal(); // Cierra el modal
    this.router.navigate(['/resetpass']);
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
