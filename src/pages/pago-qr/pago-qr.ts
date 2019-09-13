import { Component } from '@angular/core';
import { Platform, AlertController, NavController, LoadingController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ToastController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { DataUserProvider } from '../../providers/data-user/data-user';
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../home/home';
import { ScanData } from '../../models/scan-data.model';
import { SolicitudPagoProvider } from '../../providers/index.services';
import { SquerePage } from '../squere/squere';


@Component({
  selector: 'page-pago-qr',
  templateUrl: 'pago-qr.html',
})
export class PagoQrPage {

  infoEmpresa:any = {};
  nombreEmpesa:string = "";
  telefonoEmpresa:string = "";
  logoEmpresa:any;

  constructor(private barcodeScanner: BarcodeScanner,private toastCtrl: ToastController,
              private platform:Platform, private iab:InAppBrowser, public _user:DataUserProvider, public alertCtrl:AlertController,
              public _auth:AuthProvider,public navCtrl:NavController, public loadingCtrl:LoadingController,
              public _solicitudCtrl:SolicitudPagoProvider) {
    this.getDataUser();
  }

  getDataUser() {
    this.getQrEmpresa();
    this._user.getUser().subscribe(resp => {
      this.infoEmpresa = this._user.infoUser;
      this.nombreEmpesa =  this.infoEmpresa.empresa.nombre;

      if (this.infoEmpresa.empresa.personalizar != null && this.infoEmpresa.empresa.personalizar.telefono != ' ') {
        this.telefonoEmpresa = this.infoEmpresa.empresa.personalizar.telefono;
      } else {
        this.telefonoEmpresa = '22960894';
      }

      if (this.infoEmpresa.empresa.personalizar != null && this.infoEmpresa.empresa.personalizar.logo != '') {
        this.logoEmpresa = this.infoEmpresa.empresa.personalizar.logo;
      } else {
        this.logoEmpresa = 'https://pagalocard.s3.amazonaws.com/empresa/personalizar/u55/e26/26_300x300_sms-pagalo.jpg';
      }
    }, error => {
      this.alertCtrl.create({
        title: 'Tu sesión ha expirado',
        subTitle: error.mensaje,
        buttons: [{ text: 'Ok' }]
      }).present()
      this.logout();
    });
  }

  getQrEmpresa() {
    let loading = this.loadingCtrl.create({
      content: ""
    });
    loading.present();

    this._solicitudCtrl.getQr().subscribe(() => {
      loading.dismiss();
    }, error => {
      console.log('error: ', error);
      loading.dismiss();
      this.alertCtrl.create({
        title: 'Error',
        subTitle: error.mensaje,
        buttons: ['OK']
      }).present()
    });
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

  montoQr() {
    this.navCtrl.push(SquerePage, { 'tipo': 'montoQr' });
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
    this._auth.logout();
    this.navCtrl.setRoot(HomePage);
  }

}
