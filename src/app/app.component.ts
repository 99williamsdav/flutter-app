import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { NotificationService } from './services/notification';

@Component({
  selector: 'app-root',
  templateUrl: 'app.html'
})
export class FlutterApp {

  public pages: Array<{ title: string; url: string }> = [
    { title: 'Profit', url: '/home' },
    { title: 'About', url: '/about' },
  ];

  constructor(
    platform: Platform,
    private statusBar: StatusBar,
    private router: Router,
    private notification: NotificationService
  ) {
    platform.ready().then(() => {
      this.statusBar.styleDefault();
    })
      .then(() => this.notification.init());
  }

  public openPage(page: { title: string; url: string }): void {
    this.router.navigateByUrl(page.url);
  }
}
