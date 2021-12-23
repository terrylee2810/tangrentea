import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.page.html',
  styleUrls: ['./dropdown.page.scss'],
})
export class DropdownPage implements OnInit {

  
  private icons = [
    'american-football',
    'baseball',
    'basketball',
    'football',
    'tennisball'
  ];
  public items: Array<{ title: string; icon: string }> = [];
  public allItems: Array<{ title: string; icon: string }> = [];


  
  constructor(public viewCtrl: ModalController) {


    for (let i = 0; i < this.icons.length; i++) {
      this.items.push({
        title: this.icons[i].charAt(0).toUpperCase() + this.icons[i].slice(1),
        icon: this.icons[i]
      });
    }
    this.allItems = this.items;

   }

  ngOnInit() {
  }
  dismiss() {
    this.viewCtrl.dismiss();
    }



  
    onSearchTerm(ev: CustomEvent) {
      this.items = this.allItems;
      const val = ev.detail.value;
  
      if (val && val.trim() !== '') {
        this.items = this.items.filter(term => {
          return term.title.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
        });
      }
    }
}
