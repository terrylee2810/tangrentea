import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product, Product_Image } from 'src/app/entity/Product';
import { AlertService } from 'src/app/services/alert.service';
import { ConfigManager } from 'src/app/services/config.service';
import { EventService } from 'src/app/services/event';
import { LoadingService } from 'src/app/services/loading.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-emailverification',
  templateUrl: './emailverification.page.html',
  styleUrls: ['./emailverification.page.scss'],
})
export class EmailverificationPage implements OnInit {

  private subscription: Subscription;
  
  constructor(  private router: Router,
    private route: ActivatedRoute,
    private userServices: UserService,
    public loading: LoadingService,
    private configManager: ConfigManager,
    public alertService: AlertService,
    public eventService: EventService) {
    
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
  data: any;
  public id: number;
  async ionViewWillEnter() {
    await this.onEnter();
  }

  ionViewWillLeave() {
    this.destroyevent();
  }

  ngOnDestroy(): void {
    this.destroyevent();
  }

  private destroyevent(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
  
  public async ngOnInit(): Promise<void> {
   
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url.includes("/emailverification")) {
      }
    });
  }

  public async onEnter(): Promise<void> {
    console.log("sdasadsd param1");
    this.data = await this.GetParams();
    
    // this.act =

    if (this.data.id != undefined) {
      this.id = this.data.id;
      console.log("sdasadsd param" + this.data.id);
    }

    this.bindData();
  }

  async bindData() {
 
    if(this.id){

      let obj = {
        Email_Verification: this.id
       };

      this.loading.present();
      let serv = (await this.userServices
        .emailValidation(obj))
        .subscribe((res) => {
          serv.unsubscribe();
          this.loading.dismiss();
          if (res[0].Result_Code == 1) {
            this.alertService.showOkay("You have verified your email.");
             
          } else {
            // this.alertService.showOkay("Please use Google Chrome or Safari to verify your email with this url.");
            this.alertService.showOkay(res[0].Message);
          }
      
        });
    }
   
  }

  tapContinue() {
    //this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);z
    this.alertService
    .showOkay( "Try one of these options Chrome/Safari/App to have a better experience on donationsg.","Improve Your Experience");
    this.eventService.logoutRefresh(false);
    this.router.navigate(["login"]);
  }

}
