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
import { Email } from "src/app/entity/Email";
import { EmailService } from "src/app/services/email.service";
@Component({
  selector: 'app-emailview',
  templateUrl: './emailview.page.html',
  styleUrls: ['./emailview.page.scss'],
})
export class EmailviewPage implements OnInit, OnDestroy {
  @ViewChild("f") f: NgForm;
  private subscription: Subscription;
  public isedit = false;
  error_messages = {
    Header: { required: "cannot be blank." },
    Message: { required: "cannot be blank." },
    Recipient_Email: { required: "cannot be blank." },
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
    private emailService : EmailService,
    public obs :Email
  ) {
    
  }

  async ionViewWillEnter() { 
    this.obs = new Email();
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
        event.url.includes("/emailview")
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
    idx = tempMenu.findIndex((x) => x.idx === 19);
   

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
     
    this.obs = new Email();
    console.log("this.data : " + JSON.stringify(this.data));
    if (this.data.id) {
      console.log("edit");
      this.isedit = true;
      let obj = {
        Email_ID:  this.data.id ,
        Created_User : this.obsUserSession.User_ID
      };

      this.loading.present();
      console.log(obj);
      let serv = (await this.emailService.getemailbyid(obj)).subscribe((res) => {
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
    this.router.navigate(['email']);
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
      Email_ID:  this.data.id ,
      Message: form.Message,
      Recipient_Email: form.Recipient_Email,
      Header: form.Header,
    };
    console.log(obj);
    this.loading.present();
    debugger;
    if(this.isedit){
      let serv = (await this.emailService.edit(obj)).subscribe((res) => {
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
