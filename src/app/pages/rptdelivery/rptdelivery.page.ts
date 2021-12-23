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
import { formatDate } from "@angular/common";
import { base64StringToBlob } from "blob-util";
import { OrderService } from "src/app/services/order.service";



// import Datepicker from 'path/to/node_modules/vanillajs-datepicker/js/Datepicker.js';
@Component({
  selector: "app-rptdelivery",
  templateUrl: "./rptdelivery.page.html",
  styleUrls: ["./rptdelivery.page.scss"],
})
export class RptdeliveryPage implements OnInit, OnDestroy {
  @ViewChild("f") f: NgForm;
  private subscription: Subscription;

  Delivery_Date:string;
  public selectedMoment = new Date();
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
    public orderService : OrderService,
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
    this.selectedMoment = new Date();
    this.refreshmenu();
    this.bindData();
  }

  public obsMenu:any[]; 

  async refreshmenu(){
    let tempMenu:any[]; 
    tempMenu = this.configManager.GetMenu();
    let idx = tempMenu.findIndex((x) => x.idx === 9);

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
  onChangeDate(data) {
    this.Delivery_Date = formatDate(data._selected, "dd MMM yyyy", "en");
  }

  async download(){
    if(this.Delivery_Date == undefined || this.Delivery_Date=='' ){
      Swal.fire('Error',"Please select the date.", "error");
      return
    }

    let cate:string ='';
    if (this.checkAKK) {
      cate += "'Ang Ku Kueh',";
    }
    if (this.checkMTO) {
      cate += "'Made To Order',";
    }
    if (this.checkBS) {
      cate += "'Baby Shower',";
    }
    if (this.checkSK) {
      cate += "'Seasonal Kueh',";
    }

    if (this.checkAKK ==false &&this.checkMTO ==false 
      && this.checkBS ==false &&this.checkSK ==false) {
        cate = "'Ang Ku Kueh','Made To Order','Baby Shower','Seasonal Kueh',";
    }
    cate = cate.slice(0, -1);

    let paymentstat:string ='';
    if (this.checkPending) {
      paymentstat += "'Pending',";
    }

    if (this.checkCompleted) {
      paymentstat += "'Completed',";
    }

    if (this.checkProgress) {
      paymentstat += "'In-Progress',";
    }

    if (this.checkPending ==false &&this.checkCompleted ==false 
      && this.checkProgress ==false ) {
        paymentstat = "'Pending','Completed','Completed',";
    }
    paymentstat = paymentstat.slice(0, -1);
    
    let obj ={
      Delivery_Date : this.Delivery_Date,
      Category_In:cate,
      Payment_Status_In : paymentstat
    };
    this.loading.present();
    let serv = (await this.orderService.downloaddeliverylist(obj)).subscribe((res) => {
      debugger;
      serv.unsubscribe();
      this.loading.dismiss();
      if (res[0].Result_Code == 1) {
        const file = base64StringToBlob(res[0].Data, "application/pdf");
        var ua = navigator.userAgent.toLowerCase(); 
        if (ua.indexOf('safari') != -1) { 
          if (ua.indexOf('chrome') > -1) {
            let fileURL = URL.createObjectURL(file);
            window.open(fileURL,'_blank');
          } else {
            const data = window.URL.createObjectURL(file);
            var link = document.createElement('a');
            link.href = data;
            link.download="file.pdf";
            link.click();
            setTimeout(function(){
              // For Firefox it is necessary to delay revoking the ObjectURL
              window.URL.revokeObjectURL(data);
            }, 100);
          }
        }
      } else {
        Swal.fire('Error',res[0].Message, "error");
      }
     
    });
  }



  checkPending: boolean = true;
  checkCompleted: boolean = true;
  checkProgress: boolean = true;

  check_Pending() {
    if (this.checkPending == true) {
      this.checkPending = false;
    } else {
      this.checkPending = true;
    }
  }

  check_Completed() {
    if (this.checkCompleted == true) {
      this.checkCompleted = false;
    } else {
      this.checkCompleted = true;
    }
  }
  

  check_Progress() {
    if (this.checkProgress == true) {
      this.checkProgress = false;
    } else {
      this.checkProgress = true;
    }
  }
  
  


  checkAKK: boolean = true;
  checkMTO: boolean = true;
  checkBS: boolean = true;
  checkSK: boolean = true;

  check_AKK() {
    if (this.checkAKK == true) {
      this.checkAKK = false;
    } else {
      this.checkAKK = true;
    }
  }
  
  check_MTO() {
    if (this.checkMTO == true) {
      this.checkMTO = false;
    } else {
      this.checkMTO = true;
    }
  }

  check_BS() {
    if (this.checkBS == true) {
      this.checkBS = false;
    } else {
      this.checkBS = true;
    }
  }

  check_SK() {
    if (this.checkSK == true) {
      this.checkSK = false;
    } else {
      this.checkSK = true;
    }
  }
}
