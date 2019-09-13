import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'page-tran-reject',
  templateUrl: 'tran-reject.html',
})
export class TranRejectPage {

  constructor(public viewCtrl:ViewController) {
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
