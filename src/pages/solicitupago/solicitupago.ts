import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, LoadingController, ModalController,MenuController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DataUserProvider, AuthProvider, SolicitudPagoProvider, BuscarClienteProvider,FirebaseServiceProvider } from '../../providers/index.services';
import { HomePage } from '../home/home';
import { SoliAceptPage } from '../soli-acept/soli-acept';
import { SoliRejectPage } from '../soli-reject/soli-reject';
import { DashboardPage } from '../dashboard/dashboard';


//Providers 


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
  crearClientev: boolean = true;
 
  clienteTran:any = {};

  crearProducto: any = {}; 

   formatMontoSolip:any;
   showDireccion:boolean = false;

   productos = [];

   constructor(public navCtrl: NavController,        public navParams: NavParams, 
               public socialSharing: SocialSharing,  public _user:DataUserProvider, 
               public alertCtrl:AlertController,     public _auth:AuthProvider, 
               public platform: Platform,            public _solicitud:SolicitudPagoProvider,
               public loadingCtrl:LoadingController, public modalCtrl:ModalController, 
               public _cs:BuscarClienteProvider,     public menuCtrl:MenuController,
               public FirebaseServiceProvider:FirebaseServiceProvider){

      FirebaseServiceProvider.getProductos()
         .subscribe(fruits=>{
         this.productos = fruits;
         console.log(this.productos);
         
      });
   }

   mostrarMenu(){
    this.menuCtrl.toggle();
   }

   productoCreate(producto: NgForm) {

      const loading = this.loadingCtrl.create({
         content:  'Almacenando producto. Por favor, espere...',
      });
      loading.present();

      let dataProduct = producto.value;    
      this.FirebaseServiceProvider.saveProducto(dataProduct);

      this.alertCtrl.create({
         title: 'Excelente',
         subTitle: 'Se ha creado un nuevo producto',
         buttons: ['OK']
      }).present()
      
      this.crearProducto = [];
      loading.dismiss();
   }

   enviarSoli() {
      this.frmShared = false;
      this.btnShared = true;
   }

  modalAccept = this.modalCtrl.create(SoliAceptPage);
  modalReject = this.modalCtrl.create(SoliRejectPage);

   sharedSoli(data: NgForm, tipo:any) {
      let dataSoli = data.value;

      if (true) {
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
         Total: 100,
         fecha_transaccion: {},
         currency: 'GTQ',
         deviceFingerprintID: ''
         };

         let detalle: any = [];
         let detalles: any = {};

         detalles = {};
         detalles.id_producto = 1,
         detalles.cantidad = 1,
         detalles.tipo = 'Test',
         detalles.nombre = 'test',
         detalles.precio = 100,
         detalles.Subtotal = 100

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

      if (tipo != 'mail') { loader.present(); 

         switch (tipo) {
         case 'wts':
            this._solicitud.sendSoliLink(ventaTransaccion).subscribe(() => {
               loader.dismiss();
               this.linkSolicitud = this._solicitud.linkSoli.url;

               this.descripSoli = 'hola';

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

               this.descripSoli = `Hola`;

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

               this.descripSoli = 'hola';

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
               this.descripSoli = 'hola'; 

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
         Total: 100,
         fecha_transaccion: {},
         currency: 'GTQ',
         deviceFingerprintID: ''
         };

         let detalle: any = [];
         let detalles = {
         id_producto: '01',
         cantidad: '1',
         tipo: 'Solicitud Pago App',
         nombre: this.cliente.descripcion,
         precio: 100,
         Subtotal: 100,
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

                     this.descripSoli = 'hola';

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

                     this.descripSoli = '';
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

                     this.descripSoli = '';
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
                     this.descripSoli = '';
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





      // irSquare() {
      //    this.navCtrl.setRoot(DashboardPage);
      // }


      // logout() {
      //    this.navCtrl.setRoot(HomePage);
      // }

   }

}
