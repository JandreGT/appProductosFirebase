import { Component } from '@angular/core';
import { NavController, ViewController, App } from 'ionic-angular';
import { ProductosProvider } from '../../../providers/index.services';
import { TipoPagoPage } from '../../tipo-pago/tipo-pago';

@Component({
  selector: 'page-carrito',
  templateUrl: 'carrito.html',
})
export class CarritoPage {

  constructor(public navCtrl: NavController, public _ps:ProductosProvider,
              public viewCtrl:ViewController, public appCtrl:App) {
  }

  agregarProducto(producto: any) {
    if (producto.ac_stock === 1 && producto.cantidadProducto < producto.stock) {
      this._ps.agregarCarrito(producto);
    } else if (producto.ac_stock === 0) {
      this._ps.agregarCarrito(producto);
    } else {
    }
  }

  eliminarProducto(producto: any) {
    if (producto.cantidadProducto > 1) {
      producto.cantidadProducto--;
      this._ps.totalCarrito();
    } else {
      if (producto.cantidadProducto === 1) {
        producto.cantidadProducto--;
        this._ps.eliminarPoductoItem(producto);
      } else {
        console.log('eliminado');
      }
    }
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  enviarProductos(productos:any, totalCarrito:any) {

    let datoTran = {
      montoTran: totalCarrito,
      productos: productos
    }
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNavs()[0].push(TipoPagoPage, {'datosTran': datoTran})
    this._ps.varciarCarrito();
  }


}
