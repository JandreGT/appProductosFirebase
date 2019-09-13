import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { EndPoint } from '../end-point';
import { AppContant } from '../../app/app.constant';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';
import { AuthProvider } from '../auth/auth';

@Injectable()
export class AjustesProvider {

  httpOptions: any = {
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    })
  };

  constructor(public http: Http, public auth:AuthProvider) {}

  updateInfoTienda(TiendaObj: any): Observable<any> {
    let body = new URLSearchParams();
    body.set('correo_publico', TiendaObj.correo);
    body.set('telefono_publico', TiendaObj.telefono);
    body.set('facebook', TiendaObj.facebook);
    body.set('instagram', TiendaObj.instagram);
    body.set('direccion_publico', TiendaObj.direccion);

    let url = AppContant.api + EndPoint.updateInfoPublic + `?token=${this.auth.token}`;

    return this.http.post(url, body.toString(), this.httpOptions).map(resp => {
      let data_rep = resp.json();
      console.log('Estado info: ', data_rep);
    }).catch((error: any) => Observable.throw(
      error.json()
    ));
  }

  subirLogo(image: string): Observable<any> {
    let body = new URLSearchParams();
    body.set('image_file', image);

    let url = AppContant.api + EndPoint.logoEmpresa + `?token=${this.auth.token}`;

    return this.http.post(url, body.toString(), this.httpOptions).map(resp => {
      let data_rep = resp.json();
      console.log('Estado logo: ', JSON.stringify(data_rep));

    }).catch((error: any) => Observable.throw(
      error.json()
    ));
  }

  subirPortada(image: string): Observable<any> {
    let body = new URLSearchParams();
    body.set('image_file', image);

    let url = AppContant.api + EndPoint.portadaEmpresa + `?token=${this.auth.token}`;

    return this.http.post(url, body.toString(), this.httpOptions).map(resp => {
      let data_rep = resp.json();
      console.log('Estado portada: ', JSON.stringify(data_rep));

    }).catch((error: any) => Observable.throw(
      error.json()
    ));
  }

}
