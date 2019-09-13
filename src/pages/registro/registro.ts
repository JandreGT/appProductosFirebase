import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { RegistroProvider } from '../../providers/index.services';

@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {

  pasoUno:boolean = true;
  pasoDos:boolean = false;
  pasoTres:boolean = false;

  registroUsuario:any = {};

  constructor(public navCtrl: NavController, public _rs:RegistroProvider, public alertCtrl:AlertController,
              public loadingCtrl:LoadingController) {
    this.getCategoriaTipoEmpresa();
  }

  showInfoUsuario(datos:any) {
    this.registroUsuario.categoria = datos.categoria;
    this.registroUsuario.empresa = datos.empresa

    if (this.registroUsuario.categoria != '' && this.registroUsuario.empresa != '' || this.registroUsuario.categoria != 0 && this.registroUsuario.empresa != 0) {
      this.pasoUno = false;
      this.pasoDos = true;
      console.log(this.registroUsuario);
    } else {
      this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Los campos categoría y tipo de empresa son requeridos',
        buttons: ['OK']
      }).present()

    }
  }

  registrarUsuario(dataUser:NgForm) {
    let datos = dataUser.value;
    let codReferido = '';

    if (datos.referidoEmpesa === undefined) {
      codReferido = '';
    } else {
      codReferido = datos.referidoEmpesa
    }

    let datosUsuario = {
      id_categoria: this.registroUsuario.categoria,
      nombre_empresa: datos.nombreEmpesa,
      nit_empresa: datos.nitEmpesa,
      nombre_apellido: datos.nombreapellido,
      telefono_empresa: datos.telefonoEmpesa,
      correo: datos.correoEmpesa,
      codigo_referido: codReferido,
      tipo_empresa: this.registroUsuario.empresa
    }

    const loader = this.loadingCtrl.create({content: "",});
    loader.present();
    this._rs.registerUser(datosUsuario).subscribe( () => {
      loader.dismiss();
      this.pasoDos = false;
      this.pasoTres = true;
    }, error => {
      loader.dismiss();
      this.alertCtrl.create({
        title: 'Error al Registrarse',
        subTitle: error.message,
        buttons: ['OK']
      }).present()
    });
  }

  loginRegistro() {
    this.navCtrl.pop();
  }

  getCategoriaTipoEmpresa() {
    this._rs.getTipoCategoria().subscribe( () => {});
  }


}
