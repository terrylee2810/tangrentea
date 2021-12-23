import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

  site;

  constructor(
    private popoverController: PopoverController) { }

  ngOnInit() {
    // this.siteInfo = this.navParams.get('site');
    console.log(this.site);
  }

  delete() {
    // code for setting wifi option in apps
    this.popoverController.dismiss('delete');
  }

  // logout() {
  //   // code for logout
  //   this.popoverController.dismiss('edupala2.com');
  // }

  // eventFromPopover() {
  //   this.popoverController.dismiss('edupala3.com');
  // }

}
