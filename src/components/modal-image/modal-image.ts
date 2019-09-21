import { Component } from '@angular/core';
import { AlertController, LoadingController, NavParams, ViewController } from 'ionic-angular';
import { AuthProvider } from '../../providers/index.services';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'modal-image',
  templateUrl: 'modal-image.html'
})
export class ModalImageComponent {

  imageURI:any;
  imagePreview:string = '';
  tipoUpload:string = '';

  SelectImage: CameraOptions = {
    quality: 80,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    correctOrientation : true,
    // targetWidth: 300,
    // targetHeight: 300
  }

  optionsImage: CameraOptions = {
    quality: 80,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true,
    // targetWidth: 300,
    // targetHeight: 300
  }

  constructor(public alertCtrl: AlertController, public loadingCtrl: LoadingController, public _auth: AuthProvider,
              private camera: Camera, public navParams:NavParams, public viewCtrl:ViewController) {
    this.tipoUpload = this.navParams.get("tipo");
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

  cancelUpload() {
    this.imagePreview = '';
    this.imageURI = '';
  }
  
  closeModal() {
    this.viewCtrl.dismiss();
  }

}
