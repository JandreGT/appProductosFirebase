import { Component } from '@angular/core';
import { AlertController, LoadingController, ModalController,MenuController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { FirebaseServiceProvider } from '../../providers/index.services';

@Component({
  selector: 'page-solicitupago',
  templateUrl: 'solicitupago.html',
})
export class SolicitupagoPage {

   crearProducto: any = {}; 
   productos = [];

   constructor(public alertCtrl:AlertController, public loadingCtrl:LoadingController, 
               public modalCtrl:ModalController, public menuCtrl:MenuController,
               public FirebaseServiceProvider:FirebaseServiceProvider){

      FirebaseServiceProvider.getProductos()
         .subscribe(fruits=>{
            this.productos = fruits;
            console.log(this.productos);
         
      });
   }

   mostrarMenu(){
    this.menuCtrl.toggle();
   }

   productoCreate(producto: NgForm) {

      const loading = this.loadingCtrl.create({
         content:  'Almacenando producto. Por favor, espere...',
      });
      loading.present();

      let dataProduct = producto.value;    
      this.FirebaseServiceProvider.saveProducto(dataProduct);

      this.alertCtrl.create({
         title: 'Excelente',
         subTitle: 'Se ha creado un nuevo producto',
         buttons: ['OK']
      }).present()
      
      this.crearProducto = [];
      loading.dismiss();
   }
//   modalReject = this.modalCtrl.create(SoliRejectPage);
}
