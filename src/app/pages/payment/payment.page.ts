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
import { Order, OrderKey, Order_Detail_Category } from "src/app/entity/Cart";
import { OrderService } from "src/app/services/order.service";
import Swal from 'sweetalert2'
@Component({
  selector: "app-payment",
  templateUrl: "./payment.page.html",
  styleUrls: ["./payment.page.scss"],
})
export class PaymentPage implements OnInit, OnDestroy {
  @ViewChild("hiddenfileinputsingle") hiddenfileinputsingle: ElementRef;
  @ViewChild("hiddenfileinputsingle1") hiddenfileinputsingle1: ElementRef;

  private subscription: Subscription;
  public formGroup: FormGroup;
  public act: string;
  public id: number;

  obsOrder: Order = new Order();
  obsOrderKey: OrderKey;
  chkPaynow: boolean = false;
  chkBankTransfer: boolean = false;

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
    private orderServices: OrderService,
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
    this.chkPaynow = true;
    this.chkBankTransfer = false;
    this.obsUserSession = await this.configManager.GetUser();
    this.obsOrderKey = await this.configManager.GetOrderKey();
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
        event.url.includes("/orderonline")
      ) {
      }
    });
  }
  canvasElement: any;
  data: any;
  public async onEnter(): Promise<void> {
     
    // this.data = await this.GetParams();
    // this.obsOrder =  new Order();
     
    this.data = await this.GetParams();
    this.bindData();
  }

  async bindData() {
     
    if (this.data.id) {
      let obj = {
        Order_Url: this.data.id,
      };

      this.loading.present();
      let serv = (await this.orderServices.getOrder(obj)).subscribe((res) => {
         
        serv.unsubscribe();

        if (res[0].Result_Code == 1) {
           
          this.obsOrder = res[0].Result[0];
          this.formcategory();
          // this.obsOrder.Delivery_Date = formatDate(data._selected, "dd MMM yyyy", "en");
           
        } else {
          // this.alertService.showOkay("Please use Google Chrome or Safari to verify your email with this url.");
          this.alertService.showOkay(res[0].Message);
        }
        this.loading.dismiss();
      });
    }
  }

  category() {
     
    if (this.obsOrder.Order_Detail_Categories != undefined) {
      this.obsOrder.Order_Detail_Categories.forEach((x, index) => {
        //filter out Category
        this.obsOrder.Order_Detail_Categories[
          index
        ].Order_Detail = this.obsOrder.Order_Detail.filter(
          (i) => i.Category_Code === x.Category_Code
        );

        var sum = this.obsOrder.Order_Detail_Categories[
          index
        ].Order_Detail.reduce((acc, cur) => acc + cur.Sub_Total, 0);
        this.obsOrder.Order_Detail_Categories[index].Sub_Total = sum;
        this.obsOrder.Order_Detail_Categories[index].Format_Sub_Total =
          "$" + sum.toFixed(2);
      });
    }
     
    let a = "";
  }

  formcategory() {
     
    if (this.obsOrder.Order_Detail_Categories == undefined) {
      this.obsOrder.Order_Detail_Categories = Array<Order_Detail_Category>();
    }
    this.obsOrder.Order_Detail_Categories = Array<Order_Detail_Category>();
    let distinctCategory = new Set(
      this.obsOrder.Order_Detail.map((x) => x.Category_Code)
    );
     
    distinctCategory.forEach((x) => {
      let obsOrderDetailCategory: Order_Detail_Category;
      obsOrderDetailCategory = new Order_Detail_Category();
      obsOrderDetailCategory.Category_Code = x;
      this.obsOrder.Order_Detail_Categories.push(obsOrderDetailCategory);
    });

    this.category();
  }

  check_paynow() {
    if (this.chkPaynow == true) {
      this.chkBankTransfer = true;
      this.chkPaynow = false;
    } else {
      this.chkBankTransfer = false;
      this.chkPaynow = true;
    }
  }

  check_banktransfer() {
    if (this.chkBankTransfer == true) {
      this.chkPaynow = true;
      this.chkBankTransfer = false;
    } else {
      this.chkPaynow = false;
      this.chkBankTransfer = true;
    }
  }

  tapupload() {
    this.hiddenfileinputsingle.nativeElement.click();
  }

  tapuploaddiff() {
    this.hiddenfileinputsingle1.nativeElement.click();
  }
  
  edit2(files) {
    console.log("3");
    console.log(JSON.stringify(files));
    for (let file of files) {
      console.log("Only images are supported." + file.length);
      if (file.length === 0) return;

      var mimeType = file.type;
      if (mimeType.match(/image\/*/) == null) {
        console.log("Only images are supported.");
        return;
      }

      var reader = new FileReader();
    
      reader.readAsDataURL(file);
      reader.onload = async (_event: any) => {
        var picFile = _event.target;
        var image = new Image();
        image.src = picFile.result;

        var img = await this.resizeImage(image.src, 1000, 1000, 0.5);
        
        this.obsOrder.Receipt_Path1 = img;
        this.obsOrder.Receipt1_Base64 = img;
        this.onUploadReceipt1();

      };


      file.value = "";
    }
    this.hiddenfileinputsingle.nativeElement.value = null;
  }


  edit(files) {
    console.log("3");
    for (let file of files) {
      console.log("Only images are supported." + file);
      if (file.length === 0) return;

      var mimeType = file.type;
      if (mimeType.match(/image\/*/) == null) {
        console.log("Only images are supported.");
        return;
      }

      var reader = new FileReader();
    
      reader.readAsDataURL(file);
      reader.onload = async (_event: any) => {
        var picFile = _event.target;
        var image = new Image();
        image.src = picFile.result;

        var img = await this.resizeImage(image.src, 1000, 1000, 0.5);
        
        this.obsOrder.Receipt_Path = img;
        this.obsOrder.Receipt_Base64 = img;
        this.onUploadReceipt();

      };


      file.value = "";
    }
    this.hiddenfileinputsingle.nativeElement.value = null;
  }


  async onUploadReceipt1() {
     
    let obj = {
      Order_Url: this.data.id,
      Receipt_Path1: this.obsOrder.Receipt_Path1,
      Receipt1_Base64:this.obsOrder.Receipt1_Base64,
      Operated_By : this.obsUserSession.User_ID,
    };
    this.loading.present();
    let serv = (await this.orderServices.uploadreceipt1(obj)).subscribe((res) => {
      serv.unsubscribe();
      this.loading.dismiss();
      if (res[0].Result_Code == 1) {
        this.bindData();
        Swal.fire('Successful',"Receipt uploaded successfully.", "success");
        this.router.navigate(["home"]);
        // this.configManager.SetUser(JSON.stringify(res[0].Result[0]));
        // this.eventService.publishFormRefresh();
      } else {
        this.alertService.showOkay(res[0].Message);
      }
     
    });
  }

  async onUploadReceipt() {
     
    let obj = {
      Order_Url: this.data.id,
      Receipt_Path: this.obsOrder.Receipt_Path,
      Receipt_Base64:this.obsOrder.Receipt_Base64,
    };
    this.loading.present();
    let serv = (await this.orderServices.uploadreceipt(obj)).subscribe((res) => {
      serv.unsubscribe();
      this.loading.dismiss();
      if (res[0].Result_Code == 1) {
        Swal.fire('Successful',"Receipt uploaded successfully. Thanks you for ordering with us.", "success");
        this.router.navigate(["home"]);
        // this.configManager.SetUser(JSON.stringify(res[0].Result[0]));
        // this.eventService.publishFormRefresh();
      } else {
        this.alertService.showOkay(res[0].Message);
      }
     
    });
  }

  async resizeImage(
    img,
    MAX_WIDTH: number = 700,
    MAX_HEIGHT: number = 700,
    quality: number = 1
  ) {
    let promise = new Promise((resolve, reject) => {
      console.log("0");
      var canvas: any = document.createElement("canvas");
      var image = new Image();

      image.onload = () => {
        console.log("1");
        var width = image.width;
        var height = image.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");

        ctx.drawImage(image, 0, 0, width, height);

        // IMPORTANT: 'jpeg' NOT 'jpg'
        var dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        resolve(dataUrl);
        // callback(dataUrl)
      };
      image.src = img;
    });

    return await promise; // wait until the promise resolves (*)
  }
}
