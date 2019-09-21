import { Component } from '@angular/core';
import { Platform, NavController,AlertController} from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ToastController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HomePage } from '../home/home';
import { ScanData } from '../../models/scan-data.model'; 
import { FirebaseServiceProvider } from '../../providers/index.services';

@Component({
  selector: 'page-pago-qr',
  templateUrl: 'pago-qr.html',
})
export class PagoQrPage {

  producto:any;

  constructor(private barcodeScanner: BarcodeScanner, private toastCtrl: ToastController,
              private platform:Platform,              private iab:InAppBrowser, 
              public navCtrl:NavController,           public FirebaseServiceProvider:FirebaseServiceProvider,
              public alertCtrl:AlertController,) {
    this.scanQr();
  }
  
  scanQr() {
    console.log('escanear...');

    if (!this.platform.is('cordova')) {
      return;
    }

    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Result: ', barcodeData.text);
      console.log('Format: ', barcodeData.format);
      console.log('Canceled: ', barcodeData.cancelled);

      if (barcodeData.cancelled == false && barcodeData.text != null) {
        let data = new ScanData(barcodeData.text);

        switch (data.tipo) {
          case "http":
            this.iab.create(barcodeData.text, '_system', 'location=yes');
          break;

          default:

            this.FirebaseServiceProvider.getProduct(barcodeData.text)
              .subscribe(producto=>{
                 this.producto = producto;

                 this.alertCtrl.create({
                  title: 'Producto',
                  subTitle: this.producto.nombre+" tiene un precio de " +this.producto.precio,
                  buttons: ['OK']
               }).present()

            }); 
            
            // this.presentToast(this.producto);
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

  presentToast(message:string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

  logout() { 
    this.navCtrl.setRoot(HomePage);
  }

}
