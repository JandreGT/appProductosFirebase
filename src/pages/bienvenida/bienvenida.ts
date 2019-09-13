import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'page-bienvenida',
  templateUrl: 'bienvenida.html',
})
export class BienvenidaPage {
  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, public _auth:AuthProvider) {
  }

  slideFinal() {
    this.slides.stopAutoplay();
  }

  irLogin() {
    this.navCtrl.setRoot(HomePage);
    this._auth.irLoginUser(1);
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.slides.autoplay = 2500;
      this.slides.startAutoplay();
    }, 1000);
  }

}
