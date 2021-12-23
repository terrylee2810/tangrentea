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
import { EventService } from "src/app/services/event";
import { ConfigManager } from "src/app/services/config.service";
import Swal from 'sweetalert2'



// import Datepicker from 'path/to/node_modules/vanillajs-datepicker/js/Datepicker.js';
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.page.html",
  styleUrls: ["./dashboard.page.scss"],
})
export class DashboardPage implements OnInit, OnDestroy {
  @ViewChild("f") f: NgForm;
  private subscription: Subscription;

  error_messages = {
    Password: { required: "cannot be blank." },
    User_Email: { required: "cannot be blank." },
  };

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
    public eventService : EventService,
    private configManager: ConfigManager,
  ) {
    
  }

  async ionViewWillEnter() {
    this.obs = new User();
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
    this.global.clearAllNgFormFields(this.f);
    this.obs = new User();
    this.obsUserSession = await this.configManager.GetUser();
    this.refreshmenu();
    this.bindData();
  }
  public obsMenu:any[]; 

  async refreshmenu(){
    let tempMenu:any[]; 
    tempMenu = this.configManager.GetMenu();
    let idx = tempMenu.findIndex((x) => x.idx === 1);

    tempMenu[idx].bold = true;
   
 this.obsMenu =tempMenu.filter((x)=> x.role.includes("*")||x.role.includes(this.obsUserSession.Member_Type+';')).sort();
  }
  async bindData() {
     
    this.obs.User_ID = this.obsUserSession.User_ID;
    this.loading.present();
    let serv = (await this.userServices.getUser(this.obs)).subscribe((res) => {
      serv.unsubscribe();
      this.loading.dismiss();
       
      if (res[0].Result_Code == 1) {
        this.obs = Object.assign(new User(), res[0].Result[0]);
      } else {
        this.alertService.showOkay(res[0].Message);
      }
    },
    err => console.log('HTTP Error', err));
  }

  async onSubmit() {
    this.global.validateAllNgFormFields(this.f);
     
    if (!this.global.validNgFormFields(this.f)) {
      return;
    }
  
    if (!this.f.valid) {
      return;
    }
    // this.obs.User_Name = this.obs.Last_Name + this.obs.First_Name
    this.loading.present();
    let serv = (await this.userServices.loginUser(this.obs)).subscribe(
      (res) => {
        serv.unsubscribe();
        this.loading.dismiss();

        if (res[0].Result_Code == 1) {
          console.log(JSON.stringify(res[0].Result[0]));
          // this.configManager.SetUser(JSON.stringify(res[0].Result[0]));
          this.router.navigate(["home"]);
          // this.eventService.publishFormRefresh();
        }else if (res[0].Result_Code == 2) {
          // this.invalidEmail = 1;
          this.alertService.showOkay(res[0].Message);
        } 
        else {
          this.alertService.showOkay(res[0].Message);
        }
      }
    );
  }

  signup() {
    this.router.navigate(['registermember']);
  }

  logout() {
 
    this.configManager.RemoveUser();
    this.eventService.logoutRefresh(true);
    this.router.navigate(['home']);
  }
  back() {
    this.router.navigate(['home']);
  }
}
