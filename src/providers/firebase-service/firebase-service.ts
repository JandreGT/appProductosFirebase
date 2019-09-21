import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs-compat';

/*
  Generated class for the FirebaseServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseServiceProvider {

   constructor(public afDB: AngularFireDatabase) {
      
   }

   public getProductos(){
      return this.afDB.list('/productos').valueChanges(); 
      //Esta función devolverá todos los datos que tengamos en el apartado productos, en nuestra base de datos
   }
   public saveProducto(fruit){
      let key = this.afDB.list('/productos').push(fruit).key;
      //Guardamos el prouducto y obetenemos el id que firebase pone al nudulo de nuestro producto.
      //Al guardarse sin id nuestro producto, ahora la actualizamos con el id que firebase nos devuelve.
      fruit.id = key;
      return this.afDB.database.ref('productos/'+fruit.id).set(fruit);
   }

   public updateFruit(fruit){
         //Actualizamos la fruta con el id que recibimos del objeto del parametro
         this.afDB.database.ref('productos/'+fruit.id).set(fruit);
   }
   public getProduct(id){
         return this.afDB.object('productos/'+id).valueChanges();
         //Devolvera la fruta con el id que le pasamos por parametro
   }
   public removeFruit(id){
         this.afDB.database.ref('productos/'+id).remove();
         //Borrará la fruta con el id que le pasamos por parametro
   }

}
