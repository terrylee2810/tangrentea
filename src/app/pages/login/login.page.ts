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
import Swal from 'sweetalert2';
import {
  NavController,
  ModalController,
  AlertController,
} from "@ionic/angular";
import { NgForm } from "@angular/forms";
import { User } from "src/app/entity/User";
import { UserService } from "src/app/services/user.service";
import { ConfigManager } from "src/app/services/config.service";
import { EventService } from "src/app/services/event";
// import Datepicker from 'path/to/node_modules/vanillajs-datepicker/js/Datepicker.js';
@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit, OnDestroy {
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
    public userServices: UserService,
    public obs: User,
    public configManager: ConfigManager,
    private eventService: EventService
  ) {}

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
      if (event instanceof NavigationEnd && event.url.includes("/login")) {
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

  async onSubmit() {
    // this.router.navigate(["dashboard"]);

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
          this.configManager.SetUser(JSON.stringify(res[0].Result[0]));
          this.router.navigate(["dashboard"]);
          this.eventService.logoutRefresh(false);
          // this.eventService.publishFormRefresh();
        } else if (res[0].Result_Code == 2) {
          // this.invalidEmail = 1;
          this.alertService.showOkay(res[0].Message);
        } else {
          this.alertService.showOkay(res[0].Message);
        }
      }
    );
  }

  signup() {
    this.router.navigate(["registermember"]);
  }

  async forgotpassword() {

    Swal.fire({
      title: "Forgot Password",
      text: "Please enter your email:",
      input: 'text',
     }
    ).then(async (value) => {
      debugger;
      if (value == null) {
        return;
      }
      var obj = {
        User_Email: value,
      };
      this.loading.present();
      let serv = (await this.userServices.resetPassword(obj)).subscribe(
        (res) => {
          serv.unsubscribe();
          this.loading.dismiss();

          if (res[0].Result_Code == 1) {
            Swal.fire(
              "Successful",
              "We sent a new password and email to the address you provide. Dint receive the email? Please check if the email is in your junk/spam folder.",
              "success"
            );
            // Swal.fire(
            //   "We sent a new password and email to the address you provide. Dint receive the email? Please check if the email is in your junk/spam folder."
            // );
          } else {
            Swal.fire("Error", res[0].Message, "error");
            // Swal.fire(res[0].Message);
          }
        }
      );

      Swal.fire(`You typed: ${value}`);
    });

    // Swal.fire({
    //   title: "An input!",
    //   text: "Write something interesting:",
    //   type: "input",
    //   showCancelButton: true,
    //   closeOnConfirm: false,
    //   animation: "slide-from-top",
    //   inputPlaceholder: "Write something"
    // },
    // function(inputValue){
    //   if (inputValue === null) return false;

    //   if (inputValue === "") {
    //     swal.showInputError("You need to write something!");
    //     return false
    //   }

    //   Swal.fire("Nice!", "You wrote: " + inputValue, "success");
    // });

    // const alert = await this.alertController.create({
    //   header: "Please enter your email",
    //   inputs: [
    //     {
    //       name: "email",
    //       type: "text",
    //       placeholder: "Email",
    //     },
    //   ],
    //   buttons: [
    //     {
    //       text: "Cancel",
    //       role: "cancel",
    //       cssClass: "secondary",
    //       handler: () => {
    //         console.log("Confirm Cancel");
    //       },
    //     },
    //     {
    //       text: "Ok",
    //       handler: async (data) => {
    //         // alert(data.email);
    //         console.log("Confirm Ok" + data.email);

    //         var obj = {
    //           User_Email: data.email,
    //         };
    //         this.loading.present();
    //         let serv = (await this.userServices.resetPassword(obj)).subscribe(
    //           (res) => {
    //             serv.unsubscribe();
    //             this.loading.dismiss();

    //             if (res[0].Result_Code == 1) {
    //               this.alertService.showOkay(
    //                 "We sent a new password and email to the address you provide. Dint receive the email? Please check if the email is in your junk/spam folder."
    //               );
    //             } else {
    //               this.alertService.showOkay(res[0].Message);
    //             }
    //           }
    //         );
    //       },
    //     },
    //   ],
    // });

    // await alert.present();
  }
}
