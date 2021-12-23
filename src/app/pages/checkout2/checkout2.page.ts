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
  NgForm,
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
import { catchError, switchMap } from "rxjs/operators";
import {
  NavController,
  ModalController,
  AlertController,
} from "@ionic/angular";
import { DropdownPageModule } from "src/app/modal/dropdown/dropdown.module";
import { DropdownPage } from "src/app/modal/dropdown/dropdown.page";
import { SwiperComponent, SwiperConfigInterface } from "ngx-swiper-wrapper";
import {
  Cart_Detail,
  DeliveryInfo,
  Order,
  OrderKey,
  Order_Detail,
  Order_Detail_Category,
} from "src/app/entity/Cart";
import { OrderService } from "src/app/services/order.service";
import Swal from 'sweetalert2';
import { PostcodeService } from "src/app/services/postcode.service";
import { Postcode } from "src/app/entity/Postcode";
import { EventService } from "src/app/services/event";
import { formatDate } from "@angular/common";
@Component({
  selector: "app-checkout2",
  templateUrl: "./checkout2.page.html",
  styleUrls: ["./checkout2.page.scss"],
})
export class Checkout2Page implements OnInit, OnDestroy {
  public selectedMoment = new Date();
  timeSel = [
    {
      Code: "8",
      Name: "8.00AM-9.00AM",
      visible: false,
      self: false,
      delivery: false,
    },
    {
      Code: "9",
      Name: "9.00AM-10.00AM",
      visible: false,
      self: false,
      delivery: false,
    },
    {
      Code: 10,
      Name: "10.00AM-11.00AM",
      visible: true,
      self: false,
      delivery: false,
    },
    {
      Code: 11,
      Name: "11.00AM-12.00PM",
      visible: true,
      self: true,
      delivery: false,
    },
    {
      Code: 12,
      Name: "12.00PM-1.00PM",
      visible: true,
      self: true,
      delivery: false,
    },
    {
      Code: 13,
      Name: "1.00PM-2.00PM",
      visible: true,
      self: true,
      delivery: false,
    },
    {
      Code: 14,
      Name: "2.00PM-3.00PM",
      visible: true,
      self: true,
      delivery: true,
    },
    {
      Code: 15,
      Name: "3.00PM-4.00PM",
      visible: true,
      self: true,
      delivery: true,
    },
    {
      Code: 16,
      Name: "4.00PM-5.00PM",
      visible: true,
      self: false,
      delivery: true,
    },
  ];

  paymentSel = [
    { Code: "Pending", Name: "Pending" },
    { Code: "In-Progress", Name: "In-Progress" },
    { Code: "Completed", Name: "Completed" },
  ];

  orderSel = [
    { Code: "In-Progress", Name: "In-Progress" },
    { Code: "Completed", Name: "Completed" },
    { Code: "Suspended", Name: "Suspended" },
  ];

  statusSel = [
    { Code: "In-Progress", Name: "In-Progress" },
    { Code: "Completed", Name: "Completed" },
  ];

  private subscription: Subscription;

  public requiredBilling: boolean = false;

  public act: string;
  public id: number;
  @ViewChild("f") f: NgForm;
  error_messages = {
    Billing_First_Name: { required: "cannot be blank." },
    Billing_Last_Name: { required: "cannot be blank." },
    Billing_Company_Name: { required: "cannot be blank." },
    Billing_Street_Address1: { required: "cannot be blank." },
    Billing_Street_Address2: { required: "cannot be blank." },
    Billing_City: { required: "cannot be blank." },
    Billing_Postcode: { required: "cannot be blank.", min: "min 6 digits.", max: "max 6 digits." },
    Billing_Country: { required: "cannot be blank." },
    Billing_Phone: { required: "cannot be blank.", min: "min 8 digits.", max: "max 8 digits." },
    Billing_Email: { required: "cannot be blank.",invalid_email: "invalid email."  },
    Billing_Order_Note: { required: "cannot be blank." },
    Shipping_First_Name: { required: "cannot be blank." },
    Shipping_Last_Name: { required: "cannot be blank." },
    Shipping_Company_Name: { required: "cannot be blank." },
    Shipping_Street_Address1: { required: "cannot be blank." },
    Shipping_Street_Address2: { required: "cannot be blank." },
    Shipping_City: { required: "cannot be blank." },
    Shipping_Postcode:{ required: "cannot be blank.", min: "min 6 digits.", max: "max 6 digits." },
    Shipping_Phone: { required: "cannot be blank.", min: "min 8 digits.", max: "max 8 digits."  },
    Shipping_Email: { required: "cannot be blank.",invalid_email: "invalid email."  },
    Shipping_Order_Note: { required: "cannot be blank." },
    Shipping_Country: { required: "cannot be blank." },
  };

  obsDeliveryInfo: DeliveryInfo;
  selfChecked: boolean = false;
  deliveryChecked: boolean = false;
  chkShipping: boolean = false;
  obsOrder = new Order();
  isLoaded: boolean = false;

  chkPaymentReceivedYes: boolean = true;
  chkPaymentReceivedNo: boolean = false;

  chkPaymentCollectionYes: boolean = false;
  chkPaymentCollectionNo: boolean = true;

  chkExtraPlasticYes: boolean = false;
  chkExtraPlasticNo: boolean = true;

  obsPostcode: Array<Postcode>;
  constructor(
    public formBuilder: FormBuilder,
    public obsUserSession: UserSession,
    public loading: LoadingService,
    private orderService: OrderService,
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
    private postcodeService: PostcodeService,
    private eventService: EventService
  ) {}

  async ionViewWillEnter() {
    await this.onEnter();
  }

  
  onPaste(event: any) {
    return false;
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
      if (event instanceof NavigationEnd && event.url.includes("/checkout2")) {
      }
    });
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
  public async onEnter(): Promise<void> {
    debugger;
    this.data = await this.GetParams();
    if (this.data.act == "editorder") {
      this.obsDeliveryInfo = await this.configManager.GetOrderInfo();
    } else {
      this.obsDeliveryInfo = await this.configManager.GetDeliveryInfo();
    }

    if (this.obsDeliveryInfo.Cart == undefined) {
      this.router.navigate(["delivery"]);
      return;
    }

    if (this.obsDeliveryInfo.Sales_Type == "Walk-In") {
      this.requiredBilling = false;
    } else {
      this.requiredBilling = true;
    }

    this.obsUserSession = await this.configManager.GetUser();

    // this.obsOrder.Shipping_Amount = 20;
    this.bindData();
  }

  async bindData() {
    debugger;
    if (this.obsDeliveryInfo.Delivery_Type == "Self Pickup") {
      this.selfChecked = true;
      this.deliveryChecked = false;
    } else {
      this.selfChecked = false;
      this.deliveryChecked = true;
    }

    this.bindPostcode();
    this.summary();
  }

  async bindPostcode() {
    this.loading.present();
    let serv = (await this.postcodeService.getpostcodes({})).subscribe(
      (res) => {
        serv.unsubscribe();

        if (res[0].Result_Code == 1) {
          this.obsPostcode = res[0].Result;
          this.performshipping();
        } else {
          // this.alertService.showOkay("Please use Google Chrome or Safari to verify your email with this url.");
          this.alertService.showOkay(res[0].Message);
        }
        this.loading.dismiss();
      }
    );
  }

  summary() {
    this.obsOrder = new Order();

    if (this.obsUserSession.User_ID != undefined && this.data.act !="editorder") {
      this.obsOrder.Billing_First_Name = this.obsUserSession.Billing_First_Name;
      this.obsOrder.Billing_Last_Name = this.obsUserSession.Billing_Last_Name;
      this.obsOrder.Billing_Company_Name =
        this.obsUserSession.Billing_Company_Name;
      this.obsOrder.Billing_Street_Address1 =
        this.obsUserSession.Billing_Street_Address1;
      this.obsOrder.Billing_Street_Address2 =
        this.obsUserSession.Billing_Street_Address2;
      this.obsOrder.Billing_City = this.obsUserSession.Billing_City;
      this.obsOrder.Billing_Postcode = this.obsUserSession.Billing_Postcode;
      this.obsOrder.Billing_Phone = this.obsUserSession.Billing_Phone;
      this.obsOrder.Billing_Email = this.obsUserSession.Billing_Email;
      this.obsOrder.Billing_Country = this.obsUserSession.Billing_Country;

      if (
        this.obsUserSession.Shipping_First_Name != "" &&
        this.selfChecked == false
      ) {
        this.chkShipping = true;
      } else {
        this.chkShipping = false;
      }

      this.obsOrder.Shipping_First_Name =
        this.obsUserSession.Shipping_First_Name;
      this.obsOrder.Shipping_Last_Name = this.obsUserSession.Shipping_Last_Name;
      this.obsOrder.Shipping_Company_Name =
        this.obsUserSession.Shipping_Company_Name;
      this.obsOrder.Shipping_Street_Address1 =
        this.obsUserSession.Shipping_Street_Address1;
      this.obsOrder.Shipping_Street_Address2 =
        this.obsUserSession.Shipping_Street_Address2;
      this.obsOrder.Shipping_City = this.obsUserSession.Shipping_City;
      this.obsOrder.Shipping_Postcode = this.obsUserSession.Shipping_Postcode;
      this.obsOrder.Shipping_Phone = this.obsUserSession.Shipping_Phone;
      this.obsOrder.Shipping_Email = this.obsUserSession.Shipping_Email;
      this.obsOrder.Shipping_Country = this.obsUserSession.Shipping_Country;
    }else{
      this.obsOrder.Billing_First_Name = this.obsDeliveryInfo.Billing_First_Name;
      this.obsOrder.Billing_Last_Name = this.obsDeliveryInfo.Billing_Last_Name;
      this.obsOrder.Billing_Company_Name = this.obsDeliveryInfo.Billing_Company_Name;
      this.obsOrder.Billing_Street_Address1 = this.obsDeliveryInfo.Billing_Street_Address1;
      this.obsOrder.Billing_Street_Address2 = this.obsDeliveryInfo.Billing_Street_Address2;
      this.obsOrder.Billing_City = this.obsDeliveryInfo.Billing_City;
      this.obsOrder.Billing_Postcode = this.obsDeliveryInfo.Billing_Postcode;
      this.obsOrder.Billing_Phone = this.obsDeliveryInfo.Billing_Phone;
      this.obsOrder.Billing_Email = this.obsDeliveryInfo.Billing_Email;
      this.obsOrder.Billing_Country = this.obsDeliveryInfo.Billing_Country;
      this.obsOrder.Billing_Order_Note = this.obsDeliveryInfo.Billing_Order_Note;

      this.obsOrder.Shipping_First_Name = this.obsDeliveryInfo.Shipping_First_Name;
      this.obsOrder.Shipping_Last_Name = this.obsDeliveryInfo.Shipping_Last_Name;
      this.obsOrder.Shipping_Company_Name =this.obsDeliveryInfo.Shipping_Company_Name;
      this.obsOrder.Shipping_Street_Address1 =this.obsDeliveryInfo.Shipping_Street_Address1;
      this.obsOrder.Shipping_Street_Address2 = this.obsDeliveryInfo.Shipping_Street_Address2;
      this.obsOrder.Shipping_City = this.obsDeliveryInfo.Shipping_City;
      this.obsOrder.Shipping_Postcode = this.obsDeliveryInfo.Shipping_Postcode;
      this.obsOrder.Shipping_Phone = this.obsDeliveryInfo.Shipping_Phone;
      this.obsOrder.Shipping_Email = this.obsDeliveryInfo.Shipping_Email;
      this.obsOrder.Shipping_Country = this.obsDeliveryInfo.Shipping_Country;
      this.obsOrder.Shipping_Order_Note = this.obsDeliveryInfo.Shipping_Order_Note;
      if (
        this.obsDeliveryInfo.Shipping_First_Name != "" &&
        this.selfChecked == false
      ) {
        this.chkShipping = true;
      } else {
        this.chkShipping = false;
      }

    }
    this.obsOrder.Billing_Country = "Singapore";
    this.obsOrder.Shipping_Country = "Singapore";

    this.obsOrder.Sales_Type = this.obsDeliveryInfo.Sales_Type;
    this.obsOrder.Delivery_Date = this.obsDeliveryInfo.Delivery_Date;
    this.obsOrder.Delivery_Time = parseInt(this.obsDeliveryInfo.Delivery_Time);
    this.obsOrder.Delivery_TimeS = this.obsDeliveryInfo.Delivery_Time;

    this.obsOrder.Order_No = this.obsDeliveryInfo.Order_No;
    this.obsOrder.Order_Status = this.obsDeliveryInfo.Order_Status;
    this.obsOrder.Payment_Status = this.obsDeliveryInfo.Payment_Status;
    this.obsOrder.Delivery_Status = this.obsDeliveryInfo.Delivery_Status;
    this.obsOrder.Packaging_Status = this.obsDeliveryInfo.Packaging_Status;

    if (this.obsOrder.Order_Detail == undefined) {
      this.obsOrder.Order_Detail = new Array<Order_Detail>();
      this.obsOrder.Temp_Order_Detail = new Array<Order_Detail>();
    }
    if (this.obsDeliveryInfo.Cart != undefined) {
      for (var x = 0; x < this.obsDeliveryInfo.Cart.length; x++) {
        if (this.obsDeliveryInfo.Cart[x].Cart_Detail != undefined) {
          for (
            var i = 0;
            i < this.obsDeliveryInfo.Cart[x].Cart_Detail.length;
            i++
          ) {
            let addCode: string = "";
            let newCode: string =
              this.obsDeliveryInfo.Cart[x].Cart_Detail[i].Category_Code;
            if (addCode != newCode) {
              let obsOrderDetailCategory: Order_Detail_Category;

              if (this.obsOrder.Order_Detail_Categories == undefined) {
                this.obsOrder.Order_Detail_Categories =
                  Array<Order_Detail_Category>();
              }
              obsOrderDetailCategory = new Order_Detail_Category();
              obsOrderDetailCategory.Category_Code = newCode;

              const exist = this.obsOrder.Order_Detail_Categories.findIndex(
                (f) => f.Category_Code === newCode
              );
              if (exist < 0) {
                this.obsOrder.Order_Detail_Categories.push(
                  obsOrderDetailCategory
                );
              }

              addCode = newCode;
            }

            const exist = this.obsOrder.Order_Detail.findIndex(
              (f) =>
                f.Product_ID ===
                  this.obsDeliveryInfo.Cart[x].Cart_Detail[i].Product_ID &&
                f.Packaging_ID == this.obsDeliveryInfo.Cart[x].Packaging_ID
            );

            let obsCart_Summary = new Order_Detail();
            obsCart_Summary.Packaging_ID =
              this.obsDeliveryInfo.Cart[x].Packaging_ID;
            obsCart_Summary.Packaging_Name =
              this.obsDeliveryInfo.Cart[x].Packaging_Name;
            obsCart_Summary.Product_ID =
              this.obsDeliveryInfo.Cart[x].Cart_Detail[i].Product_ID;
            obsCart_Summary.Product_Name =
              this.obsDeliveryInfo.Cart[x].Cart_Detail[i].Product_Name;
            obsCart_Summary.Category_Code =
              this.obsDeliveryInfo.Cart[x].Cart_Detail[i].Category_Code;
            obsCart_Summary.Qty =
              this.obsDeliveryInfo.Cart[x].Cart_Detail[i].Qty;
            obsCart_Summary.Price =
              this.obsDeliveryInfo.Cart[x].Cart_Detail[i].Price;
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

      for (var x = 0; x < this.obsDeliveryInfo.Cart.length; x++) {
        if (this.obsDeliveryInfo.Cart[x].Cart_Detail != undefined) {
          for (
            var i = 0;
            i < this.obsDeliveryInfo.Cart[x].Cart_Detail.length;
            i++
          ) {
            const exist = this.obsOrder.Temp_Order_Detail.findIndex(
              (f) =>
                f.Product_ID ===
                this.obsDeliveryInfo.Cart[x].Cart_Detail[i].Product_ID
            );

            let obsCart_Summary = new Order_Detail();
            obsCart_Summary.Packaging_ID =
              this.obsDeliveryInfo.Cart[x].Packaging_ID;
            obsCart_Summary.Packaging_Name =
              this.obsDeliveryInfo.Cart[x].Packaging_Name;
            obsCart_Summary.Product_ID =
              this.obsDeliveryInfo.Cart[x].Cart_Detail[i].Product_ID;
            obsCart_Summary.Product_Name =
              this.obsDeliveryInfo.Cart[x].Cart_Detail[i].Product_Name;
            obsCart_Summary.Category_Code =
              this.obsDeliveryInfo.Cart[x].Cart_Detail[i].Category_Code;
            obsCart_Summary.Qty =
              this.obsDeliveryInfo.Cart[x].Cart_Detail[i].Qty;
            obsCart_Summary.Price =
              this.obsDeliveryInfo.Cart[x].Cart_Detail[i].Price;
            obsCart_Summary.Sub_Total =
              this.obsDeliveryInfo.Cart[x].Cart_Detail[i].Qty *
              this.obsDeliveryInfo.Cart[x].Cart_Detail[i].Price;
            obsCart_Summary.Format_Sub_Total =
              "$" + obsCart_Summary.Sub_Total.toFixed(2);
            if (exist > -1) {
              let qty: number;
              let price: number;
              qty =
                this.obsOrder.Temp_Order_Detail[exist].Qty +
                obsCart_Summary.Qty;

              this.obsOrder.Temp_Order_Detail[exist].Qty = qty;
              this.obsOrder.Temp_Order_Detail[exist].Sub_Total =
                qty * obsCart_Summary.Price;
              this.obsOrder.Temp_Order_Detail[exist].Format_Sub_Total =
                "$" + (qty * obsCart_Summary.Price).toFixed(2);
            } else {
              this.obsOrder.Temp_Order_Detail.push(obsCart_Summary);
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
      this.obsOrder.Total = total + this.obsOrder.Shipping_Amount;
    }

    this.obsOrder.Format_Total = "$" + this.obsOrder.Total.toFixed(2);

    this.category();
    this.isLoaded = true;
  }

  category() {
    if (this.obsOrder.Order_Detail_Categories != undefined) {
      this.obsOrder.Order_Detail_Categories.forEach((x, index) => {
        //filter out Category
        this.obsOrder.Order_Detail_Categories[index].Order_Detail =
          this.obsOrder.Order_Detail.filter(
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
  }

  check_shipping() {
    debugger;
    if (this.chkShipping == true) {
      this.chkShipping = false;
    } else {
      this.chkShipping = true;
    }
  }

  check_Plastic() {
    if (this.chkExtraPlasticYes == true) {
      this.chkExtraPlasticNo = true;
      this.chkExtraPlasticYes = false;
    } else {
      this.chkExtraPlasticNo = false;
      this.chkExtraPlasticYes = true;
    }
  }

  
  check_payment_collection() {
    if (this.chkPaymentCollectionYes == true) {
      this.chkPaymentCollectionNo = true;
      this.chkPaymentCollectionYes = false;
    } else {
      this.chkPaymentCollectionNo = false;
      this.chkPaymentCollectionYes = true;
    }
  }

  check_payment() {
    if (this.chkPaymentReceivedYes == true) {
      this.chkPaymentReceivedNo = true;
      this.chkPaymentReceivedYes = false;
    } else {
      this.chkPaymentReceivedNo = false;
      this.chkPaymentReceivedYes = true;
    }
  }

  check_self() {
    if (this.selfChecked == true) {
      this.obsDeliveryInfo.Delivery_Type = "Delivery";

      this.deliveryChecked = true;
      this.selfChecked = false;
    } else {
      this.obsDeliveryInfo.Delivery_Type ="Self Pickup"; 

      this.deliveryChecked = false;
      this.selfChecked = true;
      this.chkShipping = false;
    }

    this.performshipping();
  }

  check_delivery() {
    if (this.deliveryChecked == true) {
      this.obsDeliveryInfo.Delivery_Type ="Self Pickup"; 
      this.selfChecked = true;
      this.deliveryChecked = false;
    } else {
      this.obsDeliveryInfo.Delivery_Type = "Delivery";
      this.selfChecked = false;
      this.deliveryChecked = true;
    }
   
    this.performshipping();
  }

  onKeyUp() {
    this.performshipping();

    // this.calcategory(x);
  }

  performshipping() {
    let defaultAmt = 20.0;
    debugger;
    if (this.obsOrder.Billing_Postcode == undefined) {
      this.obsOrder.Format_Shipping_Amount = "$" + defaultAmt.toFixed(2);
      if (this.selfChecked == true) {
        defaultAmt = 0.0;
      }
      if(this.obsOrder.Sub_Total>269){
        defaultAmt = 0.0;
        this.obsOrder.Format_Shipping_Amount = "$" + defaultAmt.toFixed(2);
      }
    
      this.obsOrder.Shipping_Amount = defaultAmt;
      this.obsOrder.Total =
        this.obsOrder.Sub_Total + this.obsOrder.Shipping_Amount;
      this.obsOrder.Format_Total = "$" + this.obsOrder.Total.toFixed(2);
    } else {
      if (this.obsOrder.Billing_Postcode.length > 5) {
        this.obsPostcode.forEach((postcode, index) => {
          if (this.chkShipping == true) {
            if (
              parseInt(this.obsOrder.Shipping_Postcode) >=
                postcode.Postcode_From &&
              parseInt(this.obsOrder.Shipping_Postcode) <= postcode.Postcode_To
            ) {
              defaultAmt = postcode.Delivery_Amount;
              return;
            }
          } else {
            if (
              parseInt(this.obsOrder.Billing_Postcode) >=
                postcode.Postcode_From &&
              parseInt(this.obsOrder.Billing_Postcode) <= postcode.Postcode_To
            ) {
              defaultAmt = postcode.Delivery_Amount;
              return;
            }
          }
        });

        this.obsOrder.Format_Shipping_Amount = "$" + defaultAmt.toFixed(2);

        if (this.selfChecked == true) {
          defaultAmt = 0.0;
        }
        debugger
        if(this.obsOrder.Sub_Total>269){
          defaultAmt = 0.0;
          this.obsOrder.Format_Shipping_Amount = "$" + defaultAmt.toFixed(2);    
        }
    
        this.obsOrder.Shipping_Amount = defaultAmt;
        this.obsOrder.Total =
          this.obsOrder.Sub_Total + this.obsOrder.Shipping_Amount;
        this.obsOrder.Format_Total = "$" + this.obsOrder.Total.toFixed(2);

        // Swal.fire('Successful',    this.obsOrder.Billing_Postcode, "success");
      }
    }
  }

  editorder() {
    debugger;
    if (this.obsDeliveryInfo.Is_Customise_Packaging == true) {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          act: "editorder",
        },
      };
      this.router.navigate(["packaging"], navigationExtras);
    } else {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          id: 0,
          act: "editorder",
        },
      };
      this.router.navigate(["orderonline"], navigationExtras);
    }
  }

  backOrderList() {
    this.router.navigate(["jxorderlist"]);
  }

  async tapCheckout() {
    debugger;
    this.global.validateAllNgFormFields(this.f);

    if (!this.global.validNgFormFields(this.f)) {
      return;
    }

    debugger;
    this.configManager.SetDeliveryInfo(JSON.stringify(this.obsDeliveryInfo));
    if (this.obsDeliveryInfo.Delivery_Type == "Delivery") {
      if(this.obsOrder.Sub_Total<50){
        Swal.fire("Error", "[Delivery] min order $50.", "error");
        if (this.obsDeliveryInfo.Is_Customise_Packaging == true) {
          this.router.navigate(["packaging"]);
        }else{
          let navigationExtras: NavigationExtras = {
            queryParams: {
              id: 0,
            },
          };
          this.router.navigate(["orderonline"],navigationExtras);
     
        }

        return;
      }
    }

    debugger;
    if (this.chkShipping == false && this.selfChecked == false) {
      this.obsOrder.Shipping_First_Name = this.obsOrder.Billing_First_Name;
      this.obsOrder.Shipping_Last_Name = this.obsOrder.Billing_Last_Name;
      this.obsOrder.Shipping_Company_Name = this.obsOrder.Billing_Company_Name;
      this.obsOrder.Shipping_Street_Address1 =
        this.obsOrder.Billing_Street_Address1;
      this.obsOrder.Shipping_Street_Address2 =
        this.obsOrder.Billing_Street_Address2;
      this.obsOrder.Shipping_City = this.obsOrder.Billing_City;
      this.obsOrder.Shipping_Postcode = this.obsOrder.Billing_Postcode;
      this.obsOrder.Shipping_Phone = this.obsOrder.Billing_Phone;
      this.obsOrder.Shipping_Email = this.obsOrder.Billing_Email;
      this.obsOrder.Shipping_Order_Note = this.obsOrder.Billing_Order_Note;
      this.obsOrder.Shipping_Country = this.obsOrder.Billing_Country;
    } else if (this.chkShipping == false) {
      this.obsOrder.Shipping_First_Name = "";
      this.obsOrder.Shipping_Last_Name = "";
      this.obsOrder.Shipping_Company_Name = "";
      this.obsOrder.Shipping_Street_Address1 = "";
      this.obsOrder.Shipping_Street_Address2 = "";
      this.obsOrder.Shipping_City = "";
      this.obsOrder.Shipping_Postcode = "";
      this.obsOrder.Shipping_Phone = "";
      this.obsOrder.Shipping_Email = "";
      this.obsOrder.Shipping_Order_Note = "";
      this.obsOrder.Shipping_Country = "";
    }

    this.obsOrder.Created_User = 1;

    if (this.obsUserSession.User_ID != undefined) {
      this.obsOrder.Created_User = this.obsUserSession.User_ID;
    }

    this.obsOrder.Is_Payment = 0;
    if (
      this.obsDeliveryInfo.Sales_Type == "Walk-In" &&
      this.chkPaymentReceivedYes == true
    ) {
      this.obsOrder.Is_Payment = 1;
    }


    this.obsOrder.Pay_Upon_Collection = 0;
    if (this.chkPaymentCollectionYes) {
      this.obsOrder.Pay_Upon_Collection = 1;
    }

    this.obsOrder.Extra_Bag = 0;
    if (this.chkExtraPlasticYes) {
      this.obsOrder.Extra_Bag = 1;
    }
    this.obsOrder.Is_Customised = 0;
    if (this.obsDeliveryInfo.Is_Customise_Packaging) {
      this.obsOrder.Is_Customised = 1;
    }
    this.obsOrder.Num_Customised = this.obsDeliveryInfo.Customise_Packaging;

    this.obsOrder.Shipping_Type = this.obsDeliveryInfo.Delivery_Type;

    this.loading.present();
    let serv = (await this.orderService.addOrder(this.obsOrder))
      .pipe(catchError((error) => of(`Bad Promise: ${error}`)))
      .subscribe(
        (res) => {
          serv.unsubscribe();
          this.loading.dismiss();
          console.log(res);
          if (res.status == 0) {
            this.loading.dismiss();
            this.alertService.showOkay(
              "There was an error. Please try again later."
            );
            return;
          }
          if (res[0].Result_Code == 1) {
            Swal.fire(
              "Successful",
              "You're almost there! We've email you a payment reminder with hyperlink for upload the payment screenshot. Didn't receive the email? Please check if the email is in your junk/spam folder.",
              "success"
            );
            let objOrderKey = new OrderKey();
            objOrderKey.Order_ID = res[0].IdentityUrl;
            // objOrderKey.Shipping_Email =  this.obsOrder.Shipping_Email;

            // this.configManager.SetOrderKey(JSON.stringify(objOrderKey))
            this.configManager.RemoveDeliveryInfo();
            this.eventService.notificationRefresh(0);
            let navigationExtras: NavigationExtras = {
              queryParams: {
                id: res[0].IdentityUrl,
              },
            };
            this.router.navigate(["payment"], navigationExtras);

            // this.router.navigate(["payment"]);
            // this.toastService.show("Updated successfully.");
          } else {
            debugger;
            if (res[0].Message_Code == 1) {
              // for (var x = 0; x < this.obsDeliveryInfo.Cart.length; x++) {
              //   let obsCartDetail = new Array<Cart_Detail>();
              //   obsCartDetail = this.obsDeliveryInfo.Cart[x].Cart_Detail.filter(
              //     (i) => i.Product_ID === res[0].IdentityKey
              //   );

              //   obsCartDetail.forEach((obj, index) => {
              //     this.obsDeliveryInfo.Cart[x].Cart_Detail.splice(index, 1);
              //   });
              // }

              // for (var x = 0; x < this.obsDeliveryInfo.Cart.length; x++) {
              //   let cartQty = 0;
              //   this.obsDeliveryInfo.Cart[x].Cart_Detail.forEach(
              //     (obj, index) => {
              //       cartQty += obj.Qty;
              //     }
              //   );
              //   this.obsDeliveryInfo.Cart[x].Qty = cartQty;
              // }

              // let cartTotalQty = 0;
              // this.obsDeliveryInfo.Cart.forEach((obj, index) => {
              //   cartTotalQty += obj.Qty;
              // });

              // this.obsDeliveryInfo.Cart_Total = cartTotalQty;

              // if (this.data.act == "editorder") {
              //   this.configManager.SetOrderInfo(
              //     JSON.stringify(this.obsDeliveryInfo)
              //   );
              // } else {
              //   this.configManager.SetDeliveryInfo(
              //     JSON.stringify(this.obsDeliveryInfo)
              //   );
              // }

              this.eventService.notificationRefresh(0);
              this.alertService.showOkay("System will discard the cart due to " + res[0].Message);
              this.router.navigate(["delivery"]);
              return;
              // if( this.obsDeliveryInfo.Cart_Total < 1){
              //   this.router.navigate(["delivery"]);
              //   return;
              // }              
            }
          
            this.alertService.showOkay(res[0].Message);
          }
        },
        (error) => console.log("oops", error)
      );
  }

  onChangeDate(data) {
    this.obsOrder.Delivery_Date = formatDate(
      data._selected,
      "dd MMM yyyy",
      "en"
    );
  }

  async tapSaveChanges() {
    this.global.validateAllNgFormFields(this.f);

    if (!this.global.validNgFormFields(this.f)) {
      return;
    }

    if (this.obsDeliveryInfo.Delivery_Type == "Delivery") {
      if(this.obsOrder.Sub_Total<50){
        Swal.fire("Error", "[Delivery] min order $50.", "error");
        // this.router.navigate(["delivery"]);
        return;
      }
    }

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save changes?",
      icon: "warning",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then(async (okay) => {
      if (okay) {
        if (this.chkShipping == false && this.selfChecked == false) {
          this.obsOrder.Shipping_First_Name = this.obsOrder.Billing_First_Name;
          this.obsOrder.Shipping_Last_Name = this.obsOrder.Billing_Last_Name;
          this.obsOrder.Shipping_Company_Name =
            this.obsOrder.Billing_Company_Name;
          this.obsOrder.Shipping_Street_Address1 =
            this.obsOrder.Billing_Street_Address1;
          this.obsOrder.Shipping_Street_Address2 =
            this.obsOrder.Billing_Street_Address2;
          this.obsOrder.Shipping_City = this.obsOrder.Billing_City;
          this.obsOrder.Shipping_Postcode = this.obsOrder.Billing_Postcode;
          this.obsOrder.Shipping_Phone = this.obsOrder.Billing_Phone;
          this.obsOrder.Shipping_Email = this.obsOrder.Billing_Email;
          this.obsOrder.Shipping_Order_Note = this.obsOrder.Billing_Order_Note;
          this.obsOrder.Shipping_Country = this.obsOrder.Billing_Country;
        } else if (this.chkShipping == false) {
          this.obsOrder.Shipping_First_Name = "";
          this.obsOrder.Shipping_Last_Name = "";
          this.obsOrder.Shipping_Company_Name = "";
          this.obsOrder.Shipping_Street_Address1 = "";
          this.obsOrder.Shipping_Street_Address2 = "";
          this.obsOrder.Shipping_City = "";
          this.obsOrder.Shipping_Postcode = "";
          this.obsOrder.Shipping_Phone = "";
          this.obsOrder.Shipping_Email = "";
          this.obsOrder.Shipping_Order_Note = "";
          this.obsOrder.Shipping_Country = "";
        }

        this.obsOrder.Created_User = 1;

        if (this.obsUserSession.User_ID != undefined) {
          this.obsOrder.Created_User = this.obsUserSession.User_ID;
        }

        this.obsOrder.Is_Payment = 0;
        if (this.chkPaymentReceivedYes) {
          this.obsOrder.Is_Payment = 1;
        }

        this.obsOrder.Pay_Upon_Collection = 0;
        if (this.chkPaymentCollectionYes) {
          this.obsOrder.Pay_Upon_Collection = 1;
        }

        this.obsOrder.Extra_Bag = 0;
        if (this.chkExtraPlasticYes) {
          this.obsOrder.Extra_Bag = 1;
        }
        this.obsOrder.Is_Customised = 0;
        if (this.obsDeliveryInfo.Is_Customise_Packaging) {
          this.obsOrder.Is_Customised = 1;
        }
        this.obsOrder.Num_Customised = this.obsDeliveryInfo.Customise_Packaging;
        if (this.data.act == "editorder") {
          this.obsOrder.Delivery_Time = parseInt(this.obsOrder.Delivery_TimeS);
        } else {
          this.obsOrder.Delivery_Time = parseInt(
            this.obsDeliveryInfo.Delivery_Time
          );
        }

        this.obsOrder.Shipping_Type = this.obsDeliveryInfo.Delivery_Type;
        this.obsOrder.Order_ID = this.obsDeliveryInfo.Order_ID;
        this.loading.present();
        let serv = (await this.orderService.orderedit(this.obsOrder))
          .pipe(catchError((error) => of(`Bad Promise: ${error}`)))
          .subscribe(
            (res) => {
              serv.unsubscribe();
              this.loading.dismiss();
              console.log(res);
              if (res.status == 0) {
                this.loading.dismiss();
                this.alertService.showOkay(
                  "There was an error. Please try again later."
                );
                return;
              }
              if (res[0].Result_Code == 1) {
                Swal.fire(
                  "Successful",
                  "Order has been successfully updated..",
                  "success"
                );

                this.configManager.RemoveOrderInfo();

                let navigationExtras: NavigationExtras = {
                  queryParams: {
                    id: this.obsOrder.Order_ID,
                    act: "jx",
                  },
                };

                this.router.navigate(["orderview"], navigationExtras);
              } else {
                this.alertService.showOkay(res[0].Message);
              }
            },
            (error) => console.log("oops", error)
          );
      } else {
        // Swal.fire("s");
      }
    });
  }
}
