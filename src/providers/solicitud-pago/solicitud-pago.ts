import { Http, URLSearchParams, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { AlertController, ModalController } from 'ionic-angular';

import { AppContant } from '../../app/app.constant';
import { EndPoint } from '../end-point';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { AuthProvider } from '../auth/auth';
import { DataUserProvider } from '../data-user/data-user';

@Injectable()
export class SolicitudPagoProvider {

  linkSoli:any = '';
  qrEmpresa:any;
  qrSoli:any = '';

  httpOptions: any = {
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  };

  constructor(public http: Http, public _auth: AuthProvider, public _user: DataUserProvider, public alertCtrl: AlertController,
              public modalCtrl: ModalController, public auth:AuthProvider) {

  }

  sendSoliLink(jsonVenta: any): Observable<any> {
    let data = new URLSearchParams();
    data.append("token", this._auth.token);
    let url = AppContant.api + EndPoint.sendLink + `${this._user.apikeyEmpresa.token}` + `?${data}`;

    return this.http.post(url, jsonVenta, this.httpOptions).map(resp => {
      let data_rep = resp.json();
      console.log('Estado Link: ', data_rep);
      this.linkSoli = data_rep;
    }).catch((error: any) => Observable.throw(
      error.json()
    ));
  }

  sendSoliMail(jsonVenta: any): Observable<any> {
    let data = new URLSearchParams();
    data.append("token", this._auth.token);
    let url = AppContant.api + EndPoint.sendEmail + `${this._user.apikeyEmpresa.token}` + `?${data}`;

    return this.http.post(url, jsonVenta, this.httpOptions).map(resp => {
      let data_rep = resp.json();
      console.log('Estado Envio: ', data_rep);
    }).catch((error: any) => Observable.throw(
      error.json()
    ));
  }


  /**
   *
   * Función para Generar QR
   *
   */
  getQr(): Observable<any> {
    let data = new URLSearchParams();
    data.append("token", this.auth.token);

    let url = AppContant.api + EndPoint.getQrEmpresa + `?${data}`;

    return this.http.get(url).map(resp => {
      let data_rep = resp.json();

      this.qrEmpresa = `data:image/png;base64,${data_rep.qr}`;
    }).catch((error: any) => Observable.throw(
      error.json()
    ));
  }


  /**
   *
   * Función para Solicitud de pago por QR
   *
   */

  sendSoliQR(jsonVenta: any): Observable<any> {
    let data = new URLSearchParams();
    data.append("token", this._auth.token);
    let url = AppContant.api + EndPoint.sendQR + `${this._user.apikeyEmpresa.token}` + `?${data}`;

    return this.http.post(url, jsonVenta, this.httpOptions).map(resp => {
      let data_rep = resp.json();
      this.qrSoli = `data:image/png;base64,${data_rep.qr}`;;
    }).catch((error: any) => Observable.throw(
      error.json()
    ));
  }
}
