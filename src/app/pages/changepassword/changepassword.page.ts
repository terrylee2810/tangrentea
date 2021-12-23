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
// import Datepicker from 'path/to/node_modules/vanillajs-datepicker/js/Datepicker.js';
@Component({
  selector: "app-changepassword",
  templateUrl: "./changepassword.page.html",
  styleUrls: ["./changepassword.page.scss"],
})
export class ChangepasswordPage implements OnInit, OnDestroy {
  @ViewChild("f") f: NgForm;
  private subscription: Subscription;

  error_messages = {
    Old_Password: { required: "cannot be blank." },
    Last_Name: { required: "cannot be blank." },
    Confirm_Password: { required: "cannot be blank.", password_mismatch : "password mismatch."},
    Password: { required: "cannot be blank." },
    Email: { required: "cannot be blank." },
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
    this.refreshmenu();
    this.bindData();
  }
  public obsMenu:any[]; 

  async refreshmenu(){
    let tempMenu:any[]; 
    tempMenu = this.configManager.GetMenu();
    let idx = tempMenu.findIndex((x) => x.idx === 3);

    tempMenu[idx].bold = true;
    this.obsMenu =tempMenu.filter((x)=> x.role.includes("*")||x.role.includes(this.obsUserSession.Member_Type+';')).sort();
   
  }
  async bindData() {
    this.obs.User_ID = this.obsUserSession.User_ID;
    // this.loading.present();
    // let serv = (await this.userServices.getUser(this.obs)).subscribe((res) => {
    //   serv.unsubscribe();
    //   this.loading.dismiss();
    //   if (res[0].Result_Code == 1) {
    //     this.obs = Object.assign(new User(), res[0].Result[0]);
    //   } else {
    //     this.alertService.showOkay(res[0].Message);
    //   }
    // },
    // err => console.log('HTTP Error', err));
  }
  mustmatch(control: NgModel,matchingControl: NgModel) {
    // return null if controls haven't initialised yet
    if (!control || !matchingControl) {
      return null;
    }
    if (control.control.value == "")
    control.control.setErrors({ required : true,mustMatch: false });
    else if (control.control.value !== matchingControl.control.value)
      control.control.setErrors({ required : false,mustMatch: true });
    else {
      // control.control. = false;
      control.control.setErrors(null)
      // control.control.setErrors({ required : false,mustMatch: false });
    }
  }

  async onSubmit() {
    this.global.validateAllNgFormFields(this.f);
     
    if (!this.global.validNgFormFields(this.f)) {
      return;
    }
  
    if (!this.f.valid) {
      return;
    }

    this.obs.User_ID =this.obsUserSession.User_ID;
    this.loading.present();
    let serv = (await this.userServices.changePassword(this.obs)).subscribe((res) => {
      serv.unsubscribe();
      this.loading.dismiss();
      this.global.clearAllNgFormFields(this.f);
      if (res[0].Result_Code == 1) {
        this.obs = new User();
        Swal.fire('Successful',
        "Your password has been successfully changed.",
         "success");
      }else{

        Swal.fire('Error',
        res[0].Message,
         "error");
        // this.alertService
        // .showOkay(res[0].Message);
      
      }
   
    });

  }

  back() {
    this.router.navigate(['dashboard']);
  }
}
