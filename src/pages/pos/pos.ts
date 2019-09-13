import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ConexionSquarePage } from '../conexion-square/conexion-square';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'page-pos',
  templateUrl: 'pos.html',
})
export class PosPage {

  datosTran:any = {};

  cliente = {
    descripcion: <any>'',
    nombre: <any>'Consumidor Final',
    nit: <any>'C/F',
    direccion: <any>'Ciudad de Gutemala',
    email: <any>'info@jupi.tech',
    telefono: <any>''
  }
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.datosTran = this.navParams.get("datosTran");
  }

  realizarPago(data:NgForm) {
    let datos = data.value;

    let pagoCliente = {
      moneda: this.datosTran.moneda,
      monto: parseFloat(this.datosTran.montoTran),
      descripcion: datos.descripcion,
      nombre: this.cliente.nombre,
      nit: this.cliente.nit,
      direccion: this.cliente.direccion,
      email: this.cliente.email,
      telefono: datos.telefono
    }
    this.navCtrl.push(ConexionSquarePage, {'datosTran': pagoCliente});
  }
}
