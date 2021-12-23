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
@Component({
  selector: 'app-jxuserview',
  templateUrl: './jxuserview.page.html',
  styleUrls: ['./jxuserview.page.scss'],
})
export class JxuserviewPage implements OnInit, OnDestroy {
  @ViewChild("f") f: NgForm;
  private subscription: Subscription;
  public isedit = false;

  memberType = [
    { Code: "Member", Name: "Member"},
    { Code: "Admin1", Name: "Level 1"},
    { Code: "Admin12", Name: "Level 1 + 2"},
    { Code: "Admin123", Name: "Level 1 + 2 + 3"},
    { Code: "Admin2", Name: "Level 2"},
    { Code: "Admin3", Name: "Level 3"},
    { Code: "Admin", Name: "Level 4"},
  ];

  salesType = [
    { Code: "", Name: "None"},
    { Code: "Walk In", Name: "Walk In"},
    { Code: "Pre-Order", Name: "Pre-Order"},
    { Code: "Whole-Sales", Name: "Whole-Sales"},
    { Code: "Shopee", Name: "Shopee"},
    { Code: "Grab", Name: "Grab"}
  ];
 
  error_messages = {
    First_Name: { required: "cannot be blank." },
    Last_Name: { required: "cannot be blank." },
    Confirm_Password: { required: "cannot be blank.", password_mismatch : "password mismatch."},
    Password: { required: "cannot be blank." },
    Email: { required: "cannot be blank.", invalid_email: "invalid email." },
    Member_Type: { required: "cannot be blank." },
    Sales_Type: { required: "cannot be blank." },
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
    private userService : UserService,
    public obs :User
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
        event.url.includes("/jxuserview")
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
    idx = tempMenu.findIndex((x) => x.idx === 17);
   

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
     
    this.obs = new User();
    console.log("this.data : " + JSON.stringify(this.data));
    if (this.data.id) {
      console.log("edit");
      this.isedit = true;
      let obj = {
        User_ID:  this.data.id ,
        Created_User : this.obsUserSession.User_ID
      };

      this.loading.present();
      console.log(obj);
      let serv = (await this.userService.getUserbyid(obj)).subscribe((res) => {
        console.log(res);
        serv.unsubscribe();
        if (res[0].Result_Code == 1) {
          this.obs = res[0].Result[0];
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
    this.router.navigate(['postcode']);
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
      User_ID:  this.data.id ,
      Member_Type: form.Member_Type,
      First_Name: form.First_Name,
      Last_Name: form.Last_Name,
      User_Email: form.User_Email,
      Sales_Type: form.Sales_Type,
      User_Location: form.User_Location,
    };
    console.log(obj);
    this.loading.present();
    debugger;
    if(this.isedit){
      let serv = (await this.userService.edit(obj)).subscribe((res) => {
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
      let serv = (await this.userService.insert(obj)).subscribe( async (res) => {
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
          this.router.navigate(["jxuserview"],navigationExtras);
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
