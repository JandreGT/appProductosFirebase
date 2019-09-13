import { Http, URLSearchParams, } from '@angular/http';
import { Injectable } from '@angular/core';
import { AlertController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { AppContant } from '../../app/app.constant';
import { EndPoint } from '../end-point';

import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class AuthProvider {

  token: any;
  email: any;
  password: any;

  //Variables para determinar pantallas de app
  isInstalled:any = 1;
  isEmpresa:any;
  isPerson:any;
  hidenWelcom:any;

  posCard:any;
  // expireDate:any;
  // posTrack:any;

  stateLogin: boolean;

  constructor(public http: Http, public alertCtrl: AlertController, private platform: Platform, private storage: Storage) {
    this.cargarStorage();
  }

  loginUser(email: string, password: string): Observable<any> {
    let data = new URLSearchParams();

    data.append("email", email);
    data.append("password", password);

    let url = AppContant.api + EndPoint.login

    return this.http.post(url, data).map(resp => {
      let data_rep = resp.json();

      this.token = data_rep.token
      this.email = email;
      this.password = password;
      // console.log("Token generado: ", this.token);
      // console.log("Email auth: ", this.email);
      // console.log("Pass auth: ", this.password);

      // Guardar storage
      this.guardarStorage();

    }).catch((error: any) => Observable.throw(
      error.json()
    ));
  }

  goEmpresa(state:any) {
    this.isEmpresa = state;
    this.guardarStoregeEmpre();
  }

  goPerson(state:any) {
    this.isPerson = state;
    this.guardarStoregePerson();
  }

  irLoginUser(hideWelcom:any) {
    this.hidenWelcom = hideWelcom;
    this.guardarStoregeWelcom();
  }

  private guardarStorage() {
    if (this.platform.is("cordova")) {
      this.storage.set('token', this.token);
      this.storage.set('email', this.email);
      this.storage.set('password', this.password);

      // console.log('------------- storage nativo ----------------');
      // console.log('save storage nativo', this.token);
      // console.log('save storage nativo', this.email);
      // console.log('save storage nativo', this.password);

    } else {
      if (this.token) {
        localStorage.setItem("token", this.token);
        localStorage.setItem('email', this.email);
        localStorage.setItem('password', this.password);

        // console.log('------------- storage general ----------------');
        // console.log('save storage general', this.token);
        // console.log('save storage general', this.email);
        // console.log('save storage general', this.password);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("password");
      }
    }
  }

  guardarStoregeApp() {
    if (this.platform.is("cordova")) {
      this.storage.set('stateApp', this.isInstalled);
      // console.log('------------- storage nativo ----------------');
      // console.log('save storage nativo', this.isInstalled);
    } else {
      if (this.isInstalled) {
        localStorage.setItem('stateApp', this.isInstalled);
        // console.log('------------- storage general ----------------');
        // console.log('save storage general', this.isInstalled);
      } else {
        localStorage.removeItem("stateApp");
      }
    }
  }

  private guardarStoregeEmpre() {
    if (this.platform.is("cordova")) {
      this.storage.set('stateEmpre', this.isEmpresa);
      // console.log('------------- storage nativo ----------------');
      // console.log('save storage nativo', this.isEmpresa);
    } else {
      if (this.isEmpresa) {
        localStorage.setItem('stateEmpre', this.isEmpresa);
        // console.log('------------- storage general ----------------');
        // console.log('save storage general', this.isEmpresa);
      } else {
        localStorage.removeItem("stateEmpre");
      }
    }
  }

  private guardarStoregePerson() {
    if (this.platform.is("cordova")) {
      this.storage.set('statePerson', this.isPerson);
      // console.log('------------- storage nativo ----------------');
      // console.log('save storage nativo', this.isPerson);
    } else {
      if (this.isPerson) {
        localStorage.setItem('statePerson', this.isPerson);
        // console.log('------------- storage general ----------------');
        // console.log('save storage general', this.isPerson);
      } else {
        localStorage.removeItem("statePerson");
      }
    }
  }

  private guardarStoregeWelcom() {
    if (this.platform.is("cordova")) {
      this.storage.set('stateWelcome', this.hidenWelcom);
      // console.log('------------- storage nativo ----------------');
      // console.log('save storage nativo', this.hidenWelcom);
    } else {
      if (this.hidenWelcom) {
        localStorage.setItem('stateWelcome', this.hidenWelcom);
        // console.log('------------- storage general ----------------');
        // console.log('save storage general', this.hidenWelcom);
      } else {
        localStorage.removeItem("stateWelcome");
      }
    }
  }

  cargarStorage() {
    let promesa = new Promise((resolve, reject) => {
      if (this.platform.is("cordova")) {
        this.storage.get("stateApp").then(app => {
          if (app) {
            this.isInstalled = app;
            // console.log('Cargo Storage App: ', this.isInstalled);
          }
        });

        this.storage.get("token").then(token => {
          if (token) {
            this.token = token;
            // console.log('Storage Nativo: ', this.token);
          }
        });

        this.storage.get("email").then(email => {
          if (email) {
            this.email = email;
            // console.log('Storage Nativo: ', this.email);
          }
        });

        this.storage.get("password").then(pass => {
          if (pass) {
            this.password = pass;
            // console.log('Storage Nativo: ', this.password);
          }
        });
        resolve();

      } else {
        if (localStorage.getItem("stateApp")) {
          this.isInstalled = localStorage.getItem("stateApp");
          this.token = localStorage.getItem("token");
          this.email = localStorage.getItem("email");
          this.password = localStorage.getItem("password");

          // console.log('Cargo storage general: ', this.isInstalled);
          // console.log('Storage general', this.token);
          // console.log('Storage general', this.email);
          // console.log('Storage general', this.password);

        }
        resolve();
      }
    })
  }

  isLogin(): boolean {
    this.token != undefined ? this.stateLogin = true : this.stateLogin = false;

    return this.stateLogin;
  }

  resetApp() {
    this.token = null;
    this.email = null;
    this.password = null;
    this.isEmpresa = null;
    this.isPerson = null;
    this.hidenWelcom = null;
    this.guardarStoregeEmpre();
    this.guardarStoregePerson();
    this.guardarStoregeWelcom();
    this.guardarStorage();
  }

  logout() {
    this.token = null;
    this.email = null;
    this.password = null;
    this.guardarStorage();
  }

}
