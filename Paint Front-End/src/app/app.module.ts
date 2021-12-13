import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {PaintComponent} from './paint/paint.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {ColorPickerModule} from "ngx-color-picker";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {PaintService} from "./Service/paint.service";
import {ApiService} from "./Service/api.service";
import { FileSaverModule } from 'ngx-filesaver'


@NgModule({
  declarations: [
    AppComponent,
    PaintComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    MatButtonModule,
    MatMenuModule,
    MatGridListModule,
    BrowserAnimationsModule,
    MatIconModule,
    FormsModule,
    ColorPickerModule,
    FileSaverModule
  ],
  providers: [PaintService, HttpClient, ApiService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
