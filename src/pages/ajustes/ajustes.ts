import { Component } from '@angular/core';
import { MenuController } from 'ionic-angular';

@Component({
  selector: 'page-ajustes',
  templateUrl: 'ajustes.html',
})
export class AjustesPage {

  constructor(public menuCtrl:MenuController) {
  }

  mostrarMenu() {
    this.menuCtrl.toggle();
  }

}
