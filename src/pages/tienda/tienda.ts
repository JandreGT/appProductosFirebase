import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController, ModalController } from 'ionic-angular';
import { ProductosProvider } from '../../providers/index.services';
import { CarritoPage } from '../components/carrito/carrito';
import { ModalProductoPage } from '../components/modal-producto/modal-producto';

@Component({
  selector: 'page-tienda',
  templateUrl: 'tienda.html',
})
export class TiendaPage {

  showbutton:boolean = false;
  misProductos:any[] = [];
  buscarProducto:string = '';

  modalOptions:any = {
    showBackdrop: true,
    enableBackdropDismiss: true,
    cssClass: 'modal-pagalo'
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public _ps:ProductosProvider,
              public loadingCtrl: LoadingController, public alertCtrl: AlertController, public toastCtrl: ToastController,
              public modalCtrl:ModalController) {

    this.getCategorias();
    this.getProductos();
  }

  getCategorias() {
    this._ps.getCategorias().subscribe(() => {}, error => {
      this.alertCtrl.create({
        title: 'Error al cargar Categorías',
        subTitle: error.mensaje,
        buttons: ['OK']
      }).present()
    });
  }

  getProductosCategoria(categoria:any) {
    const loader = this.loadingCtrl.create({ content: "", });

    loader.present();
    this._ps.getProductosCategoria(categoria.id).subscribe(() => {
      loader.dismiss();
      this.misProductos = this._ps.productos;
    }, error => {
      loader.dismiss();
      this.alertCtrl.create({
        title: 'Error al cargar productos',
        subTitle: error.mensaje,
        buttons: ['OK']
      }).present()
    });
  }

  searchProductos(nombreProducto:any) {
    let val = nombreProducto.target.value
    this.buscarProducto = val;

    this._ps.getProductosNombre(this.buscarProducto).subscribe(() => {
      this.misProductos = this._ps.productos;
    }, error => {
      this.alertCtrl.create({
        title: 'Aviso',
        subTitle: error.mensaje,
        buttons: ['OK']
      }).present()
    });
  }

  cancelSearchProducto(ev:any) {
    this.getProductos();
  }

  getProductos() {
    const loader = this.loadingCtrl.create({content: "",});

    loader.present();
    this._ps.getProductos().subscribe( () => {
      loader.dismiss();
      this.misProductos = this._ps.productos;
    }, error => {
      loader.dismiss();
      this.alertCtrl.create({
        title: 'Error al cargar productos',
        subTitle: error.mensaje,
        buttons: ['OK']
      }).present()
    });
  }

  activeAgregarProducto(producto:any) {
    producto.showAgregar = false;
    producto.showButtonsAdd = true;
    this._ps.agregarCarrito(producto);
    this.presentToastSuccess(`Producto ${producto.nombre} agregado`);
  }

  agregarProducto(producto:any) {
    if (producto.ac_stock === 1 && producto.cantidadProducto < producto.stock) {
      this._ps.agregarCarrito(producto);
      this.presentToastSuccess(`Producto ${producto.nombre} agregado`);
    } else if (producto.ac_stock === 0) {
      this._ps.agregarCarrito(producto);
      this.presentToastSuccess(`Producto ${producto.nombre} agregado`);
    } else {
      this.presentToastInfo(`Ya no hay unidades disponibles de: ${producto.nombre}`);
    }
  }

  eliminarProducto(producto:any) {
    if (producto.cantidadProducto > 1) {
      producto.cantidadProducto --;
      this._ps.totalCarrito();
      this.presentToastInfo(`Carrito actualizado`);
    } else {
      if (producto.cantidadProducto === 1) {
        producto.cantidadProducto--;
        this._ps.eliminarPoductoItem(producto);
        this.presentToastDanger(`Producto ${producto.nombre} eliminado`);
      } else {
        this.presentToastInfo(`El producto: ${producto.nombre} no esta agregado`)
      }
    }
  }

  showDetalleProducto(producto:any) {
    const modalProducto = this.modalCtrl.create(ModalProductoPage, {existeProducto: producto} , this.modalOptions);
    modalProducto.present();
  }

  presentToastSuccess(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1000,
      position: 'bottom',
      cssClass: 'toast-success'
    });
    toast.present();
  }

  presentToastDanger(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1000,
      position: 'bottom',
      cssClass: 'toast-danger'
    });
    toast.present();
  }

  presentToastInfo(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1000,
      position: 'bottom',
      cssClass: 'toast-info'
    });
    toast.present();
  }

  showCarrito() {
    const modal = this.modalCtrl.create(CarritoPage,null,this.modalOptions);
    modal.present();
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.showbutton = true;
    }, 1000);
  }

  ionViewWillLeave() {
    this.showbutton = false;
    this._ps.varciarCarrito();
  }

}
