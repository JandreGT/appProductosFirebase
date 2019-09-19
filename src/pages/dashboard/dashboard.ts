import { Component } from '@angular/core';
import { NavController, MenuController, AlertController } from 'ionic-angular';
import { SquerePage } from '../squere/squere';
import { MisventasPage } from '../misventas/misventas';
import { DataUserProvider, AuthProvider, TransaccionesProvider } from '../../providers/index.services';
import { HomePage } from '../home/home';
import { PagoQrPage } from '../pago-qr/pago-qr';
import { RegistroAppPage } from '../registro-app/registro-app';
import { TiendaPage } from '../tienda/tienda';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

  totalVentagtq:any = '';
  loading:boolean = false;

  constructor(public navCtrl: NavController, public menuCtrl:MenuController, public _user:DataUserProvider,
              public alertCtrl:AlertController, public _auth:AuthProvider, public _tran:TransaccionesProvider) {}

  mostrarMenu() {
    this.menuCtrl.toggle();
  }

  getTotalTranMes() {
    this.loading = true;
    this._tran.getTotalTranMes().subscribe(() => {
      this.loading = false;
      if (this._tran.totalTranMes && this._tran.totalTranMes[0].gtq != null) {
        this.totalVentagtq = this._tran.totalTranMes[0].gtq;
      } else {
        this.totalVentagtq = '0';
      }
    }, error => {
      console.log(error);
    });
  }

  irVentas() {
    this.navCtrl.push(MisventasPage);
  }

  irSquare(tipoCobro:string) {
    switch (tipoCobro) {
      case "pos":
        this.navCtrl.push(SquerePage, { 'tipo': tipoCobro });
      break;

      case "solicitud":
        this.navCtrl.push(SquerePage, { 'tipo': tipoCobro });
      break;

      case "cobroQr":
        this.navCtrl.push(SquerePage, { 'tipo': tipoCobro });
      break;

      default:
        this.alertCtrl.create({
          title: 'Error',
          subTitle: 'Selecciona una opción de pago valida.',
          buttons: ['Ok']
        }).present()
        break;
    }
  }

  irQr() {
    this.navCtrl.push(PagoQrPage);
  }

  irProductos() {
    this.navCtrl.push(TiendaPage);
  }

  logout() {
    this.navCtrl.setRoot(HomePage);
  }

  validateShowPage() {
    if (this._user.changePass) {
      // console.warn('Vista Cambiar Contraseña');
      this.navCtrl.setRoot(RegistroAppPage, { 'paso': 'password' });
    } else if (this._user.datosUser) {
      // console.warn('Vista Info Usuario');
      this.navCtrl.setRoot(RegistroAppPage, { 'paso': 'usuario' });
    } else if (this._user.datosEmpresa) {
      // console.warn('Vista Info Empresa');
      this.navCtrl.setRoot(RegistroAppPage, { 'paso': 'empresa' });
    } else if (this._user.datosBancos) {
      // console.warn('Vista Info Bancos');
      this.navCtrl.setRoot(RegistroAppPage, { 'paso': 'bancos' });
    } else if (this._user.actiCuenta) {
      // console.warn('Activación Cuenta');
      this.navCtrl.setRoot(RegistroAppPage, { 'paso': 'activacion' });
    } else {
      // console.warn('Vista Dashboard');
    }
  }

  ionViewWillEnter() {
    // this.getDataUser();
    this.getTotalTranMes();
  }

}
