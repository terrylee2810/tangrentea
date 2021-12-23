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
import {
  Router,
  NavigationEnd,
  ActivatedRoute,
  NavigationExtras,
} from "@angular/router";
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
import { Cart, Category, DeliveryInfo, Order, Order_Detail, Order_Detail_Category } from "src/app/entity/Cart";

//import Swal from 'sweetalert2'
import Swal from 'sweetalert2'

@Component({
  selector: "app-packaging",
  templateUrl: "./packaging.page.html",
  styleUrls: ["./packaging.page.scss"],
})
export class PackagingPage implements OnInit, OnDestroy {
  private subscription: Subscription;
  public formGroup: FormGroup;
  public act: string;
  public id: number;
  

  @ViewChild("chkSelfPickup") chkSelfPickup: ElementRef;
  @ViewChild("chkDelivery") chkDelivery: ElementRef;
  selfChecked: boolean = false;
  deliveryChecked: boolean = false;

  displayCartTotal: boolean = false;

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

  obsDeliveryInfo: DeliveryInfo;
  isLoaded: boolean = false;
  constructor(
    public formBuilder: FormBuilder,
    public obs: Product,
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
    public alertCtrl: AlertController,
  ) {}

  async ionViewWillEnter() {
    this.obsDeliveryInfo = await this.configManager.GetDeliveryInfo();
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
  data: any;
  public async onEnter(): Promise<void> {
    // this.data = await this.GetParams();
    this.data = await this.GetParams();
    if(this.data.act == "editorder"){
      this.obsDeliveryInfo = await this.configManager.GetOrderInfo();
    }else{
      this.obsDeliveryInfo = await this.configManager.GetDeliveryInfo();
    }

    this.isLoaded = false;
    this.bindData();
  }

  async bindData() {
 
    if (this.obsDeliveryInfo.Delivery_Type == "Self Pickup") {
      this.selfChecked = true;
      this.deliveryChecked = false;
    } else {
      this.selfChecked = false;
      this.deliveryChecked = true;
    }

    this.summary();
    this.isLoaded = true;
  }

  tapCheckout() {

    for (var i = 0; i <  this.obsDeliveryInfo.Cart.length; i++) {
       
      if(this.obsDeliveryInfo.Cart[i].Packaging_Name ==''){
        Swal.fire("Error", "Please fill in the packaging name for packaging [" +(i+1)+ "].", "error");
        return;
      }
      if(this.obsDeliveryInfo.Cart[i].Cart_Detail == undefined){
        Swal.fire("Error", "Please add the product to packaging [" +(i+1)+ "].", "error");
        return;
      }else if(this.obsDeliveryInfo.Cart[i].Cart_Detail.length < 1){
        Swal.fire("Error", "Please add the product to packaging [" +(i+1)+ "].", "error");
        return;
      }
    }

    if(this.obsDeliveryInfo.Cart_Total<2){
      Swal.fire("Error", "Customised packaging min order 2pcs.", "error");
      return;
    }



    if (this.obsDeliveryInfo.Delivery_Type == "Delivery") {
      if(this.obsOrder.Total<50){
        Swal.fire("Error", "[Special Packaging] Delivery min order $50.", "error");
        return;
      }
    }

    if(this.data.act == "editorder"){
      let navExtras: NavigationExtras = {
        queryParams: {
          act: "editorder"
        },
      };
      this.router.navigate(["checkout2"],navExtras);
    }
    else{
      this.router.navigate(["checkout2"]);
    }
   
  }
  onInput(event: any, qty) {
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
    if (parseInt(item.Qty) > 999) {
      item.Qty = 999;
    }
  }

  async updateQty(x) {
    if(this.obsDeliveryInfo.Cart[x].Cart_Detail== undefined){
      Swal.fire('Error',"Please add product to cart for "+ this.obsDeliveryInfo.Cart[x].Packaging_ID +".", "error");
      return
    }
    Swal.fire('Successful',"Succesfully update shopping cart.", "success");
    for (var i = 0; i < this.obsDeliveryInfo.Cart[x].Cart_Detail.length; i++) {
      this.obsDeliveryInfo.Cart[x].Cart_Detail[
        i
      ].Qty = this.obsDeliveryInfo.Cart[x].Cart_Detail[i].Before_Qty;
    }

    if(this.data.act == "editorder"){
      this.configManager.SetOrderInfo(JSON.stringify(this.obsDeliveryInfo));
    }else{
      this.configManager.SetDeliveryInfo(JSON.stringify(this.obsDeliveryInfo));
    }

    this.summary();
  }

  removeItem(x, i) {
    Swal.fire('Successful',"Succesfully update shopping cart.", "success");
    this.obsDeliveryInfo.Cart[x].Cart_Detail.splice(i, 1);
    if(this.data.act == "editorder"){
      this.configManager.SetOrderInfo(JSON.stringify(this.obsDeliveryInfo));
    }else{
      this.configManager.SetDeliveryInfo(JSON.stringify(this.obsDeliveryInfo));
    }
    this.summary();
  }

  subtotal(x, i) {
    let qty: number =
      this.obsDeliveryInfo.Cart[x].Cart_Detail[i].Qty === undefined
        ? 1
        : this.obsDeliveryInfo.Cart[x].Cart_Detail[i].Qty;
    if (qty < 1) {
      qty = 1;
    }
    return (
      "$" + (qty * this.obsDeliveryInfo.Cart[x].Cart_Detail[i].Price).toFixed(2)
    );
  }

  addProduct(x) {
    if(this.obsDeliveryInfo.Cart[x].Packaging_Name == ""){
      Swal.fire('Error',"Please enter the your packaging name for "+ this.obsDeliveryInfo.Cart[x].Packaging_ID +".", "error");
      return
    }
    let navExtras: NavigationExtras;
    if(this.data.act == "editorder"){
      navExtras = {
        queryParams: {
          id: x,
          act: "editorder"
        },
      };
      this.configManager.SetOrderInfo(JSON.stringify(this.obsDeliveryInfo));
    }else{
      navExtras = {
        queryParams: {
          id: x,
        },
      };
      this.configManager.SetDeliveryInfo(JSON.stringify(this.obsDeliveryInfo));
    }

    this.router.navigate(["orderonline"], navExtras);
  }

  obsOrder = new Order();
  summary() {
  
    this.obsOrder = new Order();
    if (this.obsOrder.Order_Detail == undefined) {
      this.obsOrder.Order_Detail = new Array<Order_Detail>();
    }
    if (this.obsDeliveryInfo.Cart != undefined) {
      for (var x = 0; x < this.obsDeliveryInfo.Cart.length; x++) {
        if (this.obsDeliveryInfo.Cart[x].Cart_Detail != undefined) {
          for (
            var i = 0;
            i < this.obsDeliveryInfo.Cart[x].Cart_Detail.length;
            i++
          ) {

            let addCode : string ="";
            let newCode : string =this.obsDeliveryInfo.Cart[x].Cart_Detail[i].Category_Code;
            if(addCode != newCode){

              let obsOrderDetailCategory : Order_Detail_Category;

              if( this.obsOrder.Order_Detail_Categories ==undefined){
                this.obsOrder.Order_Detail_Categories  = Array<Order_Detail_Category>();
              }
              obsOrderDetailCategory = new Order_Detail_Category();
              obsOrderDetailCategory.Category_Code =newCode;
         
              const exist = this.obsOrder.Order_Detail_Categories.findIndex(
                (f) =>
                  f.Category_Code ===
                  newCode
              );
              if (exist < 0) {
                this.obsOrder.Order_Detail_Categories.push(obsOrderDetailCategory);
              }
           

              addCode = newCode;
            }

            const exist = this.obsOrder.Order_Detail.findIndex(
              (f) =>
                f.Product_ID ===
                this.obsDeliveryInfo.Cart[x].Cart_Detail[i].Product_ID
            );

            let obsCart_Summary = new Order_Detail();
            obsCart_Summary.Product_ID = this.obsDeliveryInfo.Cart[
              x
            ].Cart_Detail[i].Product_ID;
            obsCart_Summary.Product_Name = this.obsDeliveryInfo.Cart[
              x
            ].Cart_Detail[i].Product_Name;
            obsCart_Summary.Product_Name2 = this.obsDeliveryInfo.Cart[
              x
            ].Cart_Detail[i].Product_Name2;
            obsCart_Summary.Category_Code = this.obsDeliveryInfo.Cart[x].Cart_Detail[
              i
            ].Category_Code;
            obsCart_Summary.Qty = this.obsDeliveryInfo.Cart[x].Cart_Detail[
              i
            ].Qty;
            obsCart_Summary.Price = this.obsDeliveryInfo.Cart[x].Cart_Detail[
              i
            ].Price;
            obsCart_Summary.Sub_Total =
              this.obsDeliveryInfo.Cart[x].Cart_Detail[i].Qty *
              this.obsDeliveryInfo.Cart[x].Cart_Detail[i].Price;
            obsCart_Summary.Format_Sub_Total =
              "$" + obsCart_Summary.Sub_Total.toFixed(2);
            if (exist > -1) {
              let qty: number;
              let price: number;
              qty = this.obsOrder.Order_Detail[exist].Qty + obsCart_Summary.Qty;

              this.obsOrder.Order_Detail[exist].Qty = qty;
              this.obsOrder.Order_Detail[exist].Sub_Total =
                qty * obsCart_Summary.Price;
              this.obsOrder.Order_Detail[exist].Format_Sub_Total =
                "$" + (qty * obsCart_Summary.Price).toFixed(2);
            } else {
              this.obsOrder.Order_Detail.push(obsCart_Summary);
            }
          }
        }
      }
    }

    let total: number = 0;
    this.obsOrder.Order_Detail.forEach(function (obsdet) {
      total = total + obsdet.Sub_Total;
    });
    this.obsOrder.Sub_Total = total;
    this.obsOrder.Format_Sub_Total = "$" + this.obsOrder.Sub_Total.toFixed(2);

    if (this.selfChecked == true) {
      this.obsOrder.Total = total;
    } else {
      this.obsOrder.Total = total + 20;
    }

    this.obsOrder.Format_Total = "$" + this.obsOrder.Total.toFixed(2);
     
    this.category();
  }

  check_self() {
    if (this.selfChecked == true) {
      this.deliveryChecked = true;
      this.selfChecked = false;
    }else{
      this.deliveryChecked = false;
      this.selfChecked = true;
      
    }
    this.summary();
  }

  check_delivery() {
    if (this.deliveryChecked == true) {
      this.selfChecked = true;
      this.deliveryChecked= false;
    }else{
      this.selfChecked = false;
      this.deliveryChecked= true;
    }
    this.summary();
  }

  category(){
     
    // let obsOrderDetailCategory : Order_Detail_Category;

    // if( this.obsOrder.Order_Detail_Categories ==undefined){
    //   this.obsOrder.Order_Detail_Categories  = Array<Order_Detail_Category>();
    // }

    // for (var i = 0; i < this.obsDeliveryInfo.Category.length; i++) {
    //   obsOrderDetailCategory = new Order_Detail_Category();
    //   obsOrderDetailCategory.Category_Code =this.obsDeliveryInfo.Category[i].Category_Code;
 
    //   this.obsOrder.Order_Detail_Categories.push(obsOrderDetailCategory);
    // }
    if( this.obsOrder.Order_Detail_Categories !=undefined){
      this.obsOrder.Order_Detail_Categories.forEach((x, index) => { 
        //filter out Category
        this.obsOrder.Order_Detail_Categories[index].Order_Detail=   this.obsOrder.Order_Detail.filter(i => i.Category_Code === x.Category_Code);

        var sum =  this.obsOrder.Order_Detail_Categories[index].Order_Detail.reduce((acc, cur) => acc + cur.Sub_Total, 0);
        this.obsOrder.Order_Detail_Categories[index].Sub_Total = sum;
        this.obsOrder.Order_Detail_Categories[index].Format_Sub_Total = "$" + sum.toFixed(2);
    
      })
      this.displayCartTotal = true;
    }else{
      this.displayCartTotal = false;
    }

  }

  addCustomisePackaging(){
      let obsCart = new Cart();
      obsCart.Packaging_ID = "Packaging " + (this.obsDeliveryInfo.Cart.length + 1);
      obsCart.Packaging_Name = "";
      this.obsDeliveryInfo.Cart.push(obsCart);
      this.obsDeliveryInfo.Customise_Packaging = this.obsDeliveryInfo.Cart.length;
      this.configManager.SetDeliveryInfo(JSON.stringify(this.obsDeliveryInfo));

  }

  removeCustomisePackaging(packagingID){

    if(this.obsDeliveryInfo.Cart.length >2){
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete customise packaging[" + packagingID +"]?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      })
      .then((okay) => {
         
        if (okay.isConfirmed) {
      
          const exist = this.obsDeliveryInfo.Cart.findIndex(
            (x) => x.Packaging_ID === packagingID
          );
          if (exist > -1) {
            this.obsDeliveryInfo.Cart.splice(exist,1)
          }
          let cartTtl: number = 0;
          this.obsDeliveryInfo.Cart.forEach((obj,index)=>{
            obj.Packaging_ID = "Packaging" + (index+1);
            let qty: number = 0;
            qty = obj.Qty;
            if(obj.Qty==undefined){
              qty=0;
            }
            cartTtl += qty;
          })
    debugger;
          this.obsDeliveryInfo.Customise_Packaging = this.obsDeliveryInfo.Cart.length;
          this.obsDeliveryInfo.Cart_Total = cartTtl;
          this.configManager.SetDeliveryInfo(JSON.stringify(this.obsDeliveryInfo));
        } else {
          // Swal.fire("s");
        }
      });







     }else{
      Swal.fire('Error',"Min 2 Customise Packaging.", "error");
    }
   
  }
 
}
