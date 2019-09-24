import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,MenuController } from 'ionic-angular';
import { FirebaseServiceProvider } from '../../providers/index.services';

@IonicPage()
@Component({
  selector: 'page-list-product',
  templateUrl: 'list-product.html',
})
export class ListProductPage {

  misProductos:any =[]; 
  constructor(public navCtrl: NavController, public menuCtrl:MenuController, public navParams: NavParams, public FirebaseServiceProvider:FirebaseServiceProvider) {
    
    //listado de productos
    FirebaseServiceProvider.getProductos()
      .subscribe(fruits=>{
        this.misProductos = fruits;    
    });

    // console.log(this.misProductos);    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListProductPage');
  }

  mostrarMenu(){
    this.menuCtrl.toggle();
  }

}
