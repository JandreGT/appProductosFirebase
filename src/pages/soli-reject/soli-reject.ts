import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'page-soli-reject',
  templateUrl: 'soli-reject.html',
})
export class SoliRejectPage {

  constructor(public viewCtrl: ViewController) {
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
