import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, MenuController, Platform } from 'ionic-angular';

// Plugins
import { DataUserProvider, PosProvider, AuthProvider } from '../../providers/index.services';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { File } from '@ionic-native/file';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { ScreenOrientation } from '@ionic-native/screen-orientation';


@Component({
  selector: 'page-conexion-square',
  templateUrl: 'conexion-square.html',
})
export class ConexionSquarePage {

  finVenta:boolean = false;
  modelCard: boolean = false;
  acepTarjeta:boolean = false;

  keysEmpresa: any = {};
  datosTran:any = {};

  cardPos = {
    nameCard: <any>'',
    accountNumber: <any>'',
    expirationMonth: <any>'',
    expirationYear: <any>'',
    track2Data: <any>''
  }

  //Plugins
  unpairedDevices: any;
  pairedDevices: any;
  gettingDevices: Boolean;

  @ViewChild(SignaturePad) public signaturePad: SignaturePad;
  firmaImage: String;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl:AlertController,
              public _user:DataUserProvider, public _pos:PosProvider, public loadingCtrl: LoadingController,
              public menuCtrl:MenuController, public bluetoothSerial:BluetoothSerial, public _auth:AuthProvider,
              private fileCtrl: File, public platform:Platform, public screenOrientation:ScreenOrientation) {

    // bluetoothSerial.enable();
    this.datosTran = this.navParams.get("datosTran");
    this.getDataUser();
    this.startScanning();
  }

  getDataUser() {
    this._user.getUser().subscribe(resp => {
      this.keysEmpresa = this._user.apikeyEmpresa
      // console.log('LLaves Empresa: ', this.keysEmpresa);

    }, error => {
      this.alertCtrl.create({
        title: 'Tu sesión ha expirado',
        subTitle: error.mensaje,
        buttons: ['OK']
      }).present()
    });
  }

  mostrarMenu() {
    this.menuCtrl.toggle();
  }

  //TODO: Renderezar función
  startScanning() {
    this.finVenta = true;

    this.pairedDevices = null;
    this.unpairedDevices = null;
    this.gettingDevices = true;
    this.bluetoothSerial.discoverUnpaired().then((success) => {
      this.unpairedDevices = success;
      this.gettingDevices = false;
    },(err) => {
      console.log(err);
    });

    this.bluetoothSerial.list().then((success) => {
      console.log("Star Scann list");
      this.pairedDevices = success;
    },(err) => {
      // console.log(err);
    });
  }
  success = (data) => alert(data);
  fail = (error) => alert(error);

  //TODO: Borrar Funcion
  selectDevice(address: any) {
    let alert = this.alertCtrl.create({
      title: 'Connect',
      message: 'Do you want to connect with?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Connect',
          handler: () => {
            this.bluetoothSerial.connect(address).subscribe(this.success, this.fail);
          }
        }
      ]
    });
    alert.present();
  }
  // TODO:  Borrar funcion
  disconnect() {
    let alert = this.alertCtrl.create({
      title: 'Disconnect?',
      message: 'Do you want to Disconnect?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Disconnect',
          handler: () => {
            this.bluetoothSerial.disconnect();
          }
        }
      ]
    });
    alert.present();
  }

  public signaturePadOptions: Object = {
    'minWidth': 0.5,
    'maxWidth': 2,
    'canvasWidth': 600,
    'canvasHeight': 230,
  };

  showCardPos() {
    this.finVenta = false;
    this.modelCard = true;
    this.cardPos.nameCard = 'Consumidor Final';

    if (this.platform.is("cordova")) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    }

    this.fileCtrl.checkDir(this.fileCtrl.dataDirectory, 'files/').then(dic => {
      console.error('Existe files');

      this.fileCtrl.readAsText(this.fileCtrl.dataDirectory, 'PAN').then((numberCard: any) => {
        console.error('Leendo PAN: ' + numberCard);
        this.cardPos.accountNumber = numberCard;

      }).catch((err: any) => {
        console.error('no pudo leer pan: ' + err);
      });

      this.fileCtrl.readAsText(this.fileCtrl.dataDirectory, 'ExpireDate').then((expire: any) => {
        console.error('Leendo ExpireDate: ' + expire);

        let expiredate = expire;
        let yearth = expiredate.substr(0, 2)
        let month = expiredate.substr(2)

        this.cardPos.expirationMonth = month;
        this.cardPos.expirationYear = yearth;

      }).catch((err: any) => {
        console.error('no pudo leer fecha: ' + err);
      });

      this.fileCtrl.readAsText(this.fileCtrl.dataDirectory, 'Track2').then((track: any) => {
        console.error('Leendo Track2: ' + track);
        this.cardPos.track2Data = track
      }).catch((err: any) => {
        console.error('no pudo leer track: ' + err);
      });

    }).catch(err => {
      console.log('No existe el directorio' + err);
      let error = JSON.stringify(err)
      this.alertCtrl.create({
        title: 'No existe el directorio',
        subTitle: 'fallo ' + error,
        buttons: ['OK']
      }).present();
    });
  }

  clearFirma() {
    this.signaturePad.clear();
  }

  enviarVentaPos() {
    let empresa: any = {
      key_secret: this.keysEmpresa.key_secret,
      key_public: this.keysEmpresa.key_public,
      idenEmpresa: this.keysEmpresa.idenEmpresa
    }

    let cliente: any = {
      firstName: this.datosTran.nombre,
      lastName: this.datosTran.nombre,
      street1: this.datosTran.direccion,
      phone: this.datosTran.telefono,
      country: 'Guatemala',
      city: 'Guatemala',
      state: 'Guatemala',
      postalCode: '01001',
      email: this.datosTran.email,
      ipAddress: '192.168.10.1',
      Total: this.datosTran.monto,
      fecha_transaccion: {
        date: '2018-07-24 17:24:50.703559',
        timezone_type: 3,
        timezone: 'America Guatemala',
      },
      currency: this.datosTran.moneda,
      deviceFingerprintID: '',
    }

    let detalle: any = [];
    let detalles = {
      id_producto: '01',
      cantidad: '1',
      tipo: 'Square Pagalo',
      nombre: this.datosTran.descripcion,
      precio: this.datosTran.monto,
      Subtotal: this.datosTran.monto,
    }
    detalle.push(detalles);

    let tarjetaPagalo: any = {
      nameCard: this.cardPos.nameCard,
      accountNumber: this.cardPos.accountNumber,
      expirationMonth: this.cardPos.expirationMonth,
      expirationYear: this.cardPos.expirationYear,
      track2Data: this.cardPos.track2Data
    }

    let jsonEmpesa = JSON.stringify(empresa);
    let jsonCliente = JSON.stringify(cliente);
    let jsonDetalle = JSON.stringify(detalle);
    let jsonTarjeta = JSON.stringify(tarjetaPagalo);

    let ventaTransaccionPos: any = {
      'empresa': jsonEmpesa,
      'cliente': jsonCliente,
      'detalle': jsonDetalle,
      'tarjetaPagalo': jsonTarjeta
    };

    const loader = this.loadingCtrl.create({
      content: ""
    });

    loader.present();
    this.modelCard = false;
    if (this.platform.is("cordova")) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
    // console.log('Json venta transaccion' + JSON.stringify(ventaTransaccionPos));

    this._pos.sendSalePos(JSON.stringify(ventaTransaccionPos)).subscribe(() => {
      loader.dismiss();
    });
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.acepTarjeta = true;
    }, 2000);
  }

  ionViewWillLeave() {
    if (this.platform.is("cordova")) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
  }
}
