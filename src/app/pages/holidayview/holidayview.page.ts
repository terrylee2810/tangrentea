import { Component, OnInit, OnDestroy, ElementRef, ViewChild, } from "@angular/core";
import { Validators, FormGroup, AbstractControl, Form, NgModel, } from "@angular/forms";
import { LoadingService } from "src/app/services/loading.service";
import { AlertService } from "src/app/services/alert.service";
import { GlobalService } from "src/app/services/global.service";
import { UserSession } from "src/app/entity/UserSession";
import { Subscription, of } from "rxjs";
import { Router, NavigationEnd, ActivatedRoute, NavigationExtras } from "@angular/router";
import { NavController, ModalController, AlertController, } from "@ionic/angular";
import { NgForm } from "@angular/forms";
import { User } from "src/app/entity/User";
import { UserService } from 'src/app/services/user.service';
import { EventService } from "src/app/services/event";
import { ConfigManager } from "src/app/services/config.service";
import { Holiday } from "src/app/entity/Holiday";
import { formatDate } from "@angular/common";
import Swal from 'sweetalert2'
import { OffdayService } from "src/app/services/offday.service";
@Component({
  selector: 'app-holidayview',
  templateUrl: './holidayview.page.html',
  styleUrls: ['./holidayview.page.scss'],
})
export class HolidayviewPage implements OnInit, OnDestroy {
  @ViewChild("f") f: NgForm;
  private subscription: Subscription;
  public isedit = false;
  public selectedMoment: Date;
  // public min = new Date(
  //   new Date().getFullYear(),
  //   new Date().getMonth(),
  //   new Date().getDate(),
  //   0,
  //   0,
  //   0
  // );

  error_messages = {
    Name: { required: "cannot be blank." },
    Holiday_Date_From: { required: "cannot be blank." },
    Holiday_Date_To: { required: "cannot be blank." },
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
    private configManager: ConfigManager,
    private offdayService: OffdayService,
    public obsHoliday: Holiday
  ) {

  }

  async ionViewWillEnter() {
    this.obsHoliday = new Holiday();
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
        event.url.includes("/holidayview")
      ) {
      }
    });
  }
  data: any;
  public async onEnter(): Promise<void> {
    this.global.clearAllNgFormFields(this.f);
    this.obsUserSession = await this.configManager.GetUser();
    this.data = await this.GetParams();
    this.refreshmenu();
    this.bindData();
  }

  public obsMenu: any[];

  async refreshmenu() {
    let tempMenu: any[];
    tempMenu = this.configManager.GetMenu();
    let idx = tempMenu.findIndex((x) => x.idx === 12);

    tempMenu[idx].bold = true;
 this.obsMenu =tempMenu.filter((x)=> x.role.includes("*")||x.role.includes(this.obsUserSession.Member_Type+';')).sort();
  }

  async GetParams() {
    let promise = new Promise((resolve, reject) => {
      this.route.queryParams.subscribe((params) => {
        if (params) {
          resolve(params);
        }
      });
    });

    return await promise; // wait until the promise resolves (*)
  }

 


  async bindData() {

    this.obsHoliday = new Holiday(); 
    // this.min.setDate(this.min.getDate() + 1);
    if (this.data.id) {
      console.log("edit");
      this.isedit = true;
      let obj = {
        Offday_ID: this.data.id,
        Created_User: this.obsUserSession.User_ID
      };

      this.loading.present();
      console.log(obj);
      let serv = (await this.offdayService.getoffdaybyid(obj)).subscribe((res) => {
        console.log(res);
        serv.unsubscribe();
        if (res[0].Result_Code == 1) {
          var result = res[0].Result[0];
          result.Holiday_Date_From = formatDate(result.Holiday_Date_From, "dd MMM yyyy", "en"); 
          result.Holiday_Date_To = formatDate(result.Holiday_Date_To, "dd MMM yyyy", "en"); 
          this.obsHoliday = result;
        } else {
          this.alertService.showOkay(res[0].Message);
        }
        this.loading.dismiss();
      });
    } else {
      console.log("insert");
    }
  }

  onChange1(data) { 
    if(data._selected)
      this.obsHoliday.Holiday_Date_From = formatDate(data._selected, "dd MMM yyyy", "en"); 
  }
  onChangeTo(data) { 
    if(data._selected)
      this.obsHoliday.Holiday_Date_To = formatDate(data._selected, "dd MMM yyyy", "en"); 
  }
  back() {
    this.router.navigate(['holiday']);
  }

  async onSubmit() {
    this.global.validateAllNgFormFields(this.f);

    if (!this.global.validNgFormFields(this.f)) {
      return;
    }
    if (!this.f.valid) {
      return;
    }
    var form = this.obsHoliday;

    let obj = {
      Offday_ID: this.data.id,
      Name: form.Name,
      Holiday_Date_From: form.Holiday_Date_From,
      Holiday_Date_To: form.Holiday_Date_To,
      Created_User: this.obsUserSession.User_ID
    };
    console.log(obj);
    this.loading.present();
    if (this.isedit) {
      let serv = (await this.offdayService.edit(obj)).subscribe((res) => {
        serv.unsubscribe();
        if (res[0].Result_Code == 1) {
          
          Swal.fire('Successful',
          res[0].Message,
           "success");

        
        } else {
          this.alertService.showOkay(res[0].Message);
        }
        this.loading.dismiss();
      });

    } else {
      let serv = (await this.offdayService.insert(obj)).subscribe((res) => {
        serv.unsubscribe();
        if (res[0].Result_Code == 1) {
          Swal.fire('Successful',
          res[0].Message,
           "success");
          let navigationExtras: NavigationExtras = {
            queryParams: {
              id: res[0].IdentityKey,
            },
          };
          this.router.navigate(["holidayview"],navigationExtras);
          this.data = {
            queryParams: {
              id: res[0].IdentityKey,
            },
          };
          this.isedit = true;

        } else {
          this.alertService.showOkay(res[0].Message);
        }
        this.loading.dismiss();
      });
    }
  }
}
