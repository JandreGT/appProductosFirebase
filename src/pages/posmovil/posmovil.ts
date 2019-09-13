import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ModalController, Platform } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { DataUserProvider, PosProvider, AuthProvider, BuscarClienteProvider } from '../../providers/index.services';
import { HomePage } from '../home/home';
import { DashboardPage } from '../dashboard/dashboard';

// Plugins
import moment from 'moment';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { CardIO, CardIOOptions, CardIOResponse } from '@ionic-native/card-io';

//helpers
import PAISES from '../../helpers/paises.export';
import ESTADOSCA from '../../helpers/estadosCA.export';
import ESTADOSUS from '../../helpers/estadosUS.export';

@Component({
  selector: 'page-posmovil',
  templateUrl: 'posmovil.html',
})
export class PosmovilPage {

  keysEmpresa: any = {};
  datosTran: any = {};
  firma:boolean = false;
  frmTarjeta:boolean = true;
  irHome:boolean = false;
  erorTran:boolean = false;
  showDireccion:boolean = false;

  buscarCliente:boolean = true;
  datosVenta:boolean = false;
  encontradoCliente:boolean = false;
  crearClientev:boolean = false;

  busCliente:any = {};
  clientes:any[] = [];
  clienteTran:any = {};

  crearCliente:any = {};
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

  card = {
    descripcion: <any>'',
    nameCard: <any>'',
    accountNumber: <any>'',
    expirationMonth: <any>'',
    expirationYear: <any>'',
    Cvv: <any>''
  }

  @ViewChild(SignaturePad) public signaturePad: SignaturePad;
  firmaImage: string;

  options: CardIOOptions = {
    requireExpiry: true,
    requireCVV: true,
    hideCardIOLogo: true,
  };

  iscanCard:boolean = false;
  digitos: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl:AlertController,
              public _user:DataUserProvider, public _pos:PosProvider,
              public loadingCtrl: LoadingController, public _auth: AuthProvider, public modalCtrl: ModalController,
              public platform:Platform, public screenOrientation:ScreenOrientation, private cardIO: CardIO,
              public _cs:BuscarClienteProvider) {

    this.datosTran = this.navParams.get("datosTran");
    this.iscanCard = this.datosTran.scanCard

    this.getDataUser();
    this.validateLlave();
    this.card.expirationMonth = moment().format();
    this.card.expirationYear = moment().format('YYYY');
    this.crearCliente.pais = 'GT';

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

  public signaturePadOptions: Object = {
    'minWidth': 0.5,
    'maxWidth': 2,
    'canvasWidth': 600,
    'canvasHeight': 230,
  };

  searchCliente(dataCliente:NgForm){
    let nombreCliente = dataCliente.value;

    const loader = this.loadingCtrl.create({ content: "" }); loader.present();
    this._cs.getClientes(nombreCliente.nombre).subscribe( () => {
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
          {text: 'Cancelar'},
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
    let clienteNuevo: any = {'cliente': clienteJson};

    const loader = this.loadingCtrl.create({ content: "" }); loader.present();
    this._cs.crearCliente(clienteNuevo).subscribe( () => {
      loader.dismiss();
      this.crearClientev = false;
      this.buscarCliente = false;
      this.encontradoCliente = false;
      this.clienteTran = this._cs.clienteResp;
      this.card.nameCard = `${this.clienteTran.nombre} ${this.clienteTran.apellido}`;
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

  asignarCliente(cliente:any) {
    this.buscarCliente = false;
    this.encontradoCliente = false;
    this.clienteTran = cliente;

    this.card.nameCard = `${this.clienteTran.nombre} ${this.clienteTran.apellido}`;
    this.datosVenta = true;
  }

  mostrarFirma() {
    if (this.datosTran.ventaProducto) {
      if (this.card.nameCard != '' && this.card.accountNumber != '' && this.card.expirationMonth != '' && this.card.expirationYear != ''
          && this.card.Cvv != '') {

        this.frmTarjeta = false;
        this.firma = true;
        if (this.platform.is("cordova")) {
          this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
        }
      } else {
        const alert = this.alertCtrl.create({
          title: 'Error en Tarjeta',
          subTitle: 'Por favor llena todos los campo de forma correcta',
          buttons: ['OK']
        });
        alert.present();
      }
    } else {
      if (this.card.descripcion != '' && this.card.nameCard != '' && this.card.accountNumber != '' && this.card.expirationMonth != ''
          && this.card.expirationYear != '' && this.card.Cvv != '') {

        this.frmTarjeta = false;
        this.firma = true;
        if (this.platform.is("cordova")) {
          this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
        }
      } else {
        const alert = this.alertCtrl.create({
          title: 'Error en Tarjeta',
          subTitle: 'Por favor llena todos los campo de forma correcta',
          buttons: ['OK']
        });
        alert.present();
      }
    }
  }

  clearFirma() {
    this.signaturePad.clear();
  }

  nextScanCard() {
    if (this.datosTran.ventaProducto) {
      if (this.card.nameCard != '') {
        this.card.nameCard = `${this.clienteTran.nombre} ${this.clienteTran.apellido}`
        this.scanCard();
      } else {
        this.showAlert('Error', `Nombre de la tarjeta requerido.`);
      }
    } else {
      if (this.card.descripcion != '') {
        this.card.nameCard = `${this.clienteTran.nombre} ${this.clienteTran.apellido}`;
        this.scanCard();
      } else {
        this.showAlert('Error', `Descripción de la venta requerida.`);
      }
    }
  }

  scanCard() {
    this.cardIO.canScan().then((res: boolean) => {
      if (res) {
        this.cardIO.scan(this.options).then((resp: CardIOResponse) => {
          this.iscanCard = true;
          this.digitos = resp.redactedCardNumber;
          this.card.accountNumber = resp.cardNumber;
          this.card.expirationMonth = resp.expiryMonth;
          this.card.expirationYear = resp.expiryYear;
          this.card.Cvv = resp.cvv;

          if (this.card.expirationMonth < 10) {
            this.card.expirationMonth = `0${resp.expiryMonth}`;
          } else {
            this.card.expirationMonth = resp.expiryMonth;
          }

          this.showAlertFunction('Usar la tarjeta con la terminación', `${this.digitos}`);

          // console.log('4 digitos: ', this.digitos);
          // console.log('Nombre Card: ', this.card.nameCard);
          // console.log('Numero Card: ', this.card.accountNumber);
          // console.log('Mes Expira: ', this.card.expirationMonth);
          // console.log('Año Expira: ', this.card.expirationYear);
          // console.log('Cvv Card: ', this.card.Cvv);

        }).catch((error: any) => {
          console.log('Fallo o cancelo: ', JSON.stringify(error));
        })
      }
    }).catch((error: any) => {
      console.log('no es compatible: ', JSON.stringify(error));
    })
  }

  enviarVentas(data: NgForm) {
    if (this.datosTran.ventaProducto) {
      if (this.card.nameCard != '' && this.card.accountNumber != '' && this.card.expirationMonth != ''
          && this.card.expirationYear != '' && this.card.Cvv != '') {

        console.log('venta de Productos');
        let datos: any;
        if (!this.iscanCard) {datos = data.value;}

        if (this.platform.is("cordova")) {
          this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
        }

        this.firma = false;
        let empresa: any = {
          key_secret: this.keysEmpresa.key_secret,
          key_public: this.keysEmpresa.key_public,
          idenEmpresa: this.keysEmpresa.idenEmpresa
        }

        let cliente = {
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
        let detalles:any = {};

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

        this.firmaImage = this.signaturePad.toDataURL();
        let tarjetaPagalo: any = {};

        if (this.iscanCard) {
          console.log('Escaneo Tarjeta');
          tarjetaPagalo.nameCard = this.card.nameCard;
          tarjetaPagalo.accountNumber = this.card.accountNumber;
          tarjetaPagalo.expirationMonth = this.card.expirationMonth;
          tarjetaPagalo.expirationYear = this.card.expirationYear;
          tarjetaPagalo.CVVCard = this.card.Cvv;
          tarjetaPagalo.firma = this.firmaImage;
        } else {
          let accountNumber = datos.accountNumber.split('-').join('');
          let expirationMonth = moment(datos.expirationMonth).format('MM');
          console.log('Ingreso Tarjeta');
          tarjetaPagalo.nameCard = datos.nameCard;
          tarjetaPagalo.accountNumber = accountNumber;
          tarjetaPagalo.expirationMonth = expirationMonth;
          tarjetaPagalo.expirationYear = datos.expirationYear;
          tarjetaPagalo.CVVCard = datos.Cvv;
          tarjetaPagalo.firma = this.firmaImage;
        }
        // console.log('Card: ', JSON.stringify(tarjetaPagalo));
        let jsonEmpesa = JSON.stringify(empresa);
        let jsonCliente = JSON.stringify(cliente);
        let jsonDetalle = JSON.stringify(detalle);
        let jsonTarjeta = JSON.stringify(tarjetaPagalo);

        let ventaTransaccion: any = {
          'empresa': jsonEmpesa,
          'cliente': jsonCliente,
          'detalle': jsonDetalle,
          'tarjetaPagalo': jsonTarjeta
        };

        const loader = this.loadingCtrl.create({ content: "" });loader.present();
        this._pos.sendSale(JSON.stringify(ventaTransaccion)).subscribe(() => {
          loader.dismiss();
          this.irHome = this._pos.tranAccept;
          this.erorTran = this._pos.tranReject;
        });
      } else {
        console.log("Campos invalidos");
        const alert = this.alertCtrl.create({
          title: 'Error en Tarjeta',
          subTitle: 'Por favor llena todos los campo de forma correcta',
          buttons: ['OK']
        });
        alert.present();
      }
    } else {
      console.log('venta Monto');

      if (this.card.descripcion != '' && this.card.nameCard != '' && this.card.accountNumber != '' && this.card.expirationMonth != ''
          && this.card.expirationYear != '' && this.card.Cvv != '') {

        let datos:any;
        if (!this.iscanCard) {datos = data.value;}

        if (this.platform.is("cordova")) {
          this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
        }

        this.firma = false;

        let empresa: any = {
          key_secret: this.keysEmpresa.key_secret,
          key_public: this.keysEmpresa.key_public,
          idenEmpresa: this.keysEmpresa.idenEmpresa
        }

        let cliente = {
          firstName: this.clienteTran.nombre,
          lastName: this.clienteTran.apellido,
          street1: this.clienteTran.direccion,
          phone: this.clienteTran.telefono,
          country: this.clienteTran.pais,
          city: this.clienteTran.ciudad,
          state: this.clienteTran.state,
          postalCode: this.clienteTran.postalcode,
          email: this.clienteTran.email,
          ipAddress : '192.168.10.1',
          Total : this.datosTran.montoTran,
          fecha_transaccion : {},
          currency : this.datosTran.moneda,
          deviceFingerprintID : ''
        };

        let detalle: any = [];
        let detalles = {
          id_producto: '01',
          cantidad: '1',
          tipo: 'Pos Movil App',
          nombre: this.card.descripcion,
          precio: this.datosTran.montoTran,
          Subtotal: this.datosTran.montoTran,
        }
        detalle.push(detalles);

        this.firmaImage = this.signaturePad.toDataURL();
        let tarjetaPagalo: any = {};

        if (this.iscanCard) {
          console.log('Escaneo Tarjeta');
          tarjetaPagalo.nameCard = this.card.nameCard;
          tarjetaPagalo.accountNumber = this.card.accountNumber;
          tarjetaPagalo.expirationMonth = this.card.expirationMonth;
          tarjetaPagalo.expirationYear = this.card.expirationYear;
          tarjetaPagalo.CVVCard = this.card.Cvv;
          tarjetaPagalo.firma = this.firmaImage;
        } else {
          let accountNumber = datos.accountNumber.split('-').join('');
          let expirationMonth = moment(datos.expirationMonth).format('MM');
          console.log('Ingreso Tarjeta');
          tarjetaPagalo.nameCard = datos.nameCard;
          tarjetaPagalo.accountNumber = accountNumber;
          tarjetaPagalo.expirationMonth = expirationMonth;
          tarjetaPagalo.expirationYear = datos.expirationYear;
          tarjetaPagalo.CVVCard = datos.Cvv;
          tarjetaPagalo.firma = this.firmaImage;
        }

        // console.log('Card: ', JSON.stringify(tarjetaPagalo));

        let jsonEmpesa = JSON.stringify(empresa);
        let jsonCliente = JSON.stringify(cliente);
        let jsonDetalle = JSON.stringify(detalle);
        let jsonTarjeta = JSON.stringify(tarjetaPagalo);

        let ventaTransaccion: any = {
          'empresa': jsonEmpesa,
          'cliente': jsonCliente,
          'detalle': jsonDetalle,
          'tarjetaPagalo': jsonTarjeta
        };

        const loader = this.loadingCtrl.create({content: ""});
        loader.present();

        this._pos.sendSale(JSON.stringify(ventaTransaccion)).subscribe(() => {
          loader.dismiss();
          this.irHome = this._pos.tranAccept;
          this.erorTran = this._pos.tranReject;
        });

      } else {
        console.log("Campos invalidos");
        const alert = this.alertCtrl.create({
          title: 'Error en Tarjeta',
          subTitle: 'Por favor llena todos los campo de forma correcta',
          buttons: ['OK']
        });
        alert.present();
      }
    }
  }

  irSquare() {
    this.navCtrl.setRoot(DashboardPage);
  }

  intentarTran() {
    this.frmTarjeta = true;
    this.erorTran = false;
    this.irHome = false;
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

  ionViewDidEnter() {
    this.signaturePad.clear();
    if (this.platform.is("cordova")) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
  }

  ionViewWillLeave() {
    this.signaturePad.clear();
    this.iscanCard = false;
    if (this.platform.is("cordova")) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
  }

  showAlertFunction(title: string, message: string) {
    this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            this.card.nameCard = '';
            this.card.accountNumber = '';
            this.card.expirationMonth = moment().format();
            this.card.expirationYear = moment().format('YYYY');
            this.card.Cvv = '';
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.iscanCard = true;
            this.mostrarFirma();
          }
        }
      ]
    }).present()
  }

  showAlert(title: string, message: string) {
    this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    }).present()
  }

  logout() {
    this._auth.logout();
    this.navCtrl.setRoot(HomePage);
  }
}
