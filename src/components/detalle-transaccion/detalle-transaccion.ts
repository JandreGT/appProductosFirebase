import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'detalle-transaccion',
  templateUrl: 'detalle-transaccion.html'
})
export class DetalleTransaccionComponent {

  existeTransaccion:any;

  constructor(public viewCtrl:ViewController, public navParams:NavParams) {
    this.existeTransaccion = this.navParams.get("existeTran");
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
