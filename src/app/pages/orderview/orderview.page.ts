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
import { Router, NavigationEnd, ActivatedRoute, NavigationExtras } from "@angular/router";
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
import { Cart, Cart_Detail, Category, DeliveryInfo, Order, Order_Detail_Category } from "src/app/entity/Cart";
import { OrderService } from "src/app/services/order.service";



// import Datepicker from 'path/to/node_modules/vanillajs-datepicker/js/Datepicker.js';
@Component({
  selector: "app-orderview",
  templateUrl: "./orderview.page.html",
  styleUrls: ["./orderview.page.scss"],
})
export class OrderviewPage implements OnInit, OnDestroy {
  @ViewChild("f") f: NgForm;
  @ViewChild("hiddenfileinputsingle") hiddenfileinputsingle: ElementRef;
  @ViewChild("hiddenfileinputsingle1") hiddenfileinputsingle1: ElementRef;
  private subscription: Subscription;
  obsOrder: Order = new Order();
  chkPaynow: boolean = false;
  chkBankTransfer: boolean = false;

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
    private orderService : OrderService
  ) {
    
  }

  async ionViewWillEnter() {
    this.obs = new User();
    this.chkPaynow = true;
    this.chkBankTransfer = false;
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
        event.url.includes("/orderview")
      ) {
      }
    });
  }
  data: any;
  public async onEnter(): Promise<void> {

    this.obs = new User();
    this.obsUserSession = await this.configManager.GetUser();


    this.data = await this.GetParams();
    if(this.data.act =="jx"){
        if(!'Admin;Admin1;Admin12;Admin2;Admin3;Admin123;'.includes(this.obsUserSession.Member_Type+';')){
          this.router.navigate(["home"]);
        }
    }
   
    this.refreshmenu();
    this.bindData();
  }

  public obsMenu:any[]; 

  async refreshmenu(){
    let tempMenu:any[]; 
    tempMenu = this.configManager.GetMenu();
    let idx;
    if(this.data.act =="jx"){
     idx = tempMenu.findIndex((x) => x.idx === 10);}
    else if(this.data.act =="dv"){
      idx = tempMenu.findIndex((x) => x.idx === 6);
    }else{
      idx = tempMenu.findIndex((x) => x.idx === 5);
    }
   

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
     
    this.obsOrder = new Order();
    if (this.data.id) {
      let obj = {
        Order_Id: this.data.id,
        Created_User : this.obsUserSession.User_ID
      };

      this.loading.present();
      let serv = (await this.orderService.getOrderByUser(obj)).subscribe((res) => {
         
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
    // this.formDetail();
  }

  signup() {
    this.router.navigate(['registermember']);
  }

  back() {
    this.router.navigate(['orderlist']);
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
      Order_ID: this.data.id,
      Authorizer_User: this.obsUserSession.User_ID,
      Receipt_Path1: this.obsOrder.Receipt_Path1,
      Receipt1_Base64:this.obsOrder.Receipt1_Base64,
    };
    this.loading.present();
    let serv = (await this.orderService.uploadreceiptbyuser1(obj)).subscribe((res) => {
      serv.unsubscribe();
      this.loading.dismiss();
      if (res[0].Result_Code == 1) {
        this.bindData();
        Swal.fire('Successful',"Receipt uploaded successfully.", "success");
        // this.router.navigate(["home"]);
        // this.configManager.SetUser(JSON.stringify(res[0].Result[0]));
        // this.eventService.publishFormRefresh();
      } else {
        this.alertService.showOkay(res[0].Message);
      }
     
    });
  }

  async onUploadReceipt() {
     
    let obj = {
      Order_ID: this.data.id,
      Authorizer_User: this.obsUserSession.User_ID,
      Receipt_Path: this.obsOrder.Receipt_Path,
      Receipt_Base64:this.obsOrder.Receipt_Base64,
    };
    this.loading.present();
    let serv = (await this.orderService.uploadreceiptbyuser(obj)).subscribe((res) => {
      serv.unsubscribe();
      this.loading.dismiss();
      if (res[0].Result_Code == 1) {
        this.bindData();
        Swal.fire('Successful',"Receipt uploaded successfully.", "success");
        // this.router.navigate(["home"]);
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

  async paymentreceived1(){

    let order_ids = new Array();
    order_ids.push(this.data.id);

    let obj = {
      Authorizer_User: this.obsUserSession.User_ID,
      Order_Ids: order_ids,
    };
  
    this.loading.present();
    let serv = (await this.orderService.paymentcompleted1(obj)).subscribe((res) => {
      serv.unsubscribe();
      this.loading.dismiss();
      if (res[0].Result_Code == 1) {
        this.bindData();
        Swal.fire('Successful',"Payment status updated successfully.", "success");
        // this.router.navigate(["home"]);
        // this.configManager.SetUser(JSON.stringify(res[0].Result[0]));
        // this.eventService.publishFormRefresh();
      } else {
        this.alertService.showOkay(res[0].Message);
      }
     
    });
  }

  async paymentreceived(){

    let order_ids = new Array();
    order_ids.push(this.data.id);

    let obj = {
      Authorizer_User: this.obsUserSession.User_ID,
      Order_Ids: order_ids,
    };
  
    this.loading.present();
    let serv = (await this.orderService.paymentcompleted(obj)).subscribe((res) => {
      serv.unsubscribe();
      this.loading.dismiss();
      if (res[0].Result_Code == 1) {
        this.bindData();
        Swal.fire('Successful',"Payment status updated successfully.", "success");
        // this.router.navigate(["home"]);
        // this.configManager.SetUser(JSON.stringify(res[0].Result[0]));
        // this.eventService.publishFormRefresh();
      } else {
        this.alertService.showOkay(res[0].Message);
      }
     
    });
  }

  editorder(){
    this.formDetail();
  }
  formDetail(){

debugger;
    const obs = new DeliveryInfo();
    obs.Cart = new Array<Cart>();
    obs.Cart_Total=0;
    obs.Order_ID =  this.obsOrder.Order_ID;
debugger;
    obs.Order_No =  this.obsOrder.Order_No;
    obs.Order_Status =  this.obsOrder.Order_Status;
    obs.Payment_Status =  this.obsOrder.Payment_Status;
    obs.Delivery_Status =  this.obsOrder.Delivery_Status;
    obs.Packaging_Status =  this.obsOrder.Packaging_Status;





debugger;
    obs.Billing_First_Name = this.obsOrder.Billing_First_Name;
    obs.Billing_Last_Name = this.obsOrder.Billing_Last_Name;
    obs.Billing_Company_Name = this.obsOrder.Billing_Company_Name;
    obs.Billing_Street_Address1 = this.obsOrder.Billing_Street_Address1;
    obs.Billing_Street_Address2 =  this.obsOrder.Billing_Street_Address2;
    obs.Billing_City = this.obsOrder.Billing_City;
    obs.Billing_Postcode = this.obsOrder.Billing_Postcode;
    obs.Billing_Phone = this.obsOrder.Billing_Phone;
    obs.Billing_Email = this.obsOrder.Billing_Email;
    obs.Billing_Country = this.obsOrder.Billing_Country;
    obs.Billing_Order_Note = this.obsOrder.Billing_Order_Note;
 

    obs.Shipping_First_Name = this.obsOrder.Shipping_First_Name;
    obs.Shipping_Last_Name = this.obsOrder.Shipping_Last_Name;
    obs.Shipping_Company_Name = this.obsOrder.Shipping_Company_Name;
    obs.Shipping_Street_Address1 =  this.obsOrder.Shipping_Street_Address1;
    obs.Shipping_Street_Address2 = this.obsOrder.Shipping_Street_Address2;
    obs.Shipping_City = this.obsOrder.Shipping_City;
    obs.Shipping_Postcode = this.obsOrder.Shipping_Postcode;
    obs.Shipping_Phone = this.obsOrder.Shipping_Phone;
    obs.Shipping_Email = this.obsOrder.Shipping_Email;
    obs.Shipping_Country = this.obsOrder.Shipping_Country;
    obs.Shipping_Order_Note = this.obsOrder.Shipping_Order_Note;



    obs.Pay_Upon_Collection = (this.obsOrder.Pay_Upon_Collection === 1 ? true : false);
    obs.Customise_Packaging =  this.obsOrder.Num_Customised;
    obs.Delivery_Date =  this.obsOrder.Delivery_Date;
    obs.Delivery_Time =  this.obsOrder.Delivery_Time + "";
    obs.Sales_Type =  this.obsOrder.Sales_Type;
    obs.Delivery_Type =  this.obsOrder.Shipping_Type;
    obs.Extra_Bag =  this.obsOrder.Extra_Bag_Int;
    debugger;
    obs.Is_Customise_Packaging =  (this.obsOrder.Is_Customised === 1 ? true : false) ;
    obs.Cart_Total =   this.obsOrder.Total;
   
    let distinctCart = new Set(
      this.obsOrder.Order_Detail.map((x) => x.Packaging_ID + "|||"+ x.Packaging_Name)
    );

    obs.Cart = new Array<Cart>();
    obs.Category = new Array<Category>();
    distinctCart.forEach((x) => {
      debugger;
      var splitted = x.split("|||"); 
      let ecCart: Cart;
      ecCart = new Cart();
      ecCart.Packaging_ID = splitted[0];
      ecCart.Packaging_Name = splitted[1];
      ecCart.Cart_Detail = new Array<Cart_Detail>();



      //Filter Out Packaging and Blinding
      const obs1 = this.obsOrder.Order_Detail.filter(
        (i) => i.Packaging_ID === ecCart.Packaging_ID
      );
      let carttotal : number= 0;
      
      obs1.forEach((l) => {
        let obsCart_Detail: Cart_Detail;
        obsCart_Detail = new Cart_Detail();
  
        obsCart_Detail.Packaging_ID =l.Packaging_ID;
        obsCart_Detail.Packaging_Name  =l.Packaging_Name;
        obsCart_Detail.Product_ID =l.Product_ID;
        obsCart_Detail.Category_Code =l.Category_Code;
        obsCart_Detail.Image_Path =l.Image_Path;
        obsCart_Detail.Product_Name =l.Product_Name;
        obsCart_Detail.Product_Name2 =l.Product_Name2;
        obsCart_Detail.Qty =l.Qty;
        obsCart_Detail.Before_Qty =l.Qty;
        obsCart_Detail.Price =l.Price;
        obsCart_Detail.Format_Price = l.Format_Price;
        carttotal = carttotal + l.Qty;
        ecCart.Qty = carttotal; 
        ecCart.Cart_Detail.push(obsCart_Detail);
      });

      obs.Cart.push(ecCart);
    });

    let cartstotal : number= 0;
    let itemQty : number= 0;
    obs.Cart.forEach((cart, index) => {
      itemQty= cart.Qty;
      if(cart.Qty==undefined){
        itemQty=0;
      }
      cartstotal += itemQty;
    });
    obs.Cart_Total = cartstotal;

    let distinctCategory = new Set(
      this.obsOrder.Order_Detail.map((x) => x.Category_Code)
    );
     
    distinctCategory.forEach((x) => {
      let ecCategory: Category;
      ecCategory = new Category();
      ecCategory.Category_Code = x;
      obs.Category.push(ecCategory);
    });

   
    this.configManager.SetOrderInfo(JSON.stringify(obs));
    let navigationExtras: NavigationExtras = {
      queryParams: {
        act: 'editorder',
      },
    };

    this.router.navigate(["checkout2"], navigationExtras);
  }
}
