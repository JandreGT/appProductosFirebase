import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PosmovilPage } from '../posmovil/posmovil';
import { SolicitupagoPage } from '../solicitupago/solicitupago';

@Component({
  selector: 'page-tipo-pago',
  templateUrl: 'tipo-pago.html',
})
export class TipoPagoPage {

  datosTran:any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.datosTran = this.navParams.get("datosTran");
  }

  irSinPos() {
    this.datosTran.ventaProducto = true;
    this.datosTran.moneda = 'GTQ'
    this.datosTran.scanCard = false
    this.navCtrl.push(PosmovilPage, {'datosTran': this.datosTran});
  }

  scanTarjeta() {
    this.datosTran.ventaProducto = true;
    this.datosTran.moneda = 'GTQ'
    this.datosTran.scanCard = true;
    this.navCtrl.push(PosmovilPage, { 'datosTran': this.datosTran });
  }

  irSoliPago() {
    this.datosTran.ventaProducto = true;
    this.datosTran.moneda = 'GTQ'
    this.navCtrl.push(SolicitupagoPage, { 'datosTran': this.datosTran });
  }

}
