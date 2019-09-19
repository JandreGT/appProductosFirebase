import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { HomePage, DashboardPage, SolicitupagoPage, TiendaPage, BienvenidaPage, PersonaPage,TabsAjustesPage } from '../pages/index.page';
import { AuthProvider } from '../providers/auth/auth';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
   templateUrl: 'app.html'
})
export class MyApp {
@ViewChild(Nav) nav: Nav;

welcome = BienvenidaPage;
person = PersonaPage;

login = HomePage;
dashboard = SolicitupagoPage;

rootPage: any;

pages: Array<{ title: string, component: any }>;

constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
            public storage: Storage, public menuCtrl: MenuController, public screenOrientation: ScreenOrientation,
            private iab: InAppBrowser) {

   this.initializeApp();
   statusBar.styleLightContent();
   
   this.pages = [
      { title: 'Inicio', component: DashboardPage }, 
   ];
}

   initializeApp() {

      // this.rootPage = this.dashboard; return;

      this.platform.ready().then(() => {

         this.storage.ready().then(() => {

            this.splashScreen.hide(); 

            this.storage.get("stateApp").then(stateApp => {
      
               this.storage.get("token").then(token => {
                  if(token != undefined){
                     // console.log('Estado empresa = 1, bienvenida = 1 y token definido');
                     this.rootPage = this.dashboard;
                  }else{
                     // console.log('Estado empresa = 1 bienvenida = 1 y token indefinido');
                     this.rootPage = this.login;
                  }
               });                   

            });
            
         });

         if (this.platform.is("cordova")) {
            this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
         }
      });
   }

   openPage(page:any) {
      this.nav.setRoot(page.component);
      this.menuCtrl.close();  
   }

   irNuevoProducto() {
      this.nav.push(SolicitupagoPage);
      this.menuCtrl.close();
   }

   irProductos() {
      this.nav.push(TiendaPage);
      this.menuCtrl.close();
   }

   irAjustes() {
      this.nav.setRoot(TabsAjustesPage);
      this.menuCtrl.close();
   }

   irPagalo() {
      console.log('pagalo');
      this.iab.create('https://app.pagalocard.com/', '_system', 'location=yes');
   }

   reset() {
      this.menuCtrl.close(); 
   }

   logout(){
      this.nav.setRoot(HomePage);
   }
}

