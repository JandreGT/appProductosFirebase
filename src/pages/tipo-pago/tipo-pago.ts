import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular'; 
import { SolicitupagoPage } from '../producto/producto';

@Component({
  selector: 'page-tipo-pago',
  templateUrl: 'tipo-pago.html',
})
export class TipoPagoPage {

  datosTran:any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.datosTran = this.navParams.get("datosTran");
  }

  irSoliPago() {
    this.datosTran.ventaProducto = true;
    this.datosTran.moneda = 'GTQ'
    this.navCtrl.push(SolicitupagoPage, { 'datosTran': this.datosTran });
  }

}
