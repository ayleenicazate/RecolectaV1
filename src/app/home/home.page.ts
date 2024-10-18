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
import { WelcomeModalComponent } from '../welcome-modal/welcome-modal.component'; // Importa el modal de bienvenida
import { GmapsService } from '../services/gmaps/gmaps.service';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
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
  isAuthenticated$: Observable<boolean>; // Cambiado para almacenar el estado de autenticación
  searchKeyword: string = ''; // Palabra clave por defecto
  markers: any[] = []; // Array para almacenar los marcadores


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

  // Este es el contructor de la HomPage (es lo que necesita la Page para poder funcionar correctamente)
  constructor(
    private modalController: ModalController, // el controller de los modals
    private gmaps: GmapsService,
    private renderer: Renderer2, // renderizar el mapa de la api de google maps
    private authService: AuthService
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated(); // Asignar observable
  }

  // Este método verifica si el modal ya fue mostrado
  async ngOnInit() {
    // Verificar si el modal de bienvenida ya fue mostrado
    const modalShown = localStorage.getItem('welcomeModalShown');

    // Solicitar la ubicación actual del dispositivo
    const position = await Geolocation.getCurrentPosition();
    this.center = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };

    // Si el modal no ha sido mostrado antes, mostrarlo y guardar el estado en LocalStorage
    if (!modalShown) {
      const modal = await this.modalController.create({
        component: WelcomeModalComponent,
      });
      await modal.present();

      // Guardar el estado en LocalStorage para no mostrarlo de nuevo
      localStorage.setItem('welcomeModalShown', 'true');
    }

    // Cargar el mapa después de obtener la ubicación
    this.loadMap();
  }

  //Metodo con promesa Vacía
  ngAfterViewInit() {
    this.loadMap();
  }

  // Funcion para mostrar el Mapa //
  // Función para cargar el mapa
  async loadMap() {
    const mapOptions = {
      disableDefaultUI: true,
      clickableIcons: false,
      center: this.center,
      zoom: 12,
      styles: this.mapStyle,
    };

    try {
      const googleMaps: any = await this.gmaps.loadGoogleMaps();
      this.googleMaps = googleMaps;
      const mapEl = this.mapElementRef?.nativeElement;
      this.map = new googleMaps.Map(mapEl, mapOptions);
      this.renderer.addClass(mapEl, 'visible');

      // Añadir marcador de la ubicación del usuario
      this.addMarker(this.center.lat, this.center.lng, 'assets/icon/pin4.png');

      // Llamar a la función para buscar puntos de reciclaje cercanos
      this.findRecyclingCenters(this.searchKeyword);
    } catch (error) {
      console.log(error);
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  findRecyclingCenters(keyword: string) {
    this.clearMarkers(); // Limpiar los marcadores antes de agregar los nuevos


    const service = new this.googleMaps.places.PlacesService(this.map);
    const request = {
      location: new this.googleMaps.LatLng(this.center.lat, this.center.lng),
      radius: 10000, //radio de busqueda
      keyword: keyword,
      
    };

    service.nearbySearch(request, (results: any, status: any) => {
      if (status === this.googleMaps.places.PlacesServiceStatus.OK) {
        results.forEach((place: any) => {
          this.addMarker(
            place.geometry.location.lat(),
            place.geometry.location.lng(),
            'assets/icon/recopin4.png'
          );
        });
      } else {
        console.log('Error al buscar lugares:', status);
      }
    });
  }

  // Función para agregar el marcador de la ubicación central //
  addMarker(lat: number, lng: number, iconUrl: string) {
    const marker = new this.googleMaps.Marker({
      position: { lat, lng },
      map: this.map,
      icon: {
        url: iconUrl, // URL del icono personalizado
        scaledSize: new this.googleMaps.Size(30, 30), // Tamaño del icono (ajústalo según lo necesites)
      },
      animation: this.googleMaps.Animation.DROP,
    });
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  search() {
    if (this.searchKeyword   && this.searchKeyword  .trim().length > 0) {
      this.findRecyclingCenters(this.searchKeyword  ); // Realiza la búsqueda con la searchKeyword
    } else {
      console.log('Por favor ingresa una palabra clave.');
    }
  }

  // Función para agregar marcadores de puntos de reciclaje //
  addRecycleMarkers(locations: { lat: number; lng: number }[]) {
    let googleMaps: any = this.googleMaps;

    // Recorre el array de ubicaciones y agrega un marcador para cada punto de reciclaje
    locations.forEach((location) => {
      const recycleMarker = new googleMaps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: this.map,
        icon: {
          url: 'assets/icon/recopin4.png', // icono personalizado
          scaledSize: new googleMaps.Size(30, 30), // tamaño de vista del icono
        },
        animation: googleMaps.Animation.NULL,
      });
    });
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Este método abre el modal de login
  async toggleAuthModal() {
    const isAuthenticated = await this.getAuthenticationStatus(); // Obtener el estado de autenticación

    if (isAuthenticated) {
      const modal = await this.modalController.create({
        component: LogeadoModalComponent,
      });
      await modal.present();
    } else {
      const modal = await this.modalController.create({
        component: LoginModalComponent,
      });
      await modal.present();
    }
  }

  private async getAuthenticationStatus(): Promise<boolean> {
    return new Promise((resolve) => {
      this.isAuthenticated$.subscribe((status) => {
        resolve(status);
      });
    });
  }

  onSearchInput(event: any) {
    const inputValue = event.target.value;
    if (inputValue && inputValue.trim().length > 0) {
      this.searchKeyword   = inputValue;
      this.search();  // Ejecuta la búsqueda cuando se escribe algo
    }
  }
  
  clearMarkers() {
    this.markers.forEach(marker => marker.setMap(null)); // Elimina cada marcador del mapa
    this.markers = []; // Limpiar el array de marcadores
  }

  clearSearch() {
    this.searchKeyword   = '';
    this.clearMarkers(); // Limpiar todos los marcadores
    this.loadMap(); // Recargar el mapa
  }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
