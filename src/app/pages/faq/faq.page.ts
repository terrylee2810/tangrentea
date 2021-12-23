import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  Validators,
  FormGroup,
  AbstractControl,
} from "@angular/forms";

import { LoadingService } from "src/app/services/loading.service";
import { ConfigManager } from "src/app/services/config.service";
import { AlertService } from "src/app/services/alert.service";
import { ToastService } from "src/app/services/toast.service";
import { GlobalService } from "src/app/services/global.service";
import { UserSession } from "src/app/entity/UserSession";
import { Subscription, of } from "rxjs";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { Product, Product_Image } from "src/app/entity/Product";
import { ProductService } from "src/app/services/product.service";
import { catchError, switchMap } from "rxjs/operators";
import {
  NavController,
  ModalController,
  AlertController,
} from "@ionic/angular";
import { DropdownPageModule } from "src/app/modal/dropdown/dropdown.module";
import { DropdownPage } from "src/app/modal/dropdown/dropdown.page";
import { SwiperComponent, SwiperConfigInterface } from "ngx-swiper-wrapper";

@Component({
  selector: "app-faq",
  templateUrl: "./faq.page.html",
  styleUrls: ["./faq.page.scss"],
})
export class FaqPage implements OnInit, OnDestroy {
  @ViewChild("myCanvas") canvasEl: ElementRef;
  @ViewChild("swipertop") swipertop: SwiperComponent;

  public configbottom: SwiperConfigInterface = {};

  public configtop: SwiperConfigInterface = {};

  private subscription: Subscription;
  public formGroup: FormGroup;
  public act: string;
  public id: number;

  public DisplayUpload: boolean = true;
  public Count: number = 0;
  public editIndex: number = 0;



  public faq1: boolean = false;
  public faq2: boolean = false;
  public faq3: boolean = false;
  public faq4: boolean = false;
  public faq5: boolean = false;
  public faq6: boolean = false;
  public faq7: boolean = false;
  public faq8: boolean = false;
  public faq9: boolean = false;
  public faq10: boolean = false;

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
  

  constructor(
    public formBuilder: FormBuilder,
    public obs: Product,
    public obsUserSession: UserSession,
    public loading: LoadingService,
    private productServices: ProductService,
    private configManager: ConfigManager,
    public alertService: AlertService,
    private toastService: ToastService,
    private global: GlobalService,
    private router: Router,
    private sanitizer: DomSanitizer,
    public navCtrl: NavController,
    private route: ActivatedRoute,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController
  ) {
    // this.formGroup = formBuilder.group({
    //   Product_Name: ["", Validators.compose([Validators.required])],
    //   Category_Code: ["", Validators.compose([Validators.required])],
    //   Location_Code: ["", Validators.compose([Validators.required])],
    //   Description: ["", Validators.compose([Validators.required])],
    //   Meetup: ["", Validators.compose([Validators.required])],
    // });
  }

  async ionViewWillEnter() {
    // let fragment = this.route.snapshot.fragment;
    // setTimeout(() => {
    //   const element = document.getElementById(fragment);
    //   if (element != null) {
    //     element.scrollIntoView();
    //   }
    // }, 500);
    // this.obsImage = new Array<Product_Image>();
    // this.formGroup = this.formBuilder.group({
    //   Product_Name: ["", Validators.compose([Validators.required])],
    //   Category_Code: ["", Validators.compose([Validators.required])],
    //   Location_Code: ["", Validators.compose([Validators.required])],
    //   Description: ["", Validators.compose([Validators.required])],
    //   Meetup: ["", Validators.compose([Validators.required])],
    // });
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
      if (event instanceof NavigationEnd && event.url.includes("/orderonline")) {
      }
    });
  }
  canvasElement: any;

  public async onEnter(): Promise<void> {
    // this.data = await this.GetParams();
    this.bindData();
  }

  async bindData() {
    // if(this.id){
    //   this.loading.present();
    //   (await this.productServices
    //     .getProductData(this.obsUserSession.User_ID, this.id))
    //     .subscribe((res) => {
    //       this.loading.dismiss();
    //       if (res[0].Result_Code == 1) {
    //          
    //         this.obs = Object.assign(new Product(), res[0].Result[0]);
    //         this.obs.Is_Deleted= 0;
    //         for (var i = 0; i <  this.obs.Product_Image.length; i++) {
    //           let image: Product_Image = new Product_Image();
    //           image.imgURL = this.obs.Product_Image[i].Image_Path;
    //           image.Image_Url = this.obs.Product_Image[i].Image_Url;
    //           image.Image_Name = this.obs.Product_Image[i].Image_Name;
    //           this.obsImage.push(image);
    //         }
    //         if (this.obsImage.length == 4) {
    //         this.DisplayUpload = false;
    //         }
    //       } else {
    //         this.alertService.showOkay(res[0].Message);
    //       }
    //     });
    // }
  }
  tapCheckout() {
    //this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.router.navigate(["checkout2"]);
  }

  tapCloseTab(index){
    if(index == 1 ){
      this.faq1= !this.faq1;
    }
    if(index == 2 ){
      this.faq2= !this.faq2;
    }
    if(index == 3 ){
      this.faq3= !this.faq3;
    }
    if(index ==  4){
      this.faq4= !this.faq4;
    }
    if(index ==  5){
      this.faq5= !this.faq5;
    }
    if(index ==  6){
      this.faq6= !this.faq6;
    }
    if(index ==  7){
      this.faq7= !this.faq7;
    }
    if(index ==  8){
      this.faq8= !this.faq8;
    }
    if(index ==  9){
      this.faq9= !this.faq9;
    }
    if(index ==  10){
      this.faq10= !this.faq10;
    }
  }

}
