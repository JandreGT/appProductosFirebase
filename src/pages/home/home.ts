import { Component } from '@angular/core';
import { NavController, MenuController, AlertController, LoadingController, Platform,} from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ToastController } from 'ionic-angular';
//Pages
import { ListProductPage } from '../list-product/list-product';
import { RegistroAppPage } from '../registro/registro';
//Providers
import { AuthProvider } from '../../providers/auth/auth';
import { ScanData } from '../../models/scan-data.model'; 
//models
import { UserModel } from '../../models/user-model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

   userModel: UserModel;
   email: string = ""; 
   password: string = "";
   openRegistro:boolean = false;

   constructor(public navCtrl: NavController,         public menu: MenuController, 
              private AuthProvider: AuthProvider,     public alertCtrl: AlertController, 
              public loadingCtrl: LoadingController,  private iab: InAppBrowser,
              private barcodeScanner: BarcodeScanner, private toastCtrl: ToastController,    
              private platform:Platform) {

      this.userModel = new UserModel();
   }

   login(){

      if(this.userModel.email==undefined || this.userModel.password==undefined) {
         this.alertCtrl.create({
            title: 'Error',
            subTitle: 'Ingrese el usuario y contraseña',
            buttons: ['OK']
         }).present()

         return;
      }
   
      const loading = this.loadingCtrl.create({
         content:  'Iniciando sesión. Por favor, espere...',
      });
      loading.present();

      this.AuthProvider.signInWithEmailAndPassword(this.userModel).then(result => {

         loading.dismiss();
         this.navCtrl.setRoot(ListProductPage);

      }).catch(error => {

         loading.dismiss();

         this.alertCtrl.create({
            title: 'Ha ocurrido un error inesperado. Por favor intente nuevamente',
            subTitle: error,
            buttons: ['OK']
         }).present();
      });

   }

   registro(){
      this.navCtrl.push(RegistroAppPage);
   }

  registrate() {
    this.openRegistro = true;
    if (this.openRegistro) {
      this.iab.create('https://app.pagalocard.com/registro', '_system', 'location=yes');
    }
  }

  // irRegistro() {
  //   this.navCtrl.push(RegistroPage);
  // }

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

  presentToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

}
