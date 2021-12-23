// import {MatDatepickerModule} from '@angular/material/datepicker';
import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from "@angular/core";
import {
  Validators,
  FormGroup,
  AbstractControl,
  Form,
  NgModel,
} from "@angular/forms";

import { LoadingService } from "src/app/services/loading.service";
import { AlertService } from "src/app/services/alert.service";
import { GlobalService } from "src/app/services/global.service";
import { UserSession } from "src/app/entity/UserSession";
import { Subscription, of } from "rxjs";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { Product, Product_Image } from "src/app/entity/Product";

import {
  NavController,
  ModalController,
  AlertController,
} from "@ionic/angular";
import { NgForm } from "@angular/forms";
import { User } from "src/app/entity/User";
import { UserService } from 'src/app/services/user.service';
import { ConfigManager } from "src/app/services/config.service";
// import Datepicker from 'path/to/node_modules/vanillajs-datepicker/js/Datepicker.js';
@Component({
  selector: "app-address",
  templateUrl: "./address.page.html",
  styleUrls: ["./address.page.scss"],
})
export class AddressPage implements OnInit, OnDestroy {
  @ViewChild("f") f: NgForm;
  private subscription: Subscription;

  constructor(
    public obsUserSession: UserSession,
    public loading: LoadingService,
    public alertService: AlertService,
    private global: GlobalService,
    private router: Router,
    public navCtrl: NavController,
    private route: ActivatedRoute,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public userServices : UserService,
    public obs: User,
    public configManager : ConfigManager,
  ) {
    
  }

  async ionViewWillEnter() {
    await this.onEnter();
  }

  ionViewWillLeave() {
    this.destroyevent();
  }

  ngOnDestroy(): void {
    this.destroyevent();
  }

  private destroyevent() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public async ngOnInit(): Promise<void> {
    this.subscription = this.router.events.subscribe((event) => {
      if (
        event instanceof NavigationEnd &&
        event.url.includes("/login")
      ) {
      }
    });
  }

  public async onEnter(): Promise<void> {
    this.obsUserSession = await this.configManager.GetUser();
    
    this.bindData();
    this.refreshmenu();
  }
  public obsMenu:any[]; 

  async refreshmenu(){
    let tempMenu:any[]; 
    tempMenu = this.configManager.GetMenu();
    let idx = tempMenu.findIndex((x) => x.idx === 4);

    tempMenu[idx].bold = true;
    this.obsMenu =tempMenu.filter((x)=> x.role.includes("*")||x.role.includes(this.obsUserSession.Member_Type+';')).sort();
  }

  async bindData() {
    //function for binding
    this.obs.User_ID = this.obsUserSession.User_ID;
    this.loading.present();
    let serv = (await this.userServices.getUser(this.obs)).subscribe((res) => {
      serv.unsubscribe();
      this.loading.dismiss();
      if (res[0].Result_Code == 1) {
        this.obsUserSession = Object.assign(new User(), res[0].Result[0]);
      } else {
        this.alertService.showOkay(res[0].Message);
      }
    },
    err => console.log('HTTP Error', err));
  }


  back() {
    this.router.navigate(['dashboard']);
  }

  billaddress() {
    this.router.navigate(['billaddress']);
  }
  shipaddress() {
    this.router.navigate(['shipaddress']);
  }
}
