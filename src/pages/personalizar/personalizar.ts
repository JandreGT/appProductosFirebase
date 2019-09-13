import { Component } from '@angular/core';
import { MenuController, ModalController } from 'ionic-angular';
import { DataUserProvider } from '../../providers/index.services';
import { InfoTiendaComponent, ModalImageComponent } from '../../components/index.components';

@Component({
  selector: 'page-personalizar',
  templateUrl: 'personalizar.html',
})
export class PersonalizarPage {

  datosPublico:any = {}
  modalOptions: any = {
    showBackdrop: true,
    enableBackdropDismiss: true,
    cssClass: 'modal-pagalo'
  }

  constructor(public menuCtrl:MenuController, public _user:DataUserProvider, public modalCtrl:ModalController) {}

  mostrarMenu() {
    this.menuCtrl.toggle();
  }

  editInfo() {
    const modalProducto = this.modalCtrl.create(InfoTiendaComponent, { existeInfo: this.datosPublico }, this.modalOptions);
    modalProducto.present();
  }

  irPortada() {
    const modalPortada = this.modalCtrl.create(ModalImageComponent, { tipo: 'portada' });
    modalPortada.present();
  }

  irLogo() {
    const modalLogo = this.modalCtrl.create(ModalImageComponent, { tipo: 'logo' });
    modalLogo.present();
  }


  ionViewWillEnter() {
    this.datosPublico = this._user.personalizarEmp;
  }

}
