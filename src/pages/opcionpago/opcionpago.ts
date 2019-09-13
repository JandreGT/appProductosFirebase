import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PosmovilPage } from '../posmovil/posmovil';

@Component({
  selector: 'page-opcionpago',
  templateUrl: 'opcionpago.html',
})
export class OpcionpagoPage {

  datosTran:any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.datosTran = this.navParams.get("datosTran");
  }

  pagoTarjeta() {
    this.datosTran.scanCard = false;
    this.navCtrl.push(PosmovilPage, { 'datosTran': this.datosTran });
  }

  scanTarjeta() {
    this.datosTran.scanCard = true;
    this.navCtrl.push(PosmovilPage, { 'datosTran': this.datosTran });
  }
}
