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
import { HomePage, DashboardPage, SquerePage, OpcionpagoPage, PosPage, ConexionSquarePage, PosmovilPage, TranAcceptPage,
        TranRejectPage, SolicitupagoPage, SoliAceptPage, SoliRejectPage, MisventasPage,PagoQrPage,SolicitudQrPage, TiendaPage,
        ModalProductoPage, CarritoPage, TipoPagoPage, RegistroAppPage, BienvenidaPage, TipoUsuarioPage, PersonaPage,
        AjustesPage, PersonalizarPage, TabsAjustesPage}
        from '../pages/index.page'

//Components
import { DetalleTransaccionComponent, InfoTiendaComponent, ModalImageComponent } from '../components/index.components';

//Plugins
import { BrMaskerModule } from 'brmasker-ionic-3';
import { IonicStorageModule } from '@ionic/storage';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { File } from '@ionic-native/file';
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import { SocialSharing } from '@ionic-native/social-sharing';
import { SignaturePadModule } from 'angular2-signaturepad';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera } from '@ionic-native/camera';
import { CardIO } from '@ionic-native/card-io';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule, AngularFireDatabase } from '@angular/fire/database';
// import { Observable } from 'rxjs-compat';


//Providers
import {DataUserProvider, PosProvider, SolicitudPagoProvider, TransaccionesProvider, ProductosProvider,
          RegistroProvider, AjustesProvider, BuscarClienteProvider, AuthProvider,FirebaseServiceProvider} from '../providers/index.services';
          

export const firebaseConfig  = {
  apiKey: "AIzaSyD8TpquJDSu9NWQBdwAJdhWzsoDh_Sl8rM",
  authDomain: "ventaqr-a51fc.firebaseapp.com",
  databaseURL: "https://ventaqr-a51fc.firebaseio.com",
  projectId: "ventaqr-a51fc",
  storageBucket: "",
  messagingSenderId: "31682504833",
  appId: "1:31682504833:web:ff5cb1e4091c520a614580"
};

@NgModule({
  declarations: [
    MyApp,
    //pages
    HomePage,
    SquerePage,
    DashboardPage,
    OpcionpagoPage,
    PosPage,
    ConexionSquarePage,
    PosmovilPage,
    TranAcceptPage,
    TranRejectPage,
    SolicitupagoPage,
    SoliAceptPage,
    SoliRejectPage,
    MisventasPage,
    PagoQrPage,
    SolicitudQrPage,
    TiendaPage,
    ModalProductoPage,
    CarritoPage,
    TipoPagoPage, 
    RegistroAppPage,
    BienvenidaPage,
    TipoUsuarioPage,
    PersonaPage,
    AjustesPage,
    PersonalizarPage,
    TabsAjustesPage,
    //components
    DetalleTransaccionComponent,
    InfoTiendaComponent,
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
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DashboardPage,
    SquerePage,
    OpcionpagoPage,
    PosPage,
    ConexionSquarePage,
    PosmovilPage,
    TranAcceptPage,
    TranRejectPage,
    SolicitupagoPage,
    SoliAceptPage,
    SoliRejectPage,
    MisventasPage,
    PagoQrPage,
    SolicitudQrPage,
    TiendaPage,
    ModalProductoPage,
    CarritoPage,
    TipoPagoPage,
    RegistroAppPage,
    BienvenidaPage,
    TipoUsuarioPage,
    PersonaPage,
    AjustesPage,
    PersonalizarPage,
    TabsAjustesPage, 
    DetalleTransaccionComponent,
    InfoTiendaComponent,
    ModalImageComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,    
    { provide: ErrorHandler, useClass: IonicErrorHandler},
    DataUserProvider,
    PosProvider,
    BluetoothSerial,
    File,
    ScreenOrientation,
    SocialSharing,
    InAppBrowser,
    BarcodeScanner,
    SolicitudPagoProvider,
    TransaccionesProvider,
    ProductosProvider,
    RegistroProvider,
    AjustesProvider,
    Camera,
    CardIO,
    BuscarClienteProvider,
    AuthProvider,
    // Observable,
    FirebaseServiceProvider
  ]
})
export class AppModule {}
