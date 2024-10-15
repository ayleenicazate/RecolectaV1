import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
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

  // Array hecho a mano de puntos de reciclaje (en futuras versiones esto sera una query a GoogleMapsPlaces)
  recycleLocations = [
    { lat: -33.04290047293547,  lng: -71.37418257573054 },
    { lat: -33.04124735728023,  lng: -71.44872249170893 },
    { lat: -33.03478599734353,  lng: -71.52534948029111 },
    { lat: -33.03053401858401,  lng: -71.5505661690838  },
    { lat: -32.99827777078193,  lng: -71.51340288074677 },
    { lat: -33.03289027085978,  lng: -71.57875485695166 },
    { lat: -33.03430705527392,  lng: -71.53362250045788 },
    { lat: -32.92728765923738,  lng: -71.52026045625792 },
    { lat: -33.06591701871601,  lng: -71.5874353439786  },
    { lat: -33.06484339371251,  lng: -71.58906829695106 },
    { lat: -33.062816092731,    lng: -71.59138880818396 },
    { lat: -33.061171178586356, lng: -71.58650380948862 },
    { lat: -33.057201281312175, lng: -71.58609906753166 },
    { lat: -33.059503234106224, lng: -71.58487598024195 },
  ];

  // Estilo personalizado del mapa (aquí puedes personalizar cada tipo de elemento)
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
      featureType: 'administrative.province',
      elementType: 'all',
      stylers: [
        {
          visibility: 'on',
        },
      ],
    },
    {
      featureType: 'administrative.locality',
      elementType: 'all',
      stylers: [
        {
          visibility: 'on',
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
      featureType: 'poi',
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

  // Este es el contructor de la HomPage
  constructor(
    private modalController: ModalController,
    private gmaps: GmapsService,
    private renderer: Renderer2 
  ) {}

  //Metodo con promesa Vacía
  ngAfterViewInit() {
    this.loadMap();
  }

  // Funcion para mostrar el Mapa //
  async loadMap() {
    let mapOptions = {
      disableDefaultUI: true,
      clickableIcons: false,
      center: this.center,
      zoom: 12,
      styles: this.mapStyle,
    };

    try {
      let googleMaps: any = await this.gmaps.loadGoogleMaps();
      this.googleMaps = googleMaps;
      const mapEl = this.mapElementRef?.nativeElement;
      this.map = new googleMaps.Map(mapEl, mapOptions);
      this.renderer.addClass(mapEl, 'visible');

      // Añadir marcador de localización central (este pin será la geolocalización en futuras versiones)
      this.addMarker(this.center, 'assets/icon/pin.png');

      // Llamar a la función para agregar marcadores de reciclaje (llama al array)
      this.addRecycleMarkers(this.recycleLocations);
    } catch (error) {
      console.log(error);
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Función para agregar el marcador de la ubicación central //
  addMarker(location: { lat: number; lng: number }, iconUrl: string) {
    let googleMaps: any = this.googleMaps;
    const marker = new googleMaps.Marker({
      position: location,
      map: this.map,
      icon: {
        url: iconUrl, // Icono del pin central
        scaledSize: new googleMaps.Size(50, 50), // Tamaño del icono
      },
      animation: googleMaps.Animation.DROP,
    });
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Función para agregar marcadores de puntos de reciclaje //
  addRecycleMarkers(locations: { lat: number; lng: number }[]) {
    let googleMaps: any = this.googleMaps;

    // Recorre el array de ubicaciones y agrega un marcador para cada punto de reciclaje
    locations.forEach((location) => {
      const recycleMarker = new googleMaps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: this.map,
        icon: {
          url: 'assets/icon/recopin2.png', // icono personalizado
          scaledSize: new googleMaps.Size(35, 35), // tamaño de vista del icono
        },
        animation: googleMaps.Animation.DROP,
      });
    });
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Este método abre el modal de login
  async openLoginModal() {
    const modal = await this.modalController.create({
      component: LoginModalComponent,
    });
    return await modal.present();
  }

  // muestra el modal de bienvenida al cargar la página
  async ngOnInit() {
    const modal = await this.modalController.create({
      component: WelcomeModalComponent,
    });
    await modal.present();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////