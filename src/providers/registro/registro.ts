import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { EndPoint } from '../end-point';
import { AppContant } from '../../app/app.constant';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';
import { AuthProvider } from '../auth/auth';

@Injectable()
export class RegistroProvider {

  categoriaEmpresa:any[] = [];
  tiposEmpresa:any[] = [];

  httpOptions: any = {
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'No-Auth': 'True'
    })
  };

  httpOptionsAuth: any = {
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    })
  };

  constructor(public http: Http, public auth:AuthProvider) {}

  getTipoCategoria(): Observable<any> {
    let url = AppContant.api + EndPoint.getTipoCategoriaEmpresa;

    return this.http.get(url).map(resp => {
      let data_resp = resp.json();

      this.categoriaEmpresa = data_resp.datos.categoriaEmpresa;
      this.tiposEmpresa = data_resp.datos.tiposEmpresa;

    }).catch((error: any) => Observable.throw(
      error.json()
    ));
  }

  registerUser(usuarioObj:any): Observable<any> {
    let body = new URLSearchParams();
    body.set('id_categoria', usuarioObj.id_categoria)
    body.set('nombre_empresa', usuarioObj.nombre_empresa)
    body.set('nit_empresa', usuarioObj.nit_empresa)
    body.set('nombre_apellido', usuarioObj.nombre_apellido)
    body.set('telefono_empresa', usuarioObj.telefono_empresa)
    body.set('correo', usuarioObj.correo)
    body.set('codigo_referido', usuarioObj.codigo_referido)
    body.set('tipo_empresa', usuarioObj.tipo_empresa)

    let url = AppContant.api + EndPoint.registerUser;

    return this.http.post(url, body.toString(), this.httpOptions).map(resp => {
      let data_rep = resp.json();
      console.log('Estado registro: ', data_rep);
    }).catch((error: any) => Observable.throw(
      error.json()
    ));
  }

  changePassword(password:any): Observable<any> {
    let body = new URLSearchParams();
    body.set('password', password);

    let url = AppContant.api + EndPoint.changePass + `?token=${this.auth.token}`;

    return this.http.post(url, body.toString(), this.httpOptionsAuth).map(resp => {
      let data_rep = resp.json();
      console.log('Estado Pass: ', data_rep);
    }).catch((error: any) => Observable.throw(
      error.json()
    ));
  }

  DatosUser(UserObj: any): Observable<any> {
    let body = new URLSearchParams();
    body.set('dpi', UserObj.dpi);
    body.set('pais', UserObj.pais);
    body.set('direccion', UserObj.direccion);
    body.set('ciudad', UserObj.ciudad);

    let url = AppContant.api + EndPoint.datosUser + `?token=${this.auth.token}`;

    return this.http.post(url, body.toString(), this.httpOptionsAuth).map(resp => {
      let data_rep = resp.json();
      console.log('Estado Datos User: ', data_rep);
    }).catch((error: any) => Observable.throw(
      error.json()
    ));
  }

  tranUser(montoTran: any): Observable<any> {
    let body = new URLSearchParams();
    body.set('venta_mensual', montoTran);

    let url = AppContant.api + EndPoint.tranUser + `?token=${this.auth.token}`;

    console.log(url);

    console.log(body.toString());

    return this.http.post(url, body.toString(), this.httpOptionsAuth).map(resp => {
      let data_rep = resp.json();
      console.log('Estado Datos User: ', data_rep);
    }).catch((error: any) => Observable.throw(
      error.json()
    ));
  }

  BancoUser(BancoObj: any): Observable<any> {
    let body = new URLSearchParams();
    body.set('nombre_banco', BancoObj.nombre_banco);
    body.set('numero_cuenta', BancoObj.numero_cuenta);
    body.set('tipo_cuenta', BancoObj.tipo_cuenta);
    body.set('nombre_cuenta', BancoObj.nombre_cuenta);
    body.set('moneda', BancoObj.moneda);

    let url = AppContant.api + EndPoint.bancoUser + `?token=${this.auth.token}`;

    return this.http.post(url, body.toString(), this.httpOptionsAuth).map(resp => {
      let data_rep = resp.json();
      console.log('Estado Datos User: ', data_rep);
    }).catch((error: any) => Observable.throw(
      error.json()
    ));
  }

  subirDPI(image: string): Observable<any> {
    let body = new URLSearchParams();
    body.set('image_file', image);

    let url = AppContant.api + EndPoint.dpiUser + `?token=${this.auth.token}`;

    return this.http.post(url, body.toString(), this.httpOptionsAuth).map(resp => {
      let data_rep = resp.json();
      console.log('Estado upload: ', JSON.stringify(data_rep));

    }).catch((error: any) => Observable.throw(
      error.json()
    ));
  }

  subirRTU(image: string): Observable<any> {
    let body = new URLSearchParams();
    body.set('image_file', image);

    let url = AppContant.api + EndPoint.rtuUser + `?token=${this.auth.token}`;

    return this.http.post(url, body.toString(), this.httpOptionsAuth).map(resp => {
      let data_rep = resp.json();
      console.log('Estado upload: ', JSON.stringify(data_rep));
    }).catch((error: any) => Observable.throw(
      error.json()
    ));
  }

}
