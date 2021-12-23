import { Component, OnInit, OnDestroy, Sanitizer, ElementRef, Input, ViewChild, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserSession } from 'src/app/entity/UserSession';
import { LoadingService } from 'src/app/services/loading.service';
import { UserService } from 'src/app/services/user.service';
import { ConfigManager } from 'src/app/services/config.service';
import { AlertService } from 'src/app/services/alert.service';
import { ToastService } from 'src/app/services/toast.service';
import { GlobalService } from 'src/app/services/global.service';
import { Router, NavigationEnd, NavigationExtras } from '@angular/router';
import { User } from 'src/app/entity/User';
import { PrivateMessage, PrivateMessageDet } from 'src/app/entity/PrivateMessage';
import { PrivateMsgService } from 'src/app/services/privatemsg.service';
import { DomSanitizer } from '@angular/platform-browser';
// import { FcmService } from 'src/app/services/fcm';
import { Product } from 'src/app/entity/Product';
import { ProductService } from 'src/app/services/product.service';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.page.html',
  styleUrls: ['./userlist.page.scss'],
})

export class UserlistPage implements OnInit, OnDestroy {
  @Input() name: string;
  @ViewChild('content') private content: any;
 

  private currentdate: string = formatDate(new Date(), 'yyyy/MMM/dd HH:mm:ss', 'en');
  private subscription: Subscription;
  public formGroup: FormGroup;
  isLoading:boolean=false;
  private currentpage:number = 0;
  obsProduct: Array<Product>;
  BoolUserList: boolean = true;
  // validation_messages = {
  //   Message: [{ type: "required", message: "cannot be blank." }]
  // };

  constructor(
    public formBuilder: FormBuilder,
    public obsUserSession: UserSession,
    public loading: LoadingService,
    private productService: ProductService,
    private configManager: ConfigManager,
    public alertService: AlertService,
    private toastService: ToastService,
    private global: GlobalService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private elementRef: ElementRef,
    // private fcmService: FcmService,
    private zone: NgZone
  ) {
   
    console.log("LOG DATE:" + this.currentdate);

  }

  scrollToBottom(init: boolean = false) {
    if (init) {
      setTimeout(() => {
        this.content.scrollToBottom(0);
      });
    } else {

      setTimeout(() => {
        this.content.scrollToBottom(300);
      });
    }
  }



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

  setStyle(value: string): void {
    this.elementRef.nativeElement.style.setProperty('--ion-var1', value);
  }


  public async ngOnInit(): Promise<void> {
    // await this.onEnter();
    // this.scrollToBottom();
    this.subscription = this.router.events.subscribe((event) => {
      // this.subscription.unsubscribe();
      if (event instanceof NavigationEnd && event.url.includes("/userlist")) {
        // console.log(event.url);
        // this.onEnter();
      }
    });
  }

  public async onEnter(): Promise<void> {
    this.currentpage = 0;
    //  this.fcmService.receiveMessage();
    console.log('calc(5px)               asdsa' + this.name);
    this.setStyle('calc(5px)');
    this.obsUserSession = await this.configManager.GetUser();


    console.log( 'calc(5px)xxxxxxxxxxxxxxxxxx' +  this.obsUserSession.Profile_Image_Path)
  
    this.bindData();
  }

  async bindData() {
    if(this.isLoading == true) return;
    this.isLoading = true;
    // this.obsUser.User_ID = this.obsUserSession.User_ID;
    this.loading.dismiss();
    this.loading.present();
    let serv = (await this.productService.getUserProductLists(this.obsUserSession.User_ID, this.currentpage, this.currentdate)).subscribe((res) => {
      serv.unsubscribe();
      this.loading.dismiss();
      this.isLoading = false;
      if (res[0].Result_Code == 1) {
        
        this.obsProduct = res[0].Result;
        this.BoolUserList =true;
      } else {
          
        if(res[0].Message == "no record" &&  this.currentpage> 1 ){
          this.alertService.showOkay(res[0].Message);
        }else if(res[0].Message != "no record"){
          this.alertService.showOkay(res[0].Message);
        }
        this.BoolUserList =false;
        // this.alertService.showOkay(res[0].Message);
      }
      console.log('asdasd1');
      // this.scrollToBottom(true);
    });
  }

  async loadData(event, refresh: boolean=false) {
    this.currentpage = this.currentpage + 1;
    if(refresh){
      this.currentdate = formatDate(new Date(), 'yyyy/MMM/dd HH:mm:ss', 'en');
      this.currentpage = 0;
    }
  
    let serv = (await this.productService.getUserProductLists(this.obsUserSession.User_ID, this.currentpage, this.currentdate)).subscribe((res) => {
      serv.unsubscribe();
      if (res[0].Result_Code == 1) {
        if(refresh){
          this.obsProduct = res[0].Result;
        }else{
          this.obsProduct = this.obsProduct.concat(res[0].Result);
        }

       
        console.log(this.obsProduct);
      
      } else {
        this.alertService.showOkay(res[0].Message);
        
      }
      this.isLoading = false;
      event.target.complete();
     
    });
    
  }

  showImage(path) {
    // console.log(path);
    const sanitizedContent = this.sanitizer.bypassSecurityTrustUrl(path);
    return sanitizedContent;
  }

  isError(field: string, type: string='') {
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
  
  tapEdit(events:Product) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        act: 'edit',
        id: events.Product_ID
      }
    };
    this.router.navigate(['productentry'], navigationExtras);
    console.log("test");
  }
}

  // toggleMenu() {
  //   const splitPane = document.querySelector('ion-split-pane');
  //   const windowWidth = window.innerWidth;
  //   const splitPaneShownAt = 992;
  //   const when = `(min-width: ${splitPaneShownAt}px)`;
  //   if (windowWidth >= splitPaneShownAt) {
  //     // split pane view is visible
  //     const open = splitPane.when === when;
  //     splitPane.when = open ? false : when;
  //   } else {
  //     // split pane view is not visible
  //     // toggle menu open
  //     const menu = splitPane.querySelector('ion-menu');
  //     return menu.open();
  //   }
  // }
  