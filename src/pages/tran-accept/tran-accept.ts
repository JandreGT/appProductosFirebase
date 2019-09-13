import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'page-tran-accept',
  templateUrl: 'tran-accept.html',
})
export class TranAcceptPage {

  constructor(public viewCtrl:ViewController) {
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }
}
