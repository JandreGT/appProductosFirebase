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
        ModalProductoPage, CarritoPage, TipoPagoPage, RegistroPage, RegistroAppPage, BienvenidaPage, TipoUsuarioPage, PersonaPage,
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


//Providers
import {  AuthProvider, DataUserProvider, PosProvider, SolicitudPagoProvider, TransaccionesProvider, ProductosProvider,
          RegistroProvider, AjustesProvider, BuscarClienteProvider }
          from '../providers/index.services';

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
    RegistroPage,
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
    IonicStorageModule.forRoot()
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
    RegistroPage,
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
  providers: [
    StatusBar,
    SplashScreen,
    AuthProvider,
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
    BuscarClienteProvider
  ]
})
export class AppModule {}
