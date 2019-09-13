import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, LoadingController, ModalController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DataUserProvider, AuthProvider, SolicitudPagoProvider, BuscarClienteProvider } from '../../providers/index.services';
import { HomePage } from '../home/home';
import { SoliAceptPage } from '../soli-acept/soli-acept';
import { SoliRejectPage } from '../soli-reject/soli-reject';
import { DashboardPage } from '../dashboard/dashboard';

//helpers
import PAISES from '../../helpers/paises.export';
import ESTADOSCA from '../../helpers/estadosCA.export';
import ESTADOSUS from '../../helpers/estadosUS.export';

@Component({
  selector: 'page-solicitupago',
  templateUrl: 'solicitupago.html',
})
export class SolicitupagoPage {

  datosTran: any = {};
  keysEmpresa: any = {};
  showMontoTran:boolean = false;
  frmShared:boolean = false;
  btnShared:boolean = false;
  frmMail:boolean = false;
  irHome:boolean = false;
  erorTran:boolean = false;

  linkSolicitud:any = '';
  descripSoli:any = '';

  cliente = {
    descripcion: <any>'',
    email: <any>'',
  }

  buscarCliente:boolean = true;
  datosVenta:boolean = false;
  encontradoCliente:boolean = false;
  crearClientev: boolean = false;

  busCliente:any = {};
  clientes:any[] = [];
  clienteTran:any = {};

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

  formatMontoSolip:any;
  showDireccion:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public socialSharing: SocialSharing,
              public _user:DataUserProvider, public alertCtrl:AlertController,
              public _auth:AuthProvider, public platform: Platform, public _solicitud:SolicitudPagoProvider,
              public loadingCtrl:LoadingController, public modalCtrl:ModalController, public _cs:BuscarClienteProvider) {
    this.getDataUser();
    this.validateLlave();
    this.datosTran = this.navParams.get("datosTran");
    this.crearCliente.pais = 'GT';
    this.formatMontoSolip = parseFloat(this.datosTran.montoTran).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  getDataUser() {
    this._user.getUser().subscribe(resp => {
      this.keysEmpresa = this._user.apikeyEmpresa
    }, error => {
      this.alertCtrl.create({
        title: 'Tu sesión ha expirado',
        subTitle: error.mensaje,
        buttons: [{ text: 'Ok' }]
      }).present()
      this.logout();
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
      this.frmShared = true;
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
    this.frmShared = true;
    this.clienteTran = cliente;
    this.datosVenta = true;
  }

  enviarSoli() {
    this.frmShared = false;
    this.btnShared = true;
  }

  modalAccept = this.modalCtrl.create(SoliAceptPage);
  modalReject = this.modalCtrl.create(SoliRejectPage);

  sharedSoli(data: NgForm, tipo:any) {
    let dataSoli = data.value;

    if (this.datosTran.ventaProducto) {
      console.log('soli productos');

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

      let detalle: any = [];
      let detalles: any = {};

      this.datosTran.productos.forEach(element => {
        detalles = {};
        detalles.id_producto = element.id,
        detalles.cantidad = element.cantidadProducto,
        detalles.tipo = element.nombre,
        detalles.nombre = element.nombre,
        detalles.precio = element.precio,
        detalles.Subtotal = element.cantidadProducto * element.precio

        detalle.push(detalles);
      });

      let jsonEmpesa = JSON.stringify(empresa);
      let jsonCliente = JSON.stringify(cliente);
      let jsonDetalle = JSON.stringify(detalle);

      let ventaTransaccion: any = {
        'empresa': jsonEmpesa,
        'cliente': jsonCliente,
        'detalle': jsonDetalle
      };

      const loader = this.loadingCtrl.create({ content: "" });

      if (tipo != 'mail') { loader.present(); }

      switch (tipo) {
        case 'wts':
          this._solicitud.sendSoliLink(ventaTransaccion).subscribe(() => {
            loader.dismiss();
            this.linkSolicitud = this._solicitud.linkSoli.url;

            this.descripSoli = `Hola ${this.clienteTran.nombre} ${this.clienteTran.apellido} tienes una solicitud de Pago de la empresa ${this._user.infoEmpresa.nombre} por el monto de ${this.datosTran.moneda} ${this.formatMontoSolip} y el consumo de ${detalle.length} productos.\n\n`;

            this.openWhats(this.descripSoli, this.linkSolicitud);
            this.btnShared = false;
          }, error => {
            loader.dismiss();
            this.modalReject.present();
          });
        break;

        case 'sms':
          this._solicitud.sendSoliLink(ventaTransaccion).subscribe(() => {
            loader.dismiss();
            this.linkSolicitud = this._solicitud.linkSoli.url;

            this.descripSoli = `Hola ${this.clienteTran.nombre} ${this.clienteTran.apellido} tienes una solicitud de Pago de la empresa ${this._user.infoEmpresa.nombre} por el monto de ${this.datosTran.moneda} ${this.formatMontoSolip} y el consumo de ${detalle.length} productos.
            \n\n ${this.linkSolicitud}`;

            this.openSms(this.descripSoli, this.clienteTran.telefono);
            this.btnShared = false;
          }, error => {
            loader.dismiss();
            this.modalReject.present();
          });
        break;

        case 'mssg':
          this._solicitud.sendSoliLink(ventaTransaccion).subscribe(() => {
            loader.dismiss();
            this.linkSolicitud = this._solicitud.linkSoli.url;

            this.descripSoli = `Hola ${this.clienteTran.nombre} ${this.clienteTran.apellido} tienes una solicitud de Pago de la empresa ${this._user.infoEmpresa.nombre} por el monto de ${this.datosTran.moneda} ${this.formatMontoSolip} y el consumo de ${detalle.length} productos.\n\n`;

            this.openMessenger(this.descripSoli, this.linkSolicitud);
            this.btnShared = false;
          }, error => {
            loader.dismiss();
            this.modalReject.present();
          });
        break;

        case 'mail':
          this.cliente.email = this.clienteTran.email;
          this.btnShared = false;
          this.frmMail = true;
        break;

        case 'shrd':
          this._solicitud.sendSoliLink(ventaTransaccion).subscribe(() => {
            loader.dismiss();
            this.descripSoli = `Hola ${this.clienteTran.nombre} ${this.clienteTran.apellido} tienes una solicitud de Pago de la empresa ${this._user.infoEmpresa.nombre} por el monto de ${this.datosTran.moneda} ${this.formatMontoSolip} y el consumo de ${detalle.length} productos.\n`;

            this.linkSolicitud = this._solicitud.linkSoli.url;

            this.openShared(this.descripSoli, this.linkSolicitud);
            this.btnShared = false;
          }, error => {
            loader.dismiss();
            this.modalReject.present();
          });
        break;

        default:
          break;
      }

    } else {
      console.log('Soli Normal');

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

      let detalle: any = [];
      let detalles = {
        id_producto: '01',
        cantidad: '1',
        tipo: 'Solicitud Pago App',
        nombre: this.cliente.descripcion,
        precio: this.datosTran.montoTran,
        Subtotal: this.datosTran.montoTran,
      }
      detalle.push(detalles);

      let jsonEmpesa = JSON.stringify(empresa);
      let jsonCliente = JSON.stringify(cliente);
      let jsonDetalle = JSON.stringify(detalle);

      let ventaTransaccion: any = {
        'empresa': jsonEmpesa,
        'cliente': jsonCliente,
        'detalle': jsonDetalle
      };

      const loader = this.loadingCtrl.create({ content: "" });

      if (tipo != 'mail') { loader.present(); }

      switch (tipo) {
        case 'wts':
          this._solicitud.sendSoliLink(ventaTransaccion).subscribe(() => {
            loader.dismiss();
            this.linkSolicitud = this._solicitud.linkSoli.url;

            this.descripSoli = `Hola ${this.clienteTran.nombre} ${this.clienteTran.apellido} tienes una solicitud de Pago de la empresa ${this._user.infoEmpresa.nombre} por el monto de ${this.datosTran.moneda} ${this.formatMontoSolip} y el consumo de ${dataSoli.descripcion}.\n\n`;

            this.openWhats(this.descripSoli, this.linkSolicitud);
            this.btnShared = false;
          }, error => {
            loader.dismiss();
            this.modalReject.present();
          });
        break;

        case 'sms':
          this._solicitud.sendSoliLink(ventaTransaccion).subscribe(() => {
            loader.dismiss();
            this.linkSolicitud = this._solicitud.linkSoli.url;

            this.descripSoli = `Hola ${this.clienteTran.nombre} ${this.clienteTran.apellido} tienes una solicitud de Pago de la empresa ${this._user.infoEmpresa.nombre} por el monto de ${this.datosTran.moneda} ${this.formatMontoSolip} y el consumo de ${dataSoli.descripcion}. \n\n ${this.linkSolicitud}`;

            this.openSms(this.descripSoli, this.clienteTran.telefono);
            this.btnShared = false;
          }, error => {
            loader.dismiss();
            this.modalReject.present();
          });
        break;

        case 'mssg':
          this._solicitud.sendSoliLink(ventaTransaccion).subscribe(() => {
            loader.dismiss();
            this.linkSolicitud = this._solicitud.linkSoli.url;

            this.descripSoli = `Hola ${this.clienteTran.nombre} ${this.clienteTran.apellido} tienes una solicitud de Pago de la empresa ${this._user.infoEmpresa.nombre} por el monto de ${this.datosTran.moneda} ${this.formatMontoSolip} y el consumo de ${dataSoli.descripcion}.\n\n`;
            console.log(this.descripSoli);

            this.openMessenger(this.descripSoli, this.linkSolicitud);
            this.btnShared = false;
          }, error => {
            loader.dismiss();
            this.modalReject.present();
          });
        break;

        case 'mail':
          this.cliente.email = this.clienteTran.email;
          this.btnShared = false;
          this.frmMail = true;
        break;

        case 'shrd':
          this._solicitud.sendSoliLink(ventaTransaccion).subscribe(() => {
            loader.dismiss();
            this.descripSoli = `Hola ${this.clienteTran.nombre} ${this.clienteTran.apellido} tienes una solicitud de Pago de la empresa ${this._user.infoEmpresa.nombre} por el monto de ${this.datosTran.moneda} ${this.formatMontoSolip} y el consumo de ${dataSoli.descripcion}.\n`;

            this.linkSolicitud = this._solicitud.linkSoli.url;
            console.log(this.descripSoli);


            this.openShared(this.descripSoli, this.linkSolicitud);
            this.btnShared = false;
          }, error => {
            loader.dismiss();
            this.modalReject.present();
          });
        break;

        default:
          break;
      }
    }
  }

  openWhats(descripcion:string, link:string) {
    this.socialSharing.shareViaWhatsApp(descripcion, null, link).then((resp) => {
      console.log("Se envio por Whatsapp", resp);
      this.modalAccept.present();
      this.irHome = true;
    }).catch(err => {
      console.log("Error Whatsapp: ", err);
      this.modalReject.present();
      this.erorTran = true;
    });
  }

  openSms(descripcion:string, telefono:string) {
    this.socialSharing.shareViaSMS(descripcion, telefono).then(() => {
      console.log("Se envio por SMS");
      this.modalAccept.present();
      this.irHome = true;
    }).catch(err => {
      console.log("Error SMS: ", err);
      this.modalReject.present();
      this.erorTran = true;
    })
  }

  openMessenger(descripcion:string, link:string) {
    // com.facebook.Messenger
    // com.apple.social.messenger
    if (this.platform.is('android')) {
      this.socialSharing.shareVia('com.facebook.orca', descripcion, null, null, link).then(() => {
        console.log('Se envio por Messinger');
        this.modalAccept.present();
        this.irHome = true;
      }).catch(err => {
        console.log('Error Messenger: ', err);
        this.modalReject.present();
        this.erorTran = true;
      })
    } else {
      console.log('Otra plaraforma');
    }
  }

  enviarMail() {
    if (this.datosTran.ventaProducto) {
      console.log('Productos');

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
        email: this.cliente.email,
        ipAddress: '192.168.10.1',
        Total: this.datosTran.montoTran,
        fecha_transaccion: {},
        currency: this.datosTran.moneda,
        deviceFingerprintID: ''
      };

      let detalle: any = [];
      let detalles: any = {};

      this.datosTran.productos.forEach((element: { id: any; cantidadProducto: number; nombre: any; precio: number; }) => {
        detalles = {};
        detalles.id_producto = element.id,
        detalles.cantidad = element.cantidadProducto,
        detalles.tipo = element.nombre,
        detalles.nombre = element.nombre,
        detalles.precio = element.precio,
        detalles.Subtotal = element.cantidadProducto * element.precio

        detalle.push(detalles);
      });

      let jsonEmpesa = JSON.stringify(empresa);
      let jsonCliente = JSON.stringify(cliente);
      let jsonDetalle = JSON.stringify(detalle);

      let ventaTransaccion: any = {
        'empresa': jsonEmpesa,
        'cliente': jsonCliente,
        'detalle': jsonDetalle
      };

      let loading = this.loadingCtrl.create({ content: "" });
      loading.present();
      this._solicitud.sendSoliMail(ventaTransaccion).subscribe(() => {
        loading.dismiss();
        this.frmMail = false;
        this.modalAccept.present();
        this.irHome = true;
      }, error => {
        loading.dismiss();
        this.modalReject.present();
        this.frmMail = false;
        this.erorTran = true;
      });

    } else {
      console.log('soli normal');

      let empresa: any = {
        key_secret: this.keysEmpresa.key_secret,
        key_public: this.keysEmpresa.key_public,
        idenEmpresa: this.keysEmpresa.idenEmpresa
      }

      let cliente = {
        codigo:'',
        firstName: this.clienteTran.nombre,
        lastName: this.clienteTran.apellido,
        street1: this.clienteTran.direccion,
        phone: this.clienteTran.telefono,
        country: this.clienteTran.pais,
        city: this.clienteTran.ciudad,
        state: this.clienteTran.state,
        postalCode: this.clienteTran.postalcode,
        email: this.cliente.email,
        ipAddress: '192.168.10.1',
        Total: this.datosTran.montoTran,
        fecha_transaccion: {},
        currency: this.datosTran.moneda,
        deviceFingerprintID: ''
      };

      let detalle: any = [];
      let detalles = {
        id_producto: '01',
        cantidad: '1',
        tipo: 'Solicitud Pago App',
        nombre: this.cliente.descripcion,
        precio: this.datosTran.montoTran,
        Subtotal: this.datosTran.montoTran,
      }
      detalle.push(detalles);

      let jsonEmpesa = JSON.stringify(empresa);
      let jsonCliente = JSON.stringify(cliente);
      let jsonDetalle = JSON.stringify(detalle);

      let ventaTransaccion: any = {
        'empresa': jsonEmpesa,
        'cliente': jsonCliente,
        'detalle': jsonDetalle
      };

      let loading = this.loadingCtrl.create({ content: "" });
      loading.present();
      this._solicitud.sendSoliMail(ventaTransaccion).subscribe(() => {
        loading.dismiss();
        this.frmMail = false;
        this.modalAccept.present();
        this.irHome = true;
      }, error => {
        loading.dismiss();
        this.modalReject.present();
        this.frmMail = false;
        this.erorTran = true;
      });
    }
  }

  openShared(descripcion:string, link:string) {
    this.socialSharing.share(descripcion, null, null, link).then(() => {
      console.log("Se compartio por link");
      this.modalAccept.present();
      this.irHome = true;
    }).catch(err => {
      console.log("Error el enviar por link", err);
      this.modalReject.present();
      this.erorTran = true;
    })
  }

  irSquare() {
    this.navCtrl.setRoot(DashboardPage);
  }

  validateLlave() {
    if (this._user.infoEmpresa.tipoLlave === 'PG') {
      this.showDireccion = false;
      // console.log('Llave Paymet: ', 'Necesita dirección: ', this.showDireccion);
    } else if (this._user.infoEmpresa.tipoLlave === 'CY') {
      this.showDireccion = true;
      // console.log('Llave Cyber: ', 'Necesita dirección: ', this.showDireccion);
    } else {
      console.log('no tiene llave');
    }
  }

  logout() {
    this._auth.logout();
    this.navCtrl.setRoot(HomePage);
  }

}
