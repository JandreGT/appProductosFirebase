import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PersonaPage } from '../persona/persona';
import { AuthProvider } from '../../providers/auth/auth';
import { BienvenidaPage } from '../bienvenida/bienvenida';

@Component({
  selector: 'page-tipo-usuario',
  templateUrl: 'tipo-usuario.html',
})
export class TipoUsuarioPage {

  constructor(public navCtrl: NavController, public _auth:AuthProvider) {}

  irEmpresa() {
    this.navCtrl.setRoot(BienvenidaPage);
    this._auth.goEmpresa(1);
  }

  irPersona() {
    this.navCtrl.setRoot(PersonaPage);
    this._auth.goPerson(1);
  }

}
