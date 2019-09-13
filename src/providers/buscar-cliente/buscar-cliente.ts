import { Http, URLSearchParams, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

import { AppContant } from '../../app/app.constant';
import { EndPoint } from '../end-point';
import { Observable } from 'rxjs/Rx';
import { AuthProvider } from '../auth/auth';

@Injectable()
export class BuscarClienteProvider {

  httpOptions: any = {
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  };

  misClientes:any[] = [];
  clienteResp:any = {};

  constructor(public http: Http, public auth: AuthProvider) {}

  getClientes(cliente:string): Observable<any> {
    let data = new URLSearchParams();
    data.append("token", this.auth.token);

    let url = AppContant.api + EndPoint.getCliente + `${cliente}` + `?${data}`;

    return this.http.get(url).map(resp => {
      let data_rep = resp.json();
      this.misClientes = data_rep.datos;
    }).catch((error: any) => Observable.throw(
      error.json()
    ));
  }

  crearCliente(cliente: any): Observable<any> {
    let data = new URLSearchParams();
    data.append("token", this.auth.token);
    let url = AppContant.api + EndPoint.crearCliente + `?${data}`;

    return this.http.post(url, cliente, this.httpOptions).map(resp => {
      let data_rep = resp.json();
      this.clienteResp = data_rep.datos;
      // console.log('Data cliente',this.clienteResp);
    }).catch((error: any) => Observable.throw(
      error
    ));
  }

}
