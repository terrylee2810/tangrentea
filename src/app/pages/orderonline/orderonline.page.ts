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
import {
  Categories_Product,
  Category_Product,
  Product,
  Product_Image,
} from "src/app/entity/Product";
import { ProductService } from "src/app/services/product.service";
import { catchError, switchMap } from "rxjs/operators";
import {
  NavController,
  ModalController,
  AlertController,
  IonSlides,
} from "@ionic/angular";
import { DropdownPageModule } from "src/app/modal/dropdown/dropdown.module";
import { DropdownPage } from "src/app/modal/dropdown/dropdown.page";
import { SwiperComponent, SwiperConfigInterface } from "ngx-swiper-wrapper";
import { debugOutputAstAsTypeScript } from "@angular/compiler";
import { Cart, Cart_Detail, Category, DeliveryInfo } from "src/app/entity/Cart";
import Swal from 'sweetalert2';
import { connectableObservableDescriptor } from "rxjs/internal/observable/ConnectableObservable";
import { EventService } from "src/app/services/event";
@Component({
  selector: "app-orderonline",
  templateUrl: "./orderonline.page.html",
  styleUrls: ["./orderonline.page.scss"],
})
export class OrderOnlinePage implements OnInit, OnDestroy {
  cart: Cart;
  obsCategoriesProduct: Categories_Product;
  private subscription: Subscription;
  public formGroup: FormGroup;
  public act: string;
  public id: number;
  isLoaded: boolean = false;

  slideOpts = {
    initialSlide: 0,
    speed: 500,
    autoplay: true,
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
  };

  public AngEe = "Ang Ee";
  public TiongKu = "Tiong Ku";
  public BabyShower = "Baby Shower";
  public AngJi = "Ang Ji";

  public ExcludeMin =  "Ang Ee;Tiong Ku;Baby Shower;Ang Ji;";

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
  data: any;
  totalqty: number;
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
    public alertCtrl: AlertController,
    private element: ElementRef,
    private eventService: EventService
  ) {}

  async ionViewWillEnter() {
    debugger;
    this.isLoaded = false;

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
  public Packaging_Name: string;
  public async onEnter(): Promise<void> {
    // this.data = await this.GetParams();
    this.data = await this.GetParams();
    if (this.data.act == "editorder") {
      this.obsDeliveryInfo = await this.configManager.GetOrderInfo();
    } else {
      this.obsDeliveryInfo = await this.configManager.GetDeliveryInfo();
    }

    this.Packaging_Name =
      this.obsDeliveryInfo.Cart[this.data.id].Packaging_ID +
      "[ " +
      this.obsDeliveryInfo.Cart[this.data.id].Packaging_Name +
      " ]";
    this.bindData();
  }

  obsProduct: Array<Product>;
  async bindData() {
    debugger;
    let Is_WholeSales_Price: number = 0;
    if (this.obsDeliveryInfo.Sales_Type == "Whole-Sales") {
      Is_WholeSales_Price = 1;
    }
    let obj = {
      Delivery_Date: this.obsDeliveryInfo.Delivery_Date,
      Is_WholeSales_Price: Is_WholeSales_Price,
    };

    this.loading.dismiss();
    this.loading.present();

    debugger;
    let serv = (await this.productServices.GetProductOnlineList(obj)).subscribe(
      (res) => {
        debugger;
        serv.unsubscribe();
        this.loading.dismiss();

        if (res[0].Result_Code == 1) {
          this.obsProduct = res[0].Result;
          this.matchQty();
          this.category();
          // this.BoolUserList =true;
        } else {
          // if(res[0].Message == "no record" &&  this.currentpage> 1 ){
          //   this.alertService.showOkay(res[0].Message);
          // }else
          if (res[0].Message != "no record") {
            this.alertService.showOkay(res[0].Message);
          }
          // this.BoolUserList =false;
        }
        this.isLoaded = true;
      }
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

  onKeyUp(item, x) {
    debugger;
    if (item.Qty > 0) {

      let PackagingQty = 0;
      for (var h = 0; h < this.obsDeliveryInfo.Cart.length; h++) {
        if(h != this.data.id &&  this.obsDeliveryInfo.Cart[h].Cart_Detail != undefined){
          let obsCartDetail = new Array<Cart_Detail>();
          obsCartDetail = this.obsDeliveryInfo.Cart[h].Cart_Detail.filter(
            (i) => i.Product_ID === item.Product_ID
          );
  
          obsCartDetail.forEach((obj, index) => {
            PackagingQty += obj.Qty;
          });
        }
      }
      debugger;
      let ttlPackagingQty = item.Ordered_Qty + PackagingQty + item.Qty;
      if (ttlPackagingQty > item.Daily_Qty && item.Daily_Qty>0 && this.data?.act != 'editorder') {
      

        let leftQty = (item.Ordered_Qty + ttlPackagingQty) - item.Daily_Qty ;
        Swal.fire(
          "Error",
          "[" +
            item.Category_Code +
            "] " +
            item.Product_Name +
            ": Out of Stock",
          "error"
        );
        // if(leftQty<1){
         
        // }else{
        //   Swal.fire(
        //     "Error",
        //     "[" +
        //       item.Category_Code +
        //       "] " +
        //       item.Product_Name +
        //       " available qty: " +
        //       leftQty +
        //       "pcs.",
        //     "error"
        //   );
        // }
       
        item.Qty = 0;
      } else {
        if(this.AngEe == item.Internal_Code){
          // this.obsCategoriesProduct.Category_Product[index].Product =
          let lst = this.obsProduct.filter((i) => i.Internal_Code ===this.AngEe);
          let lstqty = 0;
          lst.forEach((obj, index) => {
            lstqty += obj.Qty;
          });
  
          // alert("AngEe:" + lstqty);
          if(lstqty<12){
            Swal.fire(
              "Error",
              "[" +
                item.Category_Code +
                "] " +
                // item.Product_Name +
                "Ang Ee min 12 pcs.",
              "error"
            );
            item.Qty = (12-(lstqty- item.Qty));
          }
        } else if(this.TiongKu == item.Internal_Code){
          // this.obsCategoriesProduct.Category_Product[index].Product =
          let lst = this.obsProduct.filter((i) => i.Internal_Code ===this.TiongKu);
          let lstqty = 0;
          lst.forEach((obj, index) => {
            lstqty += obj.Qty;
          });
  
          // alert("TiongKu:" + lstqty);
          if(lstqty<12){
            Swal.fire(
              "Error",
              "[" +
                item.Category_Code +
                "] " +
                // item.Product_Name +
                "Tiong Ku min 12 pcs.",
              "error"
            );
            item.Qty = (12-(lstqty- item.Qty));
          }
        } else if(this.BabyShower == item.Internal_Code){
          // this.obsCategoriesProduct.Category_Product[index].Product =
          let lst = this.obsProduct.filter((i) => i.Internal_Code ===this.BabyShower);
          let lstqty = 0;
          lst.forEach((obj, index) => {
            lstqty += obj.Qty;
          });
  
          // alert("BabyShower:" + lstqty);
          if(lstqty<10){
            Swal.fire(
              "Error",
              "[" +
                item.Category_Code +
                "] " +
                // item.Product_Name +
                "Baby Shower min 10 sets.",
              "error"
            );
            item.Qty = (10-(lstqty- item.Qty));
          }
        } else if(this.AngJi == item.Internal_Code){
          // this.obsCategoriesProduct.Category_Product[index].Product =
          let lst = this.obsProduct.filter((i) => i.Internal_Code ===this.AngJi);
          let lstqty = 0;
          lst.forEach((obj, index) => {
            lstqty += obj.Qty;
          });
  
          // alert("AngJi:" + lstqty);
          if(lstqty<10){
            Swal.fire(
              "Error",
              "[" +
                item.Category_Code +
                "] " +
                // item.Product_Name +
                "Ang Ji min 10 pcs.",
              "error"
            );
            item.Qty = (10-(lstqty- item.Qty));
          }
      
        }

        if (item.Min_Qty > item.Qty && !this.ExcludeMin.includes(item.Internal_Code)) {
          Swal.fire(
            "Error",
            "[" +
              item.Category_Code +
              "] " +
              item.Product_Name +
              " min " +
              item.Min_Qty +
              "pcs.",
            "error"
          );
          item.Qty = item.Min_Qty;
        }




      }
    }
    if (parseInt(item.Qty) > 999) {
      item.Qty = 999;
    }

    this.calcategory(x);
  }

  addtoCart() {
    Swal.fire("Successful", "Succesfully update shopping cart.", "success");

    if (this.obsDeliveryInfo.Cart[this.data.id].Cart_Detail == undefined) {
      this.obsDeliveryInfo.Cart[this.data.id].Cart_Detail =
        new Array<Cart_Detail>();
    }

    let total: number = 0;
    this.obsCategoriesProduct.Category_Product.forEach((x, index) => {
      this.obsCategoriesProduct.Category_Product[index].Product.forEach(
        (eachCategoryProduct, index) => {
          const exist = this.obsDeliveryInfo.Cart[
            this.data.id
          ].Cart_Detail.findIndex(
            (x) =>
              x.Product_ID === eachCategoryProduct.Product_ID &&
              x.Packaging_ID ===
                this.obsDeliveryInfo.Cart[this.data.id].Packaging_ID
          );

          if (
            eachCategoryProduct.Qty != undefined &&
            eachCategoryProduct.Qty > 0
          ) {
            let obsCartDetail: Cart_Detail = new Cart_Detail();
            obsCartDetail.Packaging_ID =
              this.obsDeliveryInfo.Cart[this.data.id].Packaging_ID;
            obsCartDetail.Packaging_Name =
              this.obsDeliveryInfo.Cart[this.data.id].Packaging_Name;
            obsCartDetail.Image_Path = eachCategoryProduct.Image_Path;
            obsCartDetail.Product_ID = eachCategoryProduct.Product_ID;
            obsCartDetail.Product_Name = eachCategoryProduct.Product_Name;
            obsCartDetail.Product_Name2 = eachCategoryProduct.Product_Name2;
            obsCartDetail.Category_Code = eachCategoryProduct.Category_Code;

            obsCartDetail.Qty = eachCategoryProduct.Qty;
            obsCartDetail.Before_Qty = eachCategoryProduct.Qty;
            obsCartDetail.Price = eachCategoryProduct.Price;
            obsCartDetail.Format_Price = eachCategoryProduct.Format_Price;
            total += obsCartDetail.Qty;
            if (exist > -1) {
              this.obsDeliveryInfo.Cart[this.data.id].Cart_Detail[exist] =
                obsCartDetail;
            } else {
              this.obsDeliveryInfo.Cart[this.data.id].Cart_Detail.push(
                obsCartDetail
              );
            }
            this.obsDeliveryInfo.Cart[this.data.id].Qty = total;
          } else {
            if (exist > -1) {
              this.obsDeliveryInfo.Cart[this.data.id].Qty = 0;
              this.obsDeliveryInfo.Cart[this.data.id].Cart_Detail.splice(
                exist,
                1
              );
            }
          }
        }
      );
    });

    let carQty: number = 0;
    let detQty: number = 0;
    this.obsDeliveryInfo.Cart[this.data.id].Cart_Detail.forEach(
      (det, index) => {
        debugger;
        detQty = det.Qty;
        if (det.Qty == undefined) {
          detQty = 0;
        }
        carQty = carQty + detQty;
      }
    );
    this.obsDeliveryInfo.Cart[this.data.id].Qty = carQty;
    debugger;

    total = 0;
    let itemQty: number = 0;
    if (this.obsDeliveryInfo != undefined) {
      this.obsDeliveryInfo.Cart.forEach((cart, index) => {
        debugger;
        itemQty = cart.Qty;
        if (cart.Qty == undefined) {
          itemQty = 0;
        }
        total += itemQty;
        itemQty = 0;
      });
    }
    this.obsDeliveryInfo.Cart_Total = total;
    this.eventService.notificationRefresh(total);

    if (this.data.act == "editorder") {
      this.configManager.SetOrderInfo(JSON.stringify(this.obsDeliveryInfo));
    } else {
      this.configManager.SetDeliveryInfo(JSON.stringify(this.obsDeliveryInfo));
    }

    if (this.obsDeliveryInfo.Is_Customise_Packaging === true) {
      if (this.obsDeliveryInfo.Cart[this.data.id].Qty < 5) {
        Swal.fire("Error", "[Packaging] Min 5pcs.", "error");
        return;
      }

      if (this.data.act == "editorder") {
        let navExtras: NavigationExtras = {
          queryParams: {
            act: "editorder",
          },
        };
        this.router.navigate(["packaging"], navExtras);
      } else {
        this.router.navigate(["packaging"]);
      }
    } else {
      if (total < 1) {
        Swal.fire("Error", "You have no items in your cart.", "error");
        return;
      }

      let isBool = this.verification();
      if (isBool == false) {
        return;
      }

      if (this.data.act == "editorder") {
        let navigationExtras: NavigationExtras = {
          queryParams: {
            act: "editorder",
          },
        };

        this.router.navigate(["checkout2"], navigationExtras);
      } else {
        this.router.navigate(["checkout2"]);
      }
    }
  }

  verification() {
    let isBool: boolean = true;
    let obsCartDetail = new Array<Cart_Detail>();
    let qtyByCategory: number = 0;
    let totalByCategory: number = 0;
    let shouldSkip: boolean = false;
    this.obsDeliveryInfo.Category.forEach((obsCategory, index) => {
      if (shouldSkip) {
        return;
      }

      obsCartDetail = this.obsDeliveryInfo.Cart[
        this.data.id
      ].Cart_Detail.filter(
        (i) => i.Category_Code === obsCategory.Category_Code
      );
      obsCartDetail.forEach((cartDet, index) => {
        qtyByCategory += cartDet.Qty;
        totalByCategory += cartDet.Qty * cartDet.Price;
      });

      if (obsCartDetail.length < 1) {
        return;
      }
      if (obsCategory.Category_Code == "Ang Ku Kueh") {
        if (
          this.obsDeliveryInfo.Delivery_Type == "Self Pickup" &&
          qtyByCategory < 10
        ) {
          Swal.fire("Error", "[Ang Ku Kueh] Self pickup min order 10 pcs.", "error");
          isBool = false;
          shouldSkip = true;
          return;
        } else if (
          this.obsDeliveryInfo.Delivery_Type == "Delivery" &&
          totalByCategory < 50
        ) {
          Swal.fire("Error", "[Ang Ku Kueh] Delivery min order $50.", "error");
          isBool = false;
          shouldSkip = true;
          return;
        }
      } else if (obsCategory.Category_Code == "Made To Order") {
        if (
          this.obsDeliveryInfo.Delivery_Type == "Self Pickup" &&
          totalByCategory < 12
        ) {
          Swal.fire("Error", "[Made To Order] Self pickup min order $12.", "error");
          isBool = false;
          shouldSkip = true;
          return;
        } else if (
          this.obsDeliveryInfo.Delivery_Type == "Delivery" &&
          totalByCategory < 60
        ) {
          Swal.fire("Error", "[Made To Order] Delivery min order $60.", "error");
          isBool = false;
          shouldSkip = true;
          return;
        }
      } else if (obsCategory.Category_Code == "Baby Shower") {
        if (qtyByCategory < 10) {
          Swal.fire("Error", "[Baby Shower] Min order 10sets.", "error");
          isBool = false;
          shouldSkip = true;
          return;
        }
      } else if (obsCategory.Category_Code == "Seasonal Kueh") {
        if (
          this.obsDeliveryInfo.Delivery_Type == "Self Pickup" &&
          totalByCategory < 10
        ) {
          Swal.fire("Error", "[Seasonal Kueh] Self pickup min order $10.", "error");
          isBool = false;
          shouldSkip = true;
          return;
        } else if (
          this.obsDeliveryInfo.Delivery_Type == "Delivery" &&
          totalByCategory < 50
        ) {
          Swal.fire("Error", "[Seasonal Kueh] Delivery min order $50.", "error");
          isBool = false;
          shouldSkip = true;
          return;
        }
      }

      qtyByCategory = 0;
      totalByCategory = 0;
    });
    return isBool;
  }

  subtotal(x, i) {
    let qty: number =
      this.obsCategoriesProduct.Category_Product[x].Product[i].Qty === undefined
        ? 0
        : this.obsCategoriesProduct.Category_Product[x].Product[i].Qty;

    if (qty < 1) {
      qty = 0;
    }

    return (
      "$" +
      (
        qty * this.obsCategoriesProduct.Category_Product[x].Product[i].Price
      ).toFixed(2)
    );
  }

  calcategory(x) {
    let qty: number = 0;
    let total: number = 0;
    this.obsCategoriesProduct.Category_Product[x].Product.forEach((pro) => {
      qty += pro.Qty;
      total += pro.Qty * pro.Price;
    });

    this.obsCategoriesProduct.Category_Product[x].Total_Qty = qty;
    this.obsCategoriesProduct.Category_Product[x].Total = total;
    this.obsCategoriesProduct.Category_Product[x].Format_Total =
      "$" + this.obsCategoriesProduct.Category_Product[x].Total.toFixed(2);
  }

  category() {
    let obsCategoryProduct: Category_Product;
    this.obsCategoriesProduct = new Categories_Product();
    // if (this.obsCategoriesProduct == undefined) {
    //   this.obsCategoriesProduct = new Categories_Product();
    // }

    for (var i = 0; i < this.obsDeliveryInfo.Category.length; i++) {
      obsCategoryProduct = new Category_Product();
      obsCategoryProduct.Category_Code =
        this.obsDeliveryInfo.Category[i].Category_Code;
      obsCategoryProduct.Total_Qty = 0;
      obsCategoryProduct.Total = 0;
      obsCategoryProduct.Format_Total = "$" + (0).toFixed(2);
      if (this.obsCategoriesProduct.Category_Product == undefined) {
        this.obsCategoriesProduct.Category_Product = Array<Category_Product>();
      }

      this.obsCategoriesProduct.Category_Product.push(obsCategoryProduct);
    }

    this.obsCategoriesProduct.Category_Product.forEach((x, index) => {
      //filter out Category
      this.obsCategoriesProduct.Category_Product[index].Product =
        this.obsProduct.filter((i) => i.Category_Code === x.Category_Code);
      this.calcategory(index);
    });
  }

  matchQty() {
    if (this.obsDeliveryInfo.Cart[this.data.id].Cart_Detail != undefined) {
      for (
        var x = 0;
        x < this.obsDeliveryInfo.Cart[this.data.id].Cart_Detail.length;
        x++
      ) {
        for (var i = 0; i < this.obsProduct.length; i++) {
          if (
            this.obsDeliveryInfo.Cart[this.data.id].Cart_Detail[x].Product_ID ==
            this.obsProduct[i].Product_ID
          ) {
            this.obsProduct[i].Qty =
              this.obsDeliveryInfo.Cart[this.data.id].Cart_Detail[x].Qty;
          }
        }
      }
    }
  }

  next(slide, index) {
    debugger;
    // alert(index);
    let videoPlayer = document.getElementById(slide);
    videoPlayer["swiper"].slideTo(index, 2000);
  }
}
