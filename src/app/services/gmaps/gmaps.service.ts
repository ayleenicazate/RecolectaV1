import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod'; // Asegúrate de que esté importando el archivo correcto

@Injectable({
  providedIn: 'root'
})
export class GmapsService {

  constructor() { }

  loadGoogleMaps(): Promise<any> {
    const win = window as any;
    const gModule = win.google;

    // Si el módulo de Google Maps ya está cargado, devuelve el módulo
    if (gModule && gModule.maps) {
      return Promise.resolve(gModule.maps);
    }

    // Si el script ya ha sido agregado previamente
    const scriptAlreadyAdded = document.querySelector(`script[src*="maps.googleapis.com"]`) as HTMLScriptElement;
    if (scriptAlreadyAdded) {
      return new Promise((resolve, reject) => {
        // Hacemos casting a HTMLScriptElement para que 'onload' y 'onerror' sean válidos
        scriptAlreadyAdded.onload = () => {
          resolve(gModule.maps);
        };
        scriptAlreadyAdded.onerror = () => {
          reject('Error al cargar Google Maps.');
        };
      });
    }

    // Agrega el script si no ha sido agregado
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=' +
        environment.googleMapsApiKey +
        '&libraries=places';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      // Cuando el script se carga exitosamente
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('La SDK de Google Maps no está disponible.');
        }
      };

      // Manejo de errores al cargar el script
      script.onerror = () => {
        reject('Error al cargar el script de Google Maps.');
      };
    });
  }
}