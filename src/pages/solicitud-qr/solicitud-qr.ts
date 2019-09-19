import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { DataUserProvider, AuthProvider, SolicitudPagoProvider, BuscarClienteProvider } from '../../providers/index.services';
import { HomePage } from '../home/home';
import { DashboardPage } from '../dashboard/dashboard';

//helpers
import PAISES from '../../helpers/paises.export';
import ESTADOSCA from '../../helpers/estadosCA.export';
import ESTADOSUS from '../../helpers/estadosUS.export';

@Component({
  selector: 'page-solicitud-qr',
  templateUrl: 'solicitud-qr.html',
})
export class SolicitudQrPage {

  datosTran: any = {};
  keysEmpresa: any = {};

  cliente = {
    descripcion: <any>'',
  }

  frmSolicitud:boolean = false;
  cardQR:boolean = false;
  infoEmpresa: any = {};
  nombreEmpesa: string = '';
  telefonoEmpresa: string = '';
  logoEmpresa: any;

  buscarCliente: boolean = true;
  datosVenta: boolean = false;
  encontradoCliente: boolean = false;
  crearClientev: boolean = false;

  busCliente: any = {};
  clientes: any[] = [];
  clienteTran: any = {};

  crearCliente: any = {};
  paises: any[] = PAISES;
  estadosCA: any[] = ESTADOSCA;
  estadosUS: any[] = ESTADOSUS;

  selectOptions = {
    title: 'Países',
    subTitle: 'selecciona el país de tu cliente'
  };

  selectOptionsUC = {
    title: 'Estados',
    subTitle: 'selecciona el estado de tu cliente'
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public _user:DataUserProvider,
              public alertCtrl:AlertController, public _auth:AuthProvider, public loadingCtrl:LoadingController,
              public _solicitud:SolicitudPagoProvider, public _cs:BuscarClienteProvider) {

    this.getDataUser();
    this.datosTran = this.navParams.get('datosTran');
    this.crearCliente.pais = 'GT';
  }

  getDataUser() {
    this._user.getUser().subscribe(resp => {
      this.keysEmpresa = this._user.apikeyEmpresa;
      this.infoEmpresa = this._user.infoUser;
      this.nombreEmpesa = this.infoEmpresa.empresa.nombre;

      if (this.infoEmpresa.empresa.personalizar != null && this.infoEmpresa.empresa.personalizar.telefono != ' ') {
        this.telefonoEmpresa = this.infoEmpresa.empresa.personalizar.telefono;
      } else {
        this.telefonoEmpresa = '22960894';
      }

      if (this.infoEmpresa.empresa.personalizar != null && this.infoEmpresa.empresa.personalizar.logo != '') {
        this.logoEmpresa = this.infoEmpresa.empresa.personalizar.logo;
      } else {
        this.logoEmpresa = 'https://pagalocard.s3.amazonaws.com/empresa/personalizar/u55/e26/26_300x300_sms-pagalo.jpg';
      }
    }, error => {
      this.alertCtrl.create({
        title: 'Tu sesión ha expirado',
        subTitle: error.mensaje,
        buttons: [
          {
            text: 'Ok',
            handler: data => {
              this.logout();
            }
          }
        ]
      }).present()
    });
  }

  searchCliente(dataCliente: NgForm) {
    let nombreCliente = dataCliente.value;

    const loader = this.loadingCtrl.create({ content: "" }); loader.present();
    this._cs.getClientes(nombreCliente.nombre).subscribe(() => {
      loader.dismiss();
      this.clientes = this._cs.misClientes;
      this.encontradoCliente = true;
    }, error => {
      this.encontradoCliente = false;
      loader.dismiss();
      this.alertCtrl.create({
        title: 'Error al buscar',
        subTitle: error.mensaje,
        buttons: [
          { text: 'Cancelar' },
          {
            text: 'Crear',
            handler: () => {
              this.crearCliente.nombre = this.busCliente.nombre
              this.buscarCliente = false;
              this.crearClientev = true;
            }
          }
        ]
      }).present()
    });
  }

  showCrear() {
    this.crearCliente.nombre = this.busCliente.nombre
    this.buscarCliente = false;
    this.crearClientev = true;
  }

  clienteCreate(cliente: NgForm) {
    let dataCliente = cliente.value;

    let clienteObj = {
      firstName: dataCliente.nombre,
      lastName: dataCliente.apellido,
      street1: dataCliente.direccion,
      country: dataCliente.pais,
      city: dataCliente.ciudad,
      state: dataCliente.estado,
      postalCode: dataCliente.postalCode,
      email: dataCliente.email,
      phone: dataCliente.telefono,
      nit: dataCliente.nit
    }

    let clienteJson = JSON.stringify(clienteObj);
    let clienteNuevo: any = { 'cliente': clienteJson };

    const loader = this.loadingCtrl.create({ content: "" }); loader.present();
    this._cs.crearCliente(clienteNuevo).subscribe(() => {
      loader.dismiss();
      this.crearClientev = false;
      this.buscarCliente = false;
      this.encontradoCliente = false;
      this.clienteTran = this._cs.clienteResp;
      this.frmSolicitud = true;
      this.datosVenta = true;
    }, error => {
      loader.dismiss();
      this.alertCtrl.create({
        title: 'Error',
        subTitle: error.mensaje,
        buttons: ['OK']
      }).present()
    });
  }

  asignarCliente(cliente: any) {
    this.buscarCliente = false;
    this.encontradoCliente = false;
    this.clienteTran = cliente;
    this.frmSolicitud = true;
    this.datosVenta = true;
  }

  enviarSoli(data: NgForm) {
    let dataSoli = data.value;

    let empresa: any = {
      key_secret: this.keysEmpresa.key_secret,
      key_public: this.keysEmpresa.key_public,
      idenEmpresa: this.keysEmpresa.idenEmpresa
    }

    let cliente = {
      codigo: '',
      firstName: this.clienteTran.nombre,
      lastName: this.clienteTran.apellido,
      street1: this.clienteTran.direccion,
      phone: this.clienteTran.telefono,
      country: this.clienteTran.pais,
      city: this.clienteTran.ciudad,
      state: this.clienteTran.state,
      postalCode: this.clienteTran.postalcode,
      email: this.clienteTran.email,
      ipAddress: '192.168.10.1',
      Total: this.datosTran.montoTran,
      fecha_transaccion: {},
      currency: this.datosTran.moneda,
      deviceFingerprintID: ''
    };

    let detalle = {
      id_producto: '01',
      cantidad: '1',
      tipo: 'Solicitud Pago App',
      nombre: dataSoli.descripcion,
      precio: this.datosTran.montoTran,
      Subtotal: this.datosTran.montoTran,
    }

    let jsonEmpesa = JSON.stringify(empresa);
    let jsonCliente = JSON.stringify(cliente);
    let jsonDetalle = JSON.stringify(detalle);

    let ventaTransaccion: any = {
      'empresa': jsonEmpesa,
      'cliente': jsonCliente,
      'detalle': jsonDetalle
    };

    const loader = this.loadingCtrl.create({content: ""});
    loader.present();

    this._solicitud.sendSoliQR(ventaTransaccion).subscribe(() => {
      loader.dismiss();
      this.frmSolicitud = false;
      this.cardQR = true;
    }, error => {
      loader.dismiss();
      this.alertCtrl.create({
        title: 'Error en Solicitud',
        subTitle: error.mensaje,
        buttons: [
          {
            text: 'Ok',
            handler: data => {
              this.logout();
            }
          }
        ]
      }).present()
    });

  }

  irHome() {
    this.navCtrl.setRoot(DashboardPage)
  }

  logout() {
    // this._auth.logout();
    this.navCtrl.setRoot(HomePage);
  }

}
