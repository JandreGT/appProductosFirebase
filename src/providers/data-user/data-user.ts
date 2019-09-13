import { Http, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { AuthProvider } from '../auth/auth';
import { EndPoint } from '../end-point';
import { AppContant } from '../../app/app.constant';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

@Injectable()
export class DataUserProvider {

  infoUser:any = {};
  apikeyEmpresa:any = {};
  infoEmpresa:any = {};
  changePass:boolean = false;
  datosUser:boolean = false;
  datosEmpresa:boolean = false;
  datosBancos:boolean = false;
  actiCuenta:boolean = false;
  personalizarEmp:any = {};

  constructor(public http: Http, public auth: AuthProvider) {

  }

  getUser(): Observable<any> {
    let data = new URLSearchParams();
    data.append("token", this.auth.token);

    let url = AppContant.api + EndPoint.getUser + `?${data}`;

    return this.http.get(url).map(resp => {
      let data_rep = resp.json();

      this.infoUser = data_rep.datos;
      this.infoEmpresa.nombre = this.infoUser.empresa.nombre;
      this.infoEmpresa.changePass = this.infoUser.user.change_pass;
      this.infoEmpresa.perfil = this.infoUser.user.perfil_usuario;
      this.infoEmpresa.tipoLlave = this.infoUser.tipo_llave;

      this.validateStatusUser();

      if (this.infoUser.empresa.apikey_app != '') {
        this.apikeyEmpresa.token = this.infoUser.empresa.apikey_app[0].token;
        this.apikeyEmpresa.idenEmpresa = this.infoUser.empresa.apikey_app[0].idenEmpresa;
        this.apikeyEmpresa.key_public = this.infoUser.empresa.apikey_app[0].key_public;
        this.apikeyEmpresa.key_secret = this.infoUser.empresa.apikey_app[0].key_secret;
      } else {
        console.log('ApiKey Vacias');
      }

      if (data_rep.datos.empresa.personalizar != '' || data_rep.datos.empresa.personalizar != null) {
        this.personalizarEmp = data_rep.datos.empresa.personalizar;
        // console.log(this.personalizarEmp);
      } else {
        console.log('Personalización vacia');
      }


    }).catch((error: any) => Observable.throw(
      error.json()
    ));
  }

  validateStatusUser() {
    if (this.infoEmpresa.changePass === 0 && this.infoEmpresa.perfil.estado === 1) {
      this.changePass = true;
      // console.log('Cambiar Contraseña ', this.changePass, 'estado', this.infoEmpresa.perfil.estado);
    } else if (this.infoEmpresa.changePass != 0 && this.infoEmpresa.perfil.estado === 2) {
      this.datosUser = true;
      // console.log('Tus Datos ', this.datosUser, 'estado', this.infoEmpresa.perfil.estado);
    } else if (this.infoEmpresa.changePass != 0 && this.infoEmpresa.perfil.estado === 3) {
      this.datosEmpresa = true;
      // console.log('Datos Negocio ', this.datosEmpresa, 'estado', this.infoEmpresa.perfil.estado);
    } else if (this.infoEmpresa.changePass != 0 && this.infoEmpresa.perfil.estado === 4) {
      this.datosBancos = true;
      // console.log('Datos depósitos Bancos ', this.datosBancos, 'estado', this.infoEmpresa.perfil.estado);
    } else if (this.infoEmpresa.changePass != 0 && this.infoEmpresa.perfil.estado === 7 || this.infoEmpresa.changePass != 0
                && this.infoEmpresa.perfil.estado === 8) {
      this.actiCuenta = true;
      // console.log('En espera de Activación', 'estado', this.infoEmpresa.perfil.estado);
    } else if (this.infoEmpresa.changePass != 0 && this.infoEmpresa.perfil.estado === 10 || this.infoEmpresa.changePass != 0
                && this.infoEmpresa.perfil.estado === 11) {
      // console.log('Puede Transaccinar', 'estado', this.infoEmpresa.perfil.estado);
    } else {
      if (this.infoEmpresa.perfil.estado === 10 || this.infoEmpresa.perfil.estado === 11) {
        // console.log('pass != 1 y ', 'estado', this.infoEmpresa.perfil.estado);
      } else {
        this.actiCuenta = true;
      }
    }
  }

}
