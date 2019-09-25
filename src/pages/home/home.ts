import { Component } from '@angular/core';
import { NavController, MenuController, AlertController, LoadingController,} from 'ionic-angular';
import { ToastController } from 'ionic-angular';
//Pages
import { ListProductPage } from '../list-product/list-product';
import { RegistroAppPage } from '../registro/registro';
//Providers
import { AuthProvider } from '../../providers/auth/auth'; 
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
              public loadingCtrl: LoadingController,  private toastCtrl: ToastController) {

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

  // irRegistro() {
  //   this.navCtrl.push(RegistroPage);
  // }

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
