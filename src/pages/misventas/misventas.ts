import { Component } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController } from 'ionic-angular';
import { TransaccionesProvider, AuthProvider } from '../../providers/index.services';
import moment from 'moment';
import { DetalleTransaccionComponent } from '../../components/index.components';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-misventas',
  templateUrl: 'misventas.html',
})
export class MisventasPage {

  datosTran:any[] = [];
  totalVentagtq:any;
  filtroDia:boolean = false;
  filtroMes:boolean = false;
  filtroFecha:boolean = false;
  loading:boolean = false;

  fil:boolean = false;

  fechaInicio = moment().format();
  fechaFin = moment().format();

  loader = this.loadingCtrl.create({
    content: ""
  });

  modalOptions: any = {
    showBackdrop: true,
    enableBackdropDismiss: true,
    cssClass: 'modal-pagalo'
  }

  constructor(public _tran:TransaccionesProvider, public alertCtrl:AlertController,
              public loadingCtrl:LoadingController, public modalCtrl:ModalController,
              public navCtrl:NavController) {
    this.filtrarMes();
  }

  getTransaccions() {
    this.loader.present();

    this._tran.getTransaccions().subscribe( () => {
      this.loader.dismiss();
      this.datosTran = this._tran.listaTran;

      this.datosTran.forEach(element => {
        element.fecha_transaccion = moment(element.fecha_transaccion);
      });
    },error => {
      this.loader.dismiss();
      this.alertCtrl.create({
        title: 'Error',
        subTitle: error.mensaje,
        buttons: ['OK']
      }).present()
    });
  }

  filtrarDia() {
    let loadingDia = this.loadingCtrl.create({
      content: ""
    });
    loadingDia.present();
    this.getTotalTranDia();

    this._tran.getTranDia().subscribe( () => {
      loadingDia.dismiss();
      this.filtroDia = true;
      this.filtroMes = false;
      this.filtroFecha = false;
      this.fil = false;
      this.datosTran = this._tran.listaTran;

      this.datosTran.forEach(element => {
        element.fecha_transaccion = moment(element.fecha_transaccion);
      });
    }, error => {
      console.log('error: ',error);
      loadingDia.dismiss();
      this.alertCtrl.create({
        title: 'Aviso',
        subTitle: error.mensaje,
        buttons: ['OK']
      }).present()
    });
  }

  filtrarMes() {
    let loadingMes = this.loadingCtrl.create({content: ""});
    loadingMes.present();
    this.getTotalTranMes();

    this._tran.getTranMes().subscribe(() => {
      loadingMes.dismiss();
      this.filtroMes = true;
      this.filtroDia = false;
      this.filtroFecha = false;
      this.fil = false;
      this.datosTran = this._tran.listaTran;

      this.datosTran.forEach(element => {
        element.fecha_transaccion = moment(element.fecha_transaccion);
      });
    }, error => {
      console.log('error: ', error);
      loadingMes.dismiss();
      this.logout();
      this.alertCtrl.create({
        title: 'Aviso',
        subTitle: error.mensaje,
        buttons: ['OK']
      }).present()
    });
  }

  filtrarFecha() {
    let loadingFecha = this.loadingCtrl.create({
      content: ""
    });
    loadingFecha.present();

    //Converción de Fechas
    let f1 = moment(this.fechaInicio);
    let f2 = moment(this.fechaFin);
    let fechaInico = f1.startOf('day').format('YYYY-MM-DD HH:mm:ss');
    let fechaFin = f2.endOf('day').format('YYYY-MM-DD HH:mm:ss');

    this.getTotalTranFecha(fechaInico, fechaFin);

    this._tran.getTranFecha(fechaInico, fechaFin).subscribe(() => {
      loadingFecha.dismiss();
      this.datosTran = this._tran.listaTran;

      this.datosTran.forEach(element => {
        element.fecha_transaccion = moment(element.fecha_transaccion);
      });
    }, error => {
      console.log('error: ', error);
      loadingFecha.dismiss();
      this.alertCtrl.create({
        title: 'Aviso',
        subTitle: error.mensaje,
        buttons: ['OK']
      }).present()
    });
  }

  showDate() {
    this.fil = true;
    this.filtroFecha = true;
    this.filtroMes = false;
    this.filtroDia = false;
  }

  getTotalTran() {
    this._tran.getTotalTran().subscribe( () => {
      if (this._tran.totalTran.length > 0 && this._tran.totalTran[0].gtq != null) {
        this.totalVentagtq = this._tran.totalTran[0].gtq;
      } else {
        this.totalVentagtq = '0';
      }
    }, error => {
      this.alertCtrl.create({
        title: 'Error',
        subTitle: error.mensaje,
        buttons: ['OK']
      }).present()
    });
  }

  getTotalTranDia() {
    this.loading = true;
    this._tran.getTotalTranDia().subscribe( () => {
      this.loading = false;
      if (this._tran.totalTranDia) {
        this.totalVentagtq = this._tran.totalTranDia[0].gtq;
      } else {
        this.totalVentagtq = '0';
      }
    }, error => {
      this.alertCtrl.create({
        title: 'Error',
        subTitle: error.mensaje,
        buttons: ['OK']
      }).present()
    });
  }

  getTotalTranMes() {
    this.loading = true;
    this._tran.getTotalTranMes().subscribe( () => {
      this.loading = false;
      if (this._tran.totalTranMes && this._tran.totalTranMes[0].gtq != null) {
        this.totalVentagtq = this._tran.totalTranMes[0].gtq;
      } else {
        this.totalVentagtq = '0';
      }
    }, error => {
      this.alertCtrl.create({
        title: 'Error',
        subTitle: error.mensaje,
        buttons: ['OK']
      }).present()
    });
  }

  getTotalTranFecha(fechaInicio:any, fechaFin:any) {
    this.loading = true;
    this._tran.getTotalTranFecha(fechaInicio, fechaFin).subscribe(() => {
      this.loading = false;
      if (this._tran.totalTranFecha) {
        this.totalVentagtq = this._tran.totalTranFecha[0].total;
      } else {
        this.totalVentagtq = '0';
      }
    }, error => {
      console.log(error);
      this.alertCtrl.create({
        title: 'Error',
        subTitle: error.mensaje,
        buttons: ['OK']
      }).present()
    });
  }

  showDetalle(transaccion:any) {
    const modal = this.modalCtrl.create(DetalleTransaccionComponent, { existeTran: transaccion }, this.modalOptions);
    modal.present();
  }

  logout() {
    // this._auth.logout();
    this.navCtrl.setRoot(HomePage);
  }

}
