import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { NgForm } from '@angular/forms'; 
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../home/home';
import { SolicitupagoPage } from '../solicitupago/solicitupago'; 

@Component({
  selector: 'page-squere',
  templateUrl: 'squere.html',
})
export class SquerePage {

  tipoTran:string;

  pago = {
    monedaselec: '',
    montoInput: <any> '',
  }
  infoEmpresa: any = {}
  bancosEmpresa:boolean = true;
  monedaEmpresa:any[] = [];
  monedaGTQ:boolean = false;
  monedaUSD:boolean = false;

  constructor(public navCtrl: NavController, public actionCtrl: ActionSheetController,
              public alertCtrl: AlertController, 
              public _auth:AuthProvider, public navParams:NavParams) {
 
    this.tipoTran = this.navParams.get("tipo");
  }

  existePunto = false;
  concatStr(valor: any) {
    if (this.pago.montoInput == '' && valor == '.' || this.pago.montoInput == '' && valor == '0') {
      this.pago.montoInput = '';
    } else {
      if (this.pago.montoInput.includes('.')) {
        this.existePunto = true;
        this.pago.montoInput = this.pago.montoInput.concat(valor);
      }else {
        this.pago.montoInput = this.pago.montoInput.concat(valor);
      }
    }
  }

  borrarStr() {
    this.pago.montoInput = this.pago.montoInput.substring(0, this.pago.montoInput.length - 1);
    if (this.pago.montoInput.includes('.')) {
      this.existePunto = true;
    } else {
      this.existePunto = false;
    }
  }

  borrarStrT() {
    this.pago.montoInput = '';
    this.existePunto = false;
  }

  alertMonto() {
    let aletMonto = this.alertCtrl.create({
      title : 'Error Monto Transacción',
      subTitle: 'El monto de la transacción no debe de ser 0',
      buttons : ['Ok']
    });
    aletMonto.present();
  }

  cobrar(formPago: NgForm) {
    if (this.pago.montoInput == '' || this.pago.montoInput == '0') {
      this.alertMonto();
    } else {
      this.pago.montoInput = '';
      this.existePunto = false;

      let monto = parseFloat(formPago.value.montoInput);
      let datoTran = {
        montoTran: monto,
        moneda: formPago.value.monedaselec
      }

      if (this.tipoTran == 'pos') {
         
      } else if (this.tipoTran == 'solicitud') {
        this.navCtrl.push(SolicitupagoPage, { 'datosTran': datoTran });
      } else if (this.tipoTran == 'montoQr') {
         
      } else {
        this.navCtrl.pop();
      }
    }
  }

  alertaBancos() {
    this.alertCtrl.create({
      title: 'Error Bancos',
      subTitle: 'no tienes monedas asignadas a tu cuenta de PAGALO.',
      buttons: [{text: 'Ok'}]
    }).present()
  }

  logout() {
    // this._auth.logout();
    this.navCtrl.setRoot(HomePage);
  }

}
