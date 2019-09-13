import { Http, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { AuthProvider } from '../auth/auth';
import { EndPoint } from '../end-point';
import { AppContant } from '../../app/app.constant';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

@Injectable()
export class TransaccionesProvider {

  listaTran:any[] = [];

  totalTran:any[] = [];
  totalTranDia:any[] = [];
  totalTranMes:any[] = [];
  totalTranFecha:any[] = [];

  constructor(public http: Http, public auth: AuthProvider) {

  }

  /**
   * Listado total de transacciones
   */
  getTransaccions(): Observable<any> {
    let data = new URLSearchParams();
    data.append("token", this.auth.token);

    let url = AppContant.api + EndPoint.getTran + `?${data}`;

    return this.http.get(url).map((resp:any) => {
      let data_resp = resp.json();
      this.listaTran = data_resp.datos;
    }).catch((error: any) => Observable.throw(
      error.json()
    ));
  }

  /**
   * Listado total de transacciones por Día
   */
  getTranDia(): Observable<any> {
    let data = new URLSearchParams();
    data.append("token", this.auth.token);

    let url = AppContant.api + EndPoint.getTranDia + `?${data}`;

    return this.http.get(url).map((resp: any) => {
      let data_resp = resp.json();
      this.listaTran = data_resp.datos;
    }).catch((error: any) => Observable.throw(
      error.json()
    ));
  }

  /**
   * Listado total de transacciones por Mes
   */
  getTranMes(): Observable<any> {
    let data = new URLSearchParams();
    data.append("token", this.auth.token);

    let url = AppContant.api + EndPoint.getTranMes + `?${data}`;

    return this.http.get(url).map((resp: any) => {
      let data_resp = resp.json();
      this.listaTran = data_resp.datos;
    }).catch((error: any) => Observable.throw(
      error.json()
    ));
  }

  /**
   * Listado total de transacciones por Fecha
   */
  getTranFecha(fechaInicio:string, fechaFin:string): Observable<any> {
    let data = new URLSearchParams();
    data.append("token", this.auth.token);

    let url = AppContant.api + EndPoint.getTranFecha + `${fechaInicio}/`+ `${fechaFin}` +`?${data}`;

    return this.http.get(url).map((resp: any) => {
      let data_resp = resp.json();
      this.listaTran = data_resp.datos;
    }).catch((error: any) => Observable.throw(
      error.json()
    ));
  }

  /**
   * Monto total de transacciones
   */
  getTotalTran(): Observable<any> {
    let data = new URLSearchParams();
    data.append("token", this.auth.token);

    let url = AppContant.api + EndPoint.getTotalTran + `?${data}`;

    return this.http.get(url).map((resp:any) => {
      let data_resp = resp.json();
      this.totalTran = data_resp.datos;
    }).catch((error: any) => Observable.throw(
      error.json()
    ));
  }

  /**
   * Monto total de transacciones por Dìa
   */
  getTotalTranDia(): Observable<any> {
    let data = new URLSearchParams();
    data.append("token", this.auth.token);

    let url = AppContant.api + EndPoint.getTotalTranDia + `?${data}`;

    return this.http.get(url).map((resp:any) => {
      let data_resp = resp.json();
      this.totalTranDia = data_resp.datos;
    }).catch((error: any) => Observable.throw(
      error.json()
    ));
  }

  /**
   * Monto total de transacciones por Mes
   */
  getTotalTranMes(): Observable<any> {
    let data = new URLSearchParams();
    data.append("token", this.auth.token);

    let url = AppContant.api + EndPoint.getTotalTranMes + `?${data}`;

    return this.http.get(url).map((resp:any) => {
      let data_resp = resp.json();
      this.totalTranMes = data_resp.datos;
    }).catch((error: any) => Observable.throw(
      error.json()
    ));
  }

  /**
   * Monto total de transacciones por Fecha
   */
  getTotalTranFecha(fechaInicio: any, fechaFin: any): Observable<any> {
    let data = new URLSearchParams();
    data.append("token", this.auth.token);

    let url = AppContant.api + EndPoint.getTotalTranFecha + `${fechaInicio}/` + `${fechaFin}` + `?${data}`;

    return this.http.get(url).map((resp: any) => {
      let data_resp = resp.json();
      this.totalTranFecha = data_resp.datos;
    }).catch((error: any) => Observable.throw(
      error.json()
    ));
  }

}
