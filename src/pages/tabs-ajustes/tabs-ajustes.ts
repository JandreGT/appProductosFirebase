import { Component } from '@angular/core';
import { AjustesPage, PersonalizarPage } from "../index.page";

@Component({
  selector: 'page-tabs-ajustes',
  templateUrl: 'tabs-ajustes.html',
})
export class TabsAjustesPage {

  tab1: any;
  tab2: any;

  constructor() {
    this.tab1 = PersonalizarPage;
    this.tab2 = AjustesPage;
  }

}
