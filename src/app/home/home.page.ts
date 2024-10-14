import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
  viewChild,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { WelcomeModalComponent } from '../welcome-modal/welcome-modal.component'; // Importa el modal de bienvenida
import { GmapsService } from '../services/gmaps/gmaps.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('map', { static: true }) mapElementRef: ElementRef | undefined;
  googleMaps: any;
  center = { lat: -33.033779581976276, lng: -71.53313246449065 };
  map: any;

  constructor(
    private modalController: ModalController,
    private gmaps: GmapsService,
    private renderer: Renderer2,
  ) {}

  // ngOnInit(): void {

  // }
  ngAfterViewInit() {
    this.loadMap();
  }

  // Mostrar el Mapa
  async loadMap() {
    try {
      let googleMaps: any = await this.gmaps.loadGoogleMaps();
      this.googleMaps = googleMaps;
      const mapEl = this.mapElementRef?.nativeElement;
      const location = new googleMaps.LatLng(this.center.lat, this.center.lng);
      this.map = new googleMaps.Map(mapEl, {
        center: location,
        zoom: 12,
      });
      this.renderer.addClass(mapEl, 'visible');
    } catch (error) {
      console.log(error);
    }
  }

  // Este método abre el modal de login
  async openLoginModal() {
    const modal = await this.modalController.create({
      component: LoginModalComponent,
    });
    return await modal.present();
  }

  // Mostrar modal de bienvenida al cargar la página
  async ngOnInit() {
    const modal = await this.modalController.create({
      component: WelcomeModalComponent,
    });
    await modal.present();
  }
}
