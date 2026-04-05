import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FlutterApp } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { AboutPage } from '../pages/about/about';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { FlutterService } from './services/flutter';
import { NotificationService } from './services/notification';

@NgModule({
  declarations: [
    FlutterApp,
    AboutPage,
    HomePage,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(),
    AppRoutingModule
  ],
  bootstrap: [FlutterApp],
  providers: [
    StatusBar,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FlutterService,
    NotificationService,
  ]
})
export class AppModule {}
