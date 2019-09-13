import { Component } from '@angular/core';
import { NavParams, ToastController, ViewController } from 'ionic-angular';
import { ProductosProvider } from '../../../providers/index.services';

@Component({
  selector: 'page-modal-producto',
  templateUrl: 'modal-producto.html',
})
export class ModalProductoPage {

  existeProducto:any;

  constructor(public navParams: NavParams, public _ps:ProductosProvider, public toastCtrl:ToastController,
              public viewCtrl:ViewController) {
    this.existeProducto = this.navParams.get("existeProducto");
  }

  agregarProducto(producto: any) {
    producto.showAgregar = false;
    producto.showButtonsAdd = true;

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

  eliminarProducto(producto: any) {
    if (producto.cantidadProducto > 1) {
      producto.cantidadProducto--;
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

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
