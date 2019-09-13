import { Http, URLSearchParams, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { AppContant } from '../../app/app.constant';
import { EndPoint } from '../end-point';

import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { AuthProvider } from '../auth/auth';
import { DataUserProvider } from '../data-user/data-user';
import { TranAcceptPage } from '../../pages/tran-accept/tran-accept';
import { TranRejectPage } from '../../pages/tran-reject/tran-reject';


@Injectable()
export class PosProvider {

  tranAccept:boolean = false;
  tranReject:boolean = false;

  constructor(public http: Http, public _auth: AuthProvider, public _user: DataUserProvider, public modalCtrl:ModalController) {}

  httpOptions:any = {
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  };

  // modalOptions:any = {
  //   showBackdrop: true,
  //   enableBackdropDismiss: true,
  //   cssClass: 'modal-pagalo'
  // }

  sendSale(jsonVenta:any): Observable<any> {
    let data = new URLSearchParams();
    data.append("token", this._auth.token);
    let url = AppContant.api + EndPoint.sendSale + `${this._user.apikeyEmpresa.token}` + `?${data}`;


    return this.http.post(url, jsonVenta, this.httpOptions).map(resp => {
      let data_rep = resp.json();
      // console.log('Estado venta: ' , data_rep);
      // console.log('Estado resp: ', JSON.stringify(data_rep));

      if (data_rep.decision == 'ACCEPT') {
        this.tranAccept = true;
        this.tranReject = false;
        const modal = this.modalCtrl.create(TranAcceptPage);
        modal.present();
      } else if (data_rep.decision == 'REJECT') {
        this.tranReject = true;
        this.tranAccept = false;
        const modal = this.modalCtrl.create(TranRejectPage);
        modal.present();
      }
    }).catch((error: any) => Observable.throw(
      error
    ));
  }

  sendSalePos(jsonVentaPos: any): Observable<any> {
    let data = new URLSearchParams();
    data.append("token", this._auth.token);
    let url = AppContant.api + EndPoint.sendSalePos + `${this._user.apikeyEmpresa.token}` + `?${data}`;


    return this.http.post(url, jsonVentaPos, this.httpOptions).map(resp => {
      let data_rep = resp.json();
      // console.log('Estado venta: ', data_rep);
      // console.log('Estado resp: ' + resp);

      if (data_rep.decision == 'ACCEPT') {
        const modal = this.modalCtrl.create(TranAcceptPage);
        modal.present();
      } else if (data_rep.decision == 'REJECT') {
        const modal = this.modalCtrl.create(TranRejectPage);
        modal.present();
      }
    }).catch((error: any) => Observable.throw(
      error
    ));
  }

}
