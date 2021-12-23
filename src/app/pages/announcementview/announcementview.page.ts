import {Component,OnInit,OnDestroy,ElementRef,ViewChild,} from "@angular/core";
import {Validators, FormGroup,AbstractControl,Form,NgModel,} from "@angular/forms";
import { LoadingService } from "src/app/services/loading.service";
import { AlertService } from "src/app/services/alert.service";
import { GlobalService } from "src/app/services/global.service";
import { UserSession } from "src/app/entity/UserSession";
import { Subscription, of } from "rxjs";
import { Router, NavigationEnd, ActivatedRoute, NavigationExtras } from "@angular/router";
import { Product, Product_Image } from "src/app/entity/Product";
import {NavController, ModalController,AlertController,} from "@ionic/angular";
import { NgForm } from "@angular/forms";
import { User } from "src/app/entity/User";
import { UserService } from 'src/app/services/user.service';
import { EventService } from "src/app/services/event";
import { ConfigManager } from "src/app/services/config.service";
import Swal from 'sweetalert2'
import { Announcement } from "src/app/entity/Announcement";
import { AnnouncementService } from "src/app/services/announcement.service";
import { formatDate } from "@angular/common";
@Component({
  selector: 'app-announcementview',
  templateUrl: './announcementview.page.html',
  styleUrls: ['./announcementview.page.scss'],
})
export class AnnouncementviewPage implements OnInit, OnDestroy {
  @ViewChild("f") f: NgForm;
  private subscription: Subscription;
  public isedit = false;
  error_messages = {
    Message: { required: "cannot be blank." },
    Start_Date: { required: "cannot be blank." },
    End_Date: { required: "cannot be blank."},
    Title: { required: "cannot be blank."},
    Seq: { required: "cannot be blank."},
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
    private configManager: ConfigManager,
    private announcementService : AnnouncementService,
    public obs :Announcement
  ) {
    
  }

  async ionViewWillEnter() { 
    this.obs = new Announcement();
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
        event.url.includes("/announcementview")
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

  public obsMenu:any[]; 

  async refreshmenu(){
    let tempMenu:any[]; 
    tempMenu = this.configManager.GetMenu();
    let idx;
    idx = tempMenu.findIndex((x) => x.idx === 20);
   

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
     
    this.obs = new Announcement();
    console.log("this.data : " + JSON.stringify(this.data));
    if (this.data.id) {
      console.log("edit");
      this.isedit = true;
      let obj = {
        Announcement_ID:  this.data.id ,
        Created_User : this.obsUserSession.User_ID
      };

      this.loading.present();
      console.log(obj);
      let serv = (await this.announcementService.getannouncementbyid(obj)).subscribe((res) => {
        console.log(res);
        serv.unsubscribe();
        if (res[0].Result_Code == 1) {
         
          var result = res[0].Result[0];
          result.Start_Date = formatDate(
            result.Start_Date,
            "dd MMM yyyy",
            "en"
          );
          result.End_Date = formatDate(
            result.End_Date,
            "dd MMM yyyy",
            "en"
          );
          this.obs = result;

        } else {
          this.alertService.showOkay(res[0].Message);
        }
        this.loading.dismiss();
      });
    }else{
      console.log("insert"); 
    }
  }

  back() {
    this.router.navigate(['announcement']);
  }

  async onSubmit() {
    this.data = await this.GetParams();
    this.global.validateAllNgFormFields(this.f);
     
    if (!this.global.validNgFormFields(this.f)) {
      return;
    }
    if (!this.f.valid) {
      return;
    }
    var form = this.obs ;

    let obj = {
      Announcement_ID:  this.data.id ,
      Title: form.Title,
      Start_Date: form.Start_Date,
      End_Date: form.End_Date,
      Message: form.Message,
      Created_User : this.obsUserSession.User_ID,
      Seq: form.Seq,
    };
    console.log(obj);
    this.loading.present();
    debugger;
    if(this.isedit){
      let serv = (await this.announcementService.edit(obj)).subscribe((res) => {
        this.loading.dismiss();
        serv.unsubscribe(); 
        if (res[0].Result_Code == 1) {
          Swal.fire('Successful',
          res[0].Message,
           "success");
          // this.alertService.showOkay(res[0].Message);
          //this.obsPostcode = res[0].Result[0];
        } else {
          this.alertService.showOkay(res[0].Message);
        }
       
      });
      
    }else{
      let serv = (await this.announcementService.insert(obj)).subscribe( async (res) => {
        this.loading.dismiss();
        serv.unsubscribe();
        if (res[0].Result_Code == 1) {
          //this.obsPostcode = res[0].Result[0];
          debugger;
         
          Swal.fire('Successful',
          res[0].Message,
           "success");
          
           let navigationExtras: NavigationExtras = {
            queryParams: {
              id: res[0].IdentityKey,
            },
          };
          this.router.navigate(["announcementviewview"],navigationExtras);
          this.data = {
            queryParams: {
              id: res[0].IdentityKey,
            },
          };
          this.isedit = true;

        } else {
          this.alertService.showOkay(res[0].Message);
        }
       
      });
    }

   
  }
 
  onChange1(data) {
    if (data._selected)
      this.obs.Start_Date = formatDate(
        data._selected,
        "dd MMM yyyy",
        "en"
      );
  }
  onChangeTo(data) {
    if (data._selected)
      this.obs.End_Date = formatDate(
        data._selected,
        "dd MMM yyyy",
        "en"
      );
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

  onKeyUp(item) {
    if (parseInt(item) > 999) {
      item.Qty = 999;
    }
  }
}


