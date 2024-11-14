import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { LogeadoModalComponent } from '../login-modal/logeado-modal/logeado-modal.component';
import { WelcomeModalComponent } from '../welcome-modal/welcome-modal.component';
import { GmapsService } from '../services/gmaps/gmaps.service';
import { AuthService } from '../services/auth.service';
import { Observable, firstValueFrom } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';

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
  isAuthenticated$: Observable<boolean>;
  searchKeyword: string = 'Punto limpio';
  markers: any[] = [];

  // Estilo personalizado del mapa (aquí puedes personalizar cada tipo de elemento ElementType)
  mapStyle = [
    {
      featureType: 'all',
      elementType: 'all',
      stylers: [
        {
          visibility: 'on',
        },
      ],
    },
    {
      featureType: 'administrative',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#444444',
        },
      ],
    },
    {
      featureType: 'administrative.province', // por ejemplo, administrative.province es el nombre las ciudades creo entonces si le pones visibilidad en off no se mostraraán los nombres en el mapa
      elementType: 'all',
      stylers: [
        {
          visibility: 'on',
        },
      ],
    },
    {
      featureType: 'administrative.locality', // esta feature son los nombres de las ciudades, por lo tanto, si la dejas no visible no se verán los nombres de las comunas, regiones, etc.
      elementType: 'all',
      stylers: [
        {
          visibility: 'on', // on: se verán los nombres         off: no se verán los nombres
        },
      ],
    },
    {
      featureType: 'administrative.neighborhood',
      elementType: 'all',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'all',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'labels.text',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'landscape',
      elementType: 'all',
      stylers: [
        {
          color: '#f2f2f2',
        },
      ],
    },
    {
      featureType: 'landscape.man_made',
      elementType: 'all',
      stylers: [
        {
          visibility: 'simplified',
        },
      ],
    },
    {
      featureType: 'poi', // la feature 'poi' hace referencia a los puntos de interes
      // se refiere a todos los puntos de interes, educacion, parques, iglesias, hospitales, etc
      elementType: 'all',
      stylers: [
        {
          visibility: 'off',
        },
        {
          color: '#cee9de',
        },
        {
          saturation: '2',
        },
        {
          weight: '0.80',
        },
      ],
    },
    {
      featureType: 'poi.attraction',
      elementType: 'geometry.fill',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#053709',
        },
        {
          visibility: 'on',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#7dcea0',
        },
        {
          visibility: 'on',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.icon',
      stylers: [
        {
          color: '#229954',
        },
        {
          visibility: 'on',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'all',
      stylers: [
        {
          saturation: -100,
        },
        {
          lightness: 45,
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'all',
      stylers: [
        {
          visibility: 'simplified',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.fill',
      stylers: [
        {
          visibility: 'on',
        },
        {
          color: '#f5d6d6',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.icon',
      stylers: [
        {
          hue: '#ff0000',
        },
        {
          visibility: 'on',
        },
      ],
    },
    {
      featureType: 'road.highway.controlled_access',
      elementType: 'labels.text',
      stylers: [
        {
          visibility: 'simplified',
        },
      ],
    },
    {
      featureType: 'road.highway.controlled_access',
      elementType: 'labels.icon',
      stylers: [
        {
          visibility: 'on',
        },
        {
          hue: '#0064ff',
        },
        {
          gamma: '1.44',
        },
        {
          lightness: '-3',
        },
        {
          weight: '1.69',
        },
      ],
    },
    {
      featureType: 'road.arterial',
      elementType: 'all',
      stylers: [
        {
          visibility: 'on',
        },
      ],
    },
    {
      featureType: 'road.arterial',
      elementType: 'labels.text',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'road.arterial',
      elementType: 'labels.icon',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'road.local',
      elementType: 'all',
      stylers: [
        {
          visibility: 'on',
        },
      ],
    },
    {
      featureType: 'road.local',
      elementType: 'labels.text',
      stylers: [
        {
          visibility: 'simplified',
        },
        {
          weight: '0.31',
        },
        {
          gamma: '1.43',
        },
        {
          lightness: '-5',
        },
        {
          saturation: '-22',
        },
      ],
    },
    {
      featureType: 'transit',
      elementType: 'all',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'transit.line',
      elementType: 'all',
      stylers: [
        {
          visibility: 'on',
        },
        {
          hue: '#ff0000',
        },
      ],
    },
    {
      featureType: 'transit.station.airport',
      elementType: 'all',
      stylers: [
        {
          visibility: 'simplified',
        },
        {
          hue: '#ff0045',
        },
      ],
    },
    {
      featureType: 'transit.station.bus',
      elementType: 'all',
      stylers: [
        {
          visibility: 'on',
        },
        {
          hue: '#00d1ff',
        },
      ],
    },
    {
      featureType: 'transit.station.bus',
      elementType: 'labels.text',
      stylers: [
        {
          visibility: 'simplified',
        },
      ],
    },
    {
      featureType: 'transit.station.rail',
      elementType: 'all',
      stylers: [
        {
          visibility: 'simplified',
        },
        {
          hue: '#00cbff',
        },
      ],
    },
    {
      featureType: 'transit.station.rail',
      elementType: 'labels.text',
      stylers: [
        {
          visibility: 'simplified',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'all',
      stylers: [
        {
          color: '#46bcec',
        },
        {
          visibility: 'on',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [
        {
          weight: '1.61',
        },
        {
          color: '#cde2e5',
        },
        {
          visibility: 'on',
        },
      ],
    },
  ];

  constructor(
    private modalController: ModalController,
    private gmaps: GmapsService,
    private renderer: Renderer2,
    private authService: AuthService
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated();
  }

  async ngOnInit() {
    const modalShown = localStorage.getItem('welcomeModalShown');
    if (!modalShown) {
      await this.showWelcomeModal();
      localStorage.setItem('welcomeModalShown', 'true');
    }

    this.initializeMap();
  }

  async initializeMap() {
    try {
        // Obtener la posición actual y actualizar el centro
        const position = await Geolocation.getCurrentPosition();
        this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        };
        
        // Cargar el mapa después de establecer la posición
        await this.loadMap();

        // Añadir el marcador de la ubicación del usuario después de cargar el mapa
        this.addMarker(this.center.lat, this.center.lng, 'assets/icon/pin4.png');
        
    } catch (error) {
        console.error('Error al obtener la ubicación:', error);
    }
}


  async loadMap() {
    const mapOptions = {
      disableDefaultUI: true,
      clickableIcons: false,
      center: this.center,
      zoom: 12,
      styles: this.mapStyle,
    };

    try {
      const googleMaps = await this.gmaps.loadGoogleMaps();
      this.googleMaps = googleMaps;
      const mapEl = this.mapElementRef?.nativeElement;
      this.map = new googleMaps.Map(mapEl, mapOptions);
      this.renderer.addClass(mapEl, 'visible');
      this.addMarker(this.center.lat, this.center.lng, 'assets/icon/pin4.png', { width: 50, height: 50 });

      this.findRecyclingCenters(this.searchKeyword);

    } catch (error) {
      console.log('Error al cargar el mapa:', error);
    }
  }

  async showWelcomeModal() {
    const modal = await this.modalController.create({
      component: WelcomeModalComponent,
    });
    await modal.present();
  }

  findRecyclingCenters(keyword: string) {
    this.clearMarkers();
    const service = new this.googleMaps.places.PlacesService(this.map);
    const request = {
      location: new this.googleMaps.LatLng(this.center.lat, this.center.lng),
      radius: 50000,
      keyword: keyword,
    };

    service.nearbySearch(request, (results: any, status: any) => {
      if (status === this.googleMaps.places.PlacesServiceStatus.OK) {
        results.forEach((place: any) => {
          this.addMarker(place.geometry.location.lat(), place.geometry.location.lng(), 'assets/icon/recopin4.png', { width: 30, height: 30 });
        });
      } else {
        console.log('Error al buscar lugares:', status);
      }
    });
  }

  addMarker(lat: number, lng: number, iconUrl: string, size: { width: number; height: number } = { width: 30, height: 30 }) {
    const marker = new this.googleMaps.Marker({
        position: { lat, lng },
        map: this.map,
        icon: {
            url: iconUrl,
            scaledSize: new this.googleMaps.Size(size.width, size.height), // Ajusta el tamaño según los parámetros
        },
        animation: this.googleMaps.Animation.DROP,
    });
    this.markers.push(marker);
}

  async toggleAuthModal() {
    const isAuthenticated = await this.getAuthenticationStatus();
    const component = isAuthenticated ? LogeadoModalComponent : LoginModalComponent;
    const modal = await this.modalController.create({ component });
    await modal.present();
  }

  private async getAuthenticationStatus(): Promise<boolean> {
    return firstValueFrom(this.isAuthenticated$);
  }
  

  onSearchInput(event: any) {
    const inputValue = event.target.value;
    if (inputValue && inputValue.trim().length > 0) {
      this.searchKeyword = inputValue;
      this.search();
    }
  }

  search() {
    if (this.searchKeyword.trim()) {
      this.findRecyclingCenters(this.searchKeyword);
    } else {
      console.log('Por favor ingresa una palabra clave.');
    }
  }

  clearMarkers() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
  }

  clearSearch() {
    this.searchKeyword = '';
    this.clearMarkers();
    this.loadMap();
  }
}
