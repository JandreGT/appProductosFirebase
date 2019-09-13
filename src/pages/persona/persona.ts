import { Component } from '@angular/core';
import { NavController, Platform, ToastController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ScanData } from '../../models/scan-data.model';
import { TipoUsuarioPage } from '../tipo-usuario/tipo-usuario';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'page-persona',
  templateUrl: 'persona.html',
})
export class PersonaPage {

  constructor(public navCtrl: NavController, private barcodeScanner:BarcodeScanner, private iab:InAppBrowser,
              private platform:Platform, private toastCtrl:ToastController, public _auth:AuthProvider) {
  }

  scanQr() {
    console.log('escanear...');

    if (!this.platform.is('cordova')) {
      return;
    }

    this.barcodeScanner.scan().then(barcodeData => {
      console.info('Result: ', barcodeData.text);
      console.info('Format: ', barcodeData.format);
      console.info('Canceled: ', barcodeData.cancelled);

      if (barcodeData.cancelled == false && barcodeData.text != null) {
        let data = new ScanData(barcodeData.text);

        switch (data.tipo) {
          case "http":
            this.iab.create(barcodeData.text, '_system', 'location=yes');
          break;

          default:
            this.presentToast("El QR no es compatible con PAGALO.")
          break;
        }
      } else {
        this.presentToast("Escaneo Cancelado")
      }

    }).catch(err => {
      console.error('Error Scan: ', err);
      this.presentToast(`Error: ${err}`);
    });
  }

  restablecer() {
    this.navCtrl.setRoot(TipoUsuarioPage);
    this._auth.resetApp();
  }

  presentToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

}
