import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ContactUs } from 'src/app/entity/ContactUs';
import { AlertService } from 'src/app/services/alert.service';
import { ConfigManager } from 'src/app/services/config.service';
import { EventService } from 'src/app/services/event';
import { GlobalService } from 'src/app/services/global.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PrivateMsgService } from 'src/app/services/privatemsg.service';


@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.page.html',
  styleUrls: ['./contactus.page.scss'],
})
export class ContactusPage  implements OnInit,OnDestroy {
  public formGroup: FormGroup;
  private subscription: Subscription;
  
  constructor(
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    private global: GlobalService,
    private pmService: PrivateMsgService,
    public loading: LoadingService,
    public obs: ContactUs,
    public alertService: AlertService,
    private configManager: ConfigManager,
    private eventService: EventService,
    private router: Router,
    private alertController:AlertController
  ) {
    this.formGroup = formBuilder.group({
      Name: ["", Validators.required],
      Email: ["", Validators.required],
      Contact_No: ["", Validators.required],
      Message: ["", Validators.required],
    });
  }

  isError(field: string, type: string = "") {
    if (type === undefined) {
      return (
        !this.formGroup.get(field).valid && this.formGroup.get(field).dirty
      );
    }
    return (
      this.formGroup.get(field).hasError(type) &&
      this.formGroup.get(field).dirty
    );
  }

  async ngOnInit() {
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url.includes("/contactus")) {
      }
    });
    
  }

  async ionViewWillEnter() {

    this.obs = new ContactUs();
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
  
  async tapSendMessage() {
    this.global.validateAllFormFields(this.formGroup);

    if (!this.formGroup.valid) {
      return;
    }
    this.alertService
    .show("Please confirm your message?", "", ["Cancel", "Confirm"])
    .pipe(
      switchMap((reply) => {
        if (reply == "Confirm") {
          return of(true);
        } else {
           
          return of(false);
        }
      })
    )
    .subscribe(async (reply) => {
      if (reply) { 
        this.loading.present();
       let serv = (await this.pmService.contactUs(this.obs)).subscribe((res) => {
          this.loading.dismiss();
          serv.unsubscribe();
          this.alertService.showOkay("Thanks for contacting us.");
        });

      
        this.obs= new ContactUs();
        this.formGroup =  this.formBuilder.group({
          Name: ["", Validators.required],
          Email: ["", Validators.required],
          Contact_No: ["", Validators.required],
          Message: ["", Validators.required],
        });
      }
    });
    

   
    // Object.keys(this.formGroup.controls).forEach((field) => {
    //   const control = this.formGroup.get(field);
    //   control.markAsTouched({ onlySelf: false });
    //   control.markAsDirty({ onlySelf: false });
    //   // control.markAsValid({ onlySelf: true });

    //   // control.markAsValid({ onlySelf: false });
    //   // this.formGroup.get(field).valid
    // });
    // this.formGroup.updateValueAndValidity();
 }


}
