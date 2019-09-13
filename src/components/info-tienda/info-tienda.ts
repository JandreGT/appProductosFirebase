import { Component } from '@angular/core';
import { ViewController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { AjustesProvider } from '../../providers/index.services';

@Component({
  selector: 'info-tienda',
  templateUrl: 'info-tienda.html'
})
export class InfoTiendaComponent {

  infoTienda:any = {};
  constructor(public viewCtrl:ViewController, public navParams:NavParams, public _ajustes:AjustesProvider,
              public loadingCtrl:LoadingController, public alertCtrl:AlertController) {
    this.infoTienda = this.navParams.get("existeInfo");
  }

  guardarInfo(data:NgForm) {
    let infoObj = data.value;
    const loader = this.loadingCtrl.create({ content: "" }); loader.present();
    this._ajustes.updateInfoTienda(infoObj).subscribe( () => {
      loader.dismiss();
      this.alertCtrl.create({
        title: 'Aviso',
        subTitle: 'Datos actualizados exitosamente',
        buttons: [
          {
            text: 'Aceptar',
            handler: () => {
              this.viewCtrl.dismiss();
            }
          }
        ]
      }).present()
    }, error => {
      loader.dismiss();
      this.alertCtrl.create({
        title: 'Error al actualizar',
        subTitle: error.mensaje,
        buttons: ['OK']
      }).present()
    });
  }

}
