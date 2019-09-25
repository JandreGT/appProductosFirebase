import { Component } from '@angular/core';
import { NavController, MenuController, AlertController } from 'ionic-angular'; 
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

  irQr() {
    this.navCtrl.push(PagoQrPage);
  }

  logout() {
    this.navCtrl.setRoot(HomePage);
  }

}
