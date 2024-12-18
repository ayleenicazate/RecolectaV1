import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-recollection-modal',
  templateUrl: './recollection-modal.component.html',
  styleUrls: ['./recollection-modal.component.scss'],
})
export class RecollectionModalComponent {
  recollectionForm: FormGroup;
  materials = [
    { name: 'Plástico', selected: false },
    { name: 'Vidrio', selected: false },
    { name: 'Cartón', selected: false },
    { name: 'Metal', selected: false },
  ];

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder
  ) {
    this.recollectionForm = this.fb.group({
      weight: [''],
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  submitForm() {
    const selectedMaterials = this.materials.filter((m) => m.selected);
    const weight = this.recollectionForm.value.weight;
  
    this.modalCtrl.dismiss({
      selectedMaterials,
      weight,
    });
  }
}