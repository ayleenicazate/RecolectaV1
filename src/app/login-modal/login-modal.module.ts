import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginModalComponent } from './login-modal.component';
import { LogeadoModalComponent } from './logeado-modal/logeado-modal.component';

@NgModule({
  declarations: [
    LoginModalComponent,
    LogeadoModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ],
  exports: [
    LoginModalComponent,
    LogeadoModalComponent
  ]
})
export class LoginModalModule { }
