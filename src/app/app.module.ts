import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';

//Pages
import { 
   HomePage, 
   DashboardPage,
   SquerePage,
   ConexionSquarePage,
   TranAcceptPage,
   productoPage, 
   SoliRejectPage,
   PagoQrPage,
   ModalProductoPage, 
   CarritoPage, 
   TipoPagoPage, 
   RegistroAppPage,
   ListProductPage
} from '../pages/index.page'

//Components
import { 
   DetalleTransaccionComponent,
   ModalImageComponent 
} from '../components/index.components';

//Plugins
import { BrMaskerModule } from 'brmasker-ionic-3';
import { IonicStorageModule } from '@ionic/storage';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { File } from '@ionic-native/file';
import { ScreenOrientation} from "@ionic-native/screen-orientation";
import { SocialSharing } from '@ionic-native/social-sharing';
import { SignaturePadModule } from 'angular2-signaturepad';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera } from '@ionic-native/camera';
import { CardIO } from '@ionic-native/card-io';

import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import * as firebase from "firebase";
import { 
   AngularFireDatabaseModule, 
   AngularFireDatabase 
} from '@angular/fire/database'; 

//Providers
import { 
   ProductosProvider, 
   AuthProvider,
   FirebaseServiceProvider
} from '../providers/index.services';
  
import { environment } from '../environments/environment';

firebase.initializeApp(environment.firebase)

@NgModule({

   declarations: [
      MyApp, 
      HomePage,
      SquerePage,
      DashboardPage,
      ConexionSquarePage,
      TranAcceptPage,
      productoPage, 
      SoliRejectPage,
      PagoQrPage, 
      ModalProductoPage,
      CarritoPage,
      TipoPagoPage, 
      RegistroAppPage, 
      ListProductPage,
      //components
      DetalleTransaccionComponent,
      ModalImageComponent
   ],
   imports: [
      BrowserModule,
      FormsModule,
      HttpClientModule,
      HttpModule,
      BrMaskerModule,
      SignaturePadModule,
      IonicModule.forRoot(MyApp, {
         monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
         monthShortNames: ['En', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
         dayNames: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
         backButtonText: 'Atras',
         scrollAssist: false,
         autoFocusAssist: false
      }),
      IonicStorageModule.forRoot(),
      AngularFireModule.initializeApp(environment.firebase), 
      AngularFireStorageModule,
      AngularFireAuthModule,
      AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
   entryComponents:[
      MyApp,
      HomePage,
      DashboardPage,
      SquerePage,
      ConexionSquarePage, 
      TranAcceptPage, 
      productoPage, 
      SoliRejectPage, 
      PagoQrPage, 
      ModalProductoPage,
      CarritoPage,
      TipoPagoPage,
      RegistroAppPage,  
      ListProductPage,
      DetalleTransaccionComponent, 
      ModalImageComponent
   ],
   providers: [
      StatusBar,
      SplashScreen,    
      { provide: ErrorHandler, useClass: IonicErrorHandler},
      BluetoothSerial,
      File,
      ScreenOrientation,
      SocialSharing,
      InAppBrowser,
      BarcodeScanner,
      ProductosProvider,
      Camera,
      CardIO, 
      AuthProvider,
      FirebaseServiceProvider
   ]
})

export class AppModule {}
