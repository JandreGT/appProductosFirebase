import { Component } from '@angular/core';
import { AlertController, LoadingController, ModalController,MenuController } from 'ionic-angular';
import { storage} from 'firebase';
import { NgForm } from '@angular/forms';
import { NavController} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FirebaseServiceProvider } from '../../providers/index.services';  

@Component({
  selector: 'page-producto',
  templateUrl: 'producto.html',
})
export class productoPage {
   imageURI: any;
   imagePreview: string = '';
   imagedowload: any;
 
   SelectImage: CameraOptions = {
     quality: 50,
     destinationType: 0,
     encodingType: this.camera.EncodingType.JPEG,
     sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
   }
 
   optionsImage: CameraOptions = {
     quality: 10,
     destinationType: this.camera.DestinationType.DATA_URL,
     encodingType: this.camera.EncodingType.JPEG,
     mediaType: this.camera.MediaType.PICTURE,
   //   correctOrientation:true
   }

   crearProducto: any = {};
   productos = []; 

   constructor(public alertCtrl:AlertController, public loadingCtrl:LoadingController, 
               public modalCtrl:ModalController, public menuCtrl:MenuController,
               private camera:Camera,            public FirebaseServiceProvider:FirebaseServiceProvider,
               public navCtrl: NavController){
                  
      //listado de  productos       
      FirebaseServiceProvider.getProductos()
         .subscribe(prod=>{
            this.productos = prod;
      });
 
   }

   mostrarMenu(){
    this.menuCtrl.toggle();
   }

   // getGallery(){

   //    let loader = this.loadingCtrl.create({ content: "Cargando..." });
   //    loader.present();
  
   //    this.camera.getPicture(this.SelectImage).then((imageData) => {
   //      loader.dismiss();
   //      this.imageURI = imageData;
   //      this.imagePreview = 'data:image/jpeg;base64,' + imageData;
  
   //    },(err) => { 

   //      loader.dismiss();
   //      this.alertCtrl.create({
   //        title: 'Error al Abrir la Galeria',
   //        subTitle: err,
   //        buttons: ['OK']
   //      }).present();

   //    });
   // }

   getImage(){

      this.camera.getPicture(this.optionsImage).then((imageData) => {
         
         this.imageURI = imageData;
         this.imagePreview = 'data:image/jpeg;base64,' + imageData;
   
         //guarda la imagen en firebase.
         var storageRef = storage().ref();

         var mountainsRef = storageRef.child(this.crearProducto.nombre); 
                           mountainsRef.putString(this.imagePreview,'data_url');
      
         setTimeout( () => {
            this.imagedowload = mountainsRef.getDownloadURL().then(function(url) {
               return url;
            });
         },1000);
   
      },(err) => { 
         
        this.alertCtrl.create({
          title: 'Error al Abrir la camara',
          subTitle: err,
          buttons: ['OK']
        }).present()

      });
    }

   productoCreate(producto: NgForm){

      const loading = this.loadingCtrl.create({
         content:  'Almacenando producto. Por favor, espere...',
      });
      loading.present();

      this.crearProducto.imagen=this.imagedowload.i;

      this.FirebaseServiceProvider.saveProducto(this.crearProducto);

      loading.dismiss();

      this.alertCtrl.create({
         title: 'Excelente',
         subTitle: 'Producto creado correctamente ',
         buttons: [
            {
               text: 'Ok', 
               handler: () => {
                  this.imagePreview = "";
               }
            }
          ]
      }).present()
      
   }
//   modalReject = this.modalCtrl.create(SoliRejectPage);

}

