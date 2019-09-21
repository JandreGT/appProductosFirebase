import { Component } from '@angular/core';
import { NavController, MenuController, AlertController } from 'ionic-angular';
import { SquerePage } from '../squere/squere';
import { AuthProvider} from '../../providers/index.services';
import { HomePage } from '../home/home';
import { PagoQrPage } from '../pago-qr/pago-qr'; 

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

  totalVentagtq:any = '';
  loading:boolean = false;

  constructor(public navCtrl: NavController, public menuCtrl:MenuController,
              public alertCtrl:AlertController, public _auth:AuthProvider) {}

  mostrarMenu() {
    this.menuCtrl.toggle();
  }

  irVentas() { 
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

  logout() {
    this.navCtrl.setRoot(HomePage);
  }

}
