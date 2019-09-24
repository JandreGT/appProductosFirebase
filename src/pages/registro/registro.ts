import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController,MenuController} from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { AuthProvider } from '../../providers/index.services';
import { HomePage } from '../home/home';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { UserModel } from '../../models/user-model'; 


@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroAppPage {
  @ViewChild(Slides) slides: Slides;

  userModel: UserModel; 

  imageURI: any;
  imagePreview: string = '';

  SelectImage: CameraOptions = {
    quality: 50,
    destinationType: 0,
    encodingType: this.camera.EncodingType.JPEG,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
  }

  optionsImage: CameraOptions = {
    quality: 50,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  constructor(public navCtrl: NavController,    public navParams: NavParams, 
              public alertCtrl:AlertController, public loadingCtrl:LoadingController, 
              public _auth:AuthProvider,         private camera:Camera,
              public AuthProvider: AuthProvider, public menu: MenuController){

      this.userModel = new UserModel();
  }

   registrarUsuario(data:NgForm) {
      // let datos = data.value;

      if(this.userModel.email==undefined || this.userModel.password==undefined) {
         this.alertCtrl.create({
            title: 'Ingrese los campos necesarios',
            subTitle: 'Error',
            buttons: ['OK']
         }).present()

         return;
      }
      
      let loading = this.loadingCtrl.create({
         content: 'Creando cuenta. Por favor, espere...'
      });
      loading.present();

      this.AuthProvider.createUserWithEmailAndPassword(this.userModel).then(result => {
         loading.dismiss();
         
         this.slides.lockSwipeToPrev(true);
         this.slides.lockSwipeToNext(false);
         this.slides.slideNext(500);
         this.slides.lockSwipeToNext(true);

      }).catch(error => {
         loading.dismiss();

         this.alertCtrl.create({
            title: 'Ha ocurrido un error inesperado. Por favor intente nuevamente',
            subTitle: error,
            buttons: ['OK']
         }).present()
      });

   }

   ingresar(){
      // this.getGallery();return;
      this.navCtrl.push(HomePage);
   }

  getGallery() {
    let loader = this.loadingCtrl.create({ content: "Cargando..." });
    loader.present();

    this.camera.getPicture(this.SelectImage).then((imageData) => {
      loader.dismiss();
      this.imageURI = imageData;
      this.imagePreview = 'data:image/jpeg;base64,' + imageData;

      console.log(this.imagePreview);
    }, (err) => {
      console.log(err);
      loader.dismiss();
      this.alertCtrl.create({
        title: 'Error al Abrir la Galeria',
        subTitle: err,
        buttons: ['OK']
      }).present()
    });
  }

  
   getImage() {
      let loader = this.loadingCtrl.create({ content: "Cargando..." });
      loader.present();
      this.camera.getPicture(this.optionsImage).then((imageData) => {
      loader.dismiss();
      this.imageURI = imageData;
      this.imagePreview = 'data:image/jpeg;base64,' + imageData;
      }, (err) => {
      console.log(err);
      loader.dismiss();
      this.alertCtrl.create({
         title: 'Error al Abrir la camara',
         subTitle: err,
         buttons: ['OK']
      }).present()
      });
   }
  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

   cancelUpload() {
      this.imagePreview = '';
      this.imageURI = ''; 
   }

   loguout() { 
      this.navCtrl.setRoot(HomePage);
   }
}
