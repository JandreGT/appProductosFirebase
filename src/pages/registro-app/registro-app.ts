import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { RegistroProvider, AuthProvider } from '../../providers/index.services';
import { HomePage } from '../home/home';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { UserModel } from '../../models/user-model'; 


@Component({
  selector: 'page-registro-app',
  templateUrl: 'registro-app.html',
})
export class RegistroAppPage {
  @ViewChild(Slides) slides: Slides;

  userModel: UserModel;

  user:any = {};
  empresa:any = {};

  imageURI: any;
  imagePreview: string = '';
  dpiImage:boolean = false;
  rtuImage:boolean = false;

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

  constructor(public navCtrl: NavController, public navParams: NavParams, 
              public alertCtrl:AlertController, public _rs:RegistroProvider, 
              public loadingCtrl:LoadingController, public _auth:AuthProvider,
              private camera:Camera,
              public AuthProvider: AuthProvider){

      this.userModel = new UserModel();
  }

   registrarUsuario(data:NgForm) {
      let datos = data.value;

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
      this.navCtrl.push(HomePage);
   }

  getGallery() {
    let loader = this.loadingCtrl.create({ content: "Cargando..." });
    loader.present();
    this.camera.getPicture(this.SelectImage).then((imageData) => {
      loader.dismiss();
      this.imageURI = imageData;
      this.imagePreview = 'data:image/jpeg;base64,' + imageData;
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

  enviarDPI() {
    let loader = this.loadingCtrl.create({ content: "Subiendo..." });
    loader.present();
    this._rs.subirDPI(this.imageURI).subscribe( () => {
      loader.dismiss();
      this.imageURI = '';
      this.imagePreview = '';
      this.dpiImage = true;
      this.alertCtrl.create({
        title: 'Envio Exitoso',
        subTitle: 'Imagen enviada exitosamente',
        buttons: ['OK']
      }).present()
    }, (err) => {
      console.log(JSON.stringify(err));
      loader.dismiss();
      this.dpiImage = false;
      this.alertCtrl.create({
        title: 'Error al Subir imagen',
        subTitle: err.mensaje,
        buttons: ['OK']
      }).present()
    });
  }

  enviarRTU() {
    let loader = this.loadingCtrl.create({ content: "Subiendo..." });
    loader.present();
    this._rs.subirRTU(this.imageURI).subscribe( () => {
      loader.dismiss();
      this.imageURI = '';
      this.imageURI = '';
      this.rtuImage = true;
      this.alertCtrl.create({
        title: 'Envio Exitoso',
        subTitle: 'Imagen enviada exitosamente',
        buttons: ['OK']
      }).present()
    }, (err) => {
      console.log(JSON.stringify(err));
      loader.dismiss();
      this.rtuImage = false;
      this.alertCtrl.create({
        title: 'Error al Subir imagen',
        subTitle: err.mensaje,
        buttons: ['OK']
      }).present()
    });
  }

  cancelUpload() {
    this.imagePreview = '';
    this.imageURI = '';
    this.dpiImage = false;
    this.rtuImage = false;
  }

  loguout() {
    // this._auth.logout();
    this.navCtrl.setRoot(HomePage);
  }
}
