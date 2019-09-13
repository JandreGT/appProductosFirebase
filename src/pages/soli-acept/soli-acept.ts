import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'page-soli-acept',
  templateUrl: 'soli-acept.html',
})
export class SoliAceptPage {

  constructor(public viewCtrl: ViewController) {
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
