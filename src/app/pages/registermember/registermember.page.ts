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
// import Datepicker from 'path/to/node_modules/vanillajs-datepicker/js/Datepicker.js';
@Component({
  selector: "app-registermember",
  templateUrl: "./registermember.page.html",
  styleUrls: ["./registermember.page.scss"],
})
export class RegistermemberPage implements OnInit, OnDestroy {
  @ViewChild("f") f: NgForm;
  private subscription: Subscription;

  error_messages = {
    First_Name: { required: "cannot be blank." },
    Last_Name: { required: "cannot be blank." },
    Confirm_Password: { required: "cannot be blank.", password_mismatch : "password mismatch."},
    Password: { required: "cannot be blank." },
    Email: { required: "cannot be blank.", invalid_email: "invalid email." },
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
    this.bindData();
  }

  async bindData() {
    //function for binding
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
    this.obs.User_Name = this.obs.Last_Name + this.obs.First_Name
    this.loading.present();
    let serv = (await this.userServices.addUser(this.obs)).subscribe((res) => {
      serv.unsubscribe();
      this.loading.dismiss();
      if (res[0].Result_Code == 1) {
        this.alertService
        .showOkay("Succefully registerd.");
        this.router.navigate(["login"]);
      }else{
        this.alertService
        .showOkay(res[0].Message);
      
      }
    });
  }


}
