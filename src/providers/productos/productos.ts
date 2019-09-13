import { Http, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';

import { AppContant } from '../../app/app.constant';
import { EndPoint } from '../end-point';

import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { AuthProvider } from '../auth/auth';
import { DataUserProvider } from '../data-user/data-user';

@Injectable()
export class ProductosProvider {

  productos:any[] = [];
  categorias:any[] = [];
  carrito: any[] = [];
  productoRepetido:boolean = false;
  totalVenta:number = 0;

  httpOptions: any = {
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  };

  constructor(public http: Http, public auth:AuthProvider, public dataUser:DataUserProvider) {

  }

  getProductos(): Observable<any> {
    let data = new URLSearchParams();
    data.append("token", this.auth.token);

    let url = AppContant.api + EndPoint.getProductos + this.dataUser.apikeyEmpresa.idenEmpresa + `?${data}`;

    return this.http.get(url).map(resp => {
      let data_rep = resp.json();
      this.productos = data_rep.datos;

      this.productos.forEach(element => {
        element.showAgregar = true;
        element.showButtonsAdd = false;
        element.cantidadProducto = 0;
      });

    }).catch((error: any) => Observable.throw(
      error.json()
    ));
  }

  getCategorias(): Observable<any> {
    let data = new URLSearchParams();
    data.append("token", this.auth.token);

    let url = AppContant.api + EndPoint.getCategorias + this.dataUser.apikeyEmpresa.idenEmpresa + `?${data}`;

    return this.http.get(url).map(resp => {
      let data_rep = resp.json();
      this.categorias = data_rep.datos;
    }).catch((error: any) => Observable.throw(
      error.json()
    ));
  }

  getProductosCategoria(categoriaId:any): Observable<any> {
    let data = new URLSearchParams();
    data.append("token", this.auth.token);

    let url = AppContant.api + EndPoint.getProductosCategoria + this.dataUser.apikeyEmpresa.idenEmpresa +`/${categoriaId}`+ `?${data}`;

    return this.http.get(url).map(resp => {
      let data_rep = resp.json();
      this.productos = data_rep.datos;

      this.productos.forEach(element => {
        element.showAgregar = true;
        element.showButtonsAdd = false;
        element.cantidadProducto = 0;
      });
    }).catch((error: any) => Observable.throw(
      error.json()
    ));
  }

  getProductosNombre(nombreProducto: any): Observable<any> {
    let data = new URLSearchParams();
    data.append("token", this.auth.token);
    data.append("parametro", nombreProducto)

    let url = AppContant.api + EndPoint.getProductosNombre + this.dataUser.apikeyEmpresa.idenEmpresa + `?${data}`;

    return this.http.post(url, null ,this.httpOptions).map(resp => {
      let data_rep = resp.json();
      this.productos = data_rep.datos;

      this.productos.forEach(element => {
        element.showAgregar = true;
        element.showButtonsAdd = false;
        element.cantidadProducto = 0;
      });
    }).catch((error: any) => Observable.throw(
      error.json()
    ));
  }

  agregarCarrito(producto: any) {
    this.productoRepetido = false;

    this.carrito.forEach(element => {
      if (element.id === producto.id) {
        element.cantidadProducto++;
        this.productoRepetido = true;
      }
    });

    if (!this.productoRepetido) {
      producto.cantidadProducto++;
      this.carrito.push(producto)
    }

    this.totalCarrito();
  }

  eliminarPoductoItem(producto: any) {
    let idx = 0;
    for (var i = 0; i < this.carrito.length; i++) {
      var product = this.carrito[i];
      if (producto.id == product.id) {
        idx = i;
      }
    }
    this.carrito.splice(idx, 1)
    this.totalCarrito();
  }

  totalCarrito() {
    this.totalVenta = 0;
    for (var i = 0; i < this.carrito.length; i++) {
      var product = this.carrito[i];
      this.totalVenta += (product.precio * product.cantidadProducto);
    }
  }

  varciarCarrito() {
    this.carrito = [];
    this.productoRepetido = false;
    this.totalVenta = 0;
  }

}
