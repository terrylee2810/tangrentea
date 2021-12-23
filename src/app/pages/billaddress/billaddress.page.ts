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
import Swal from 'sweetalert2'
import {
  NavController,
  ModalController,
  AlertController,
} from "@ionic/angular";
import { NgForm } from "@angular/forms";
import { User } from "src/app/entity/User";
import { UserService } from 'src/app/services/user.service';
import { ConfigManager } from "src/app/services/config.service";
import { EventService } from "src/app/services/event";
// import Datepicker from 'path/to/node_modules/vanillajs-datepicker/js/Datepicker.js';
@Component({
  selector: "app-billaddress",
  templateUrl: "./billaddress.page.html",
  styleUrls: ["./billaddress.page.scss"],
})
export class BilladdressPage implements OnInit, OnDestroy {
  @ViewChild("f") f: NgForm;
  private subscription: Subscription;

  error_messages = {
    Billing_First_Name: { required: "cannot be blank." },
    Billing_Last_Name:  { required: "cannot be blank." },
    Billing_Company_Name:  { required: "cannot be blank." },
    Billing_Street_Address1:  { required: "cannot be blank." },
    Billing_Street_Address2:  { required: "cannot be blank." },
    Billing_City:  { required: "cannot be blank." },
    Billing_Postcode: { required: "cannot be blank.", min: "min 6 digits.", max: "max 6 digits." },
    Billing_Country: { required: "cannot be blank." },
    Billing_Phone: { required: "cannot be blank.", min: "min 8 digits.", max: "max 8 digits." },
    Billing_Email: { required: "cannot be blank.",invalid_email: "invalid email."  },
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
    public configManager: ConfigManager,
    private eventService: EventService,
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
        event.url.includes("/registermember")
      ) {
      }
    });
  }

  public async onEnter(): Promise<void> {
     
    this.global.clearAllNgFormFields(this.f);
    this.obs = new User();
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
     
    this.loading.present();
    let serv = (await this.userServices.updateBillingAddress(this.obs)).subscribe((res) => {
      serv.unsubscribe();
      this.loading.dismiss();
      if (res[0].Result_Code == 1) {
        // this.toastService.show("Updated successfully.");
        Swal.fire('Successful',
        "Billing address has been successfully updated.",
         "success");
         
        this.configManager.SetUser(JSON.stringify(res[0].Result[0]));
        this.eventService.logoutRefresh(false);
      } else {
        this.alertService.showOkay(res[0].Message);
      }
    });



  }

  back() {
    this.router.navigate(['address']);
  }

  onPaste(event: any) {
    return false;
  }

  onInput(event: any) {
    const pattern = /[0-9]/; // without ., for integer only
    let inputChar = String.fromCharCode(
      event.which ? event.which : event.keyCode
    );

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
      return false;
    }
    return true;
  }

}
