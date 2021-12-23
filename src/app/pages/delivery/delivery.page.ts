// import {MatDatepickerModule} from '@angular/material/datepicker';
import { formatDate } from "@angular/common";
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
import { Subscription, of, forkJoin } from "rxjs";
import {
  Router,
  NavigationEnd,
  ActivatedRoute,
  NavigationExtras,
} from "@angular/router";
import { Product, Product_Image } from "src/app/entity/Product";

import {
  NavController,
  ModalController,
  AlertController,
} from "@ionic/angular";
import { NgForm } from "@angular/forms";
import { User } from "src/app/entity/User";
import { UserService } from "src/app/services/user.service";
import { Cart, Category, DeliveryInfo } from "src/app/entity/Cart";
import { ConfigManager } from "src/app/services/config.service";
import Swal from 'sweetalert2';
import { EventService } from "src/app/services/event";
import { MenuController, PopoverController } from "@ionic/angular";
import { CalendarPage } from "src/app/modal/calendar/calendar.page";

import { switchMap } from "rxjs/operators";
import { HolidayService } from "src/app/services/holiday.service";

// import Datepicker from 'path/to/node_modules/vanillajs-datepicker/js/Datepicker.js';
@Component({
  selector: "app-delivery",
  templateUrl: "./delivery.page.html",
  styleUrls: ["./delivery.page.scss"],
})
export class DeliveryPage implements OnInit, OnDestroy {
  @ViewChild("f") f: NgForm;
  dateValue = '';
  dateValue2 = '';
  isLoaded: boolean = false;

  checkAKK: boolean = false;
  checkMTO: boolean = false;
  checkBS: boolean = false;
  checkSK: boolean = false;

  chkCusPackNo: boolean = true;
  chkCusPackYes: boolean = false;

  chkPlasticNo: boolean = true;
  chkPlasticYes: boolean = false;

  chkPhoneIn: boolean = false;
  chkWalkIn: boolean = true;
  chkWholesales: boolean = false;
  chkGrab: boolean = false;
  chkShopee: boolean = false;

  checkSelf: boolean = true;
  checkDelivery: boolean = false;

  deliveryTimes = [
    {
      Code: 8,
      Name: "8.00AM-9.00AM",
      visible: false,
      self: false,
      delivery: false,
    },
    {
      Code: 9,
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
  obsTimes = [];
  obsDeliveryInfo: DeliveryInfo;
  private subscription: Subscription;
  public selectedMoment: Date;
  error_messages = {
    First_Name: { required: "cannot be blank." },
    Last_Name: { required: "cannot be blank." },
    Confirm_Password: {
      required: "cannot be blank.",
      password_mismatch: "password mismatch.",
    },
    Password: { required: "cannot be blank." },
    Email: { required: "cannot be blank." },
  };
  // public invalidMoment =  new Date(2018, 1, 11, 9, 30);

  public minDay: number = 2;
  public minWTMinDay = new Date();
  public min = new Date();
  public max = new Date();
  public holidayDate = new Array<Date>();
  public holidayDateStr = new Array<string>();
  // public invalidMoment = new Date(2021, 4, 1);

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
    public userServices: UserService,
    public obs: DeliveryInfo,
    public configManager: ConfigManager,
    public eventService: EventService,
    private popoverController: PopoverController,
    private holidayService: HolidayService
  ) { }

  async ionViewWillEnter() {
    this.obs = new DeliveryInfo();

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
        event.url.includes("/registermember")
      ) {
      }
    });
  }

  public myFilter = (d: Date): boolean => {
    const day = d.getDay();
    // const test = new Date();
    for (let i = 0; i < this.holidayDateStr.length; i++) {
      // if( formatDate(d, "yyyy MMM dd", "en")== "2021 Jun 25" &&  formatDate(this.holidayDate[i].toUTCString(), "yyyy MMM dd", "en") == "2021 Jun 25"){
      //   debugger;
      //   var asd = formatDate(this.holidayDate[i].toUTCString(), "yyyy MMM dd", "en");
      //   alert("hi" + asd);
      //  // return true;
      // }
      // formatDate(this.holidayDate[i].toISOString(), "yyyy MMM dd", "en")

      //  test1 = new Date(
      //   d.getFullYear(),
      //   d.getMonth(),
      //   d.getDate(),
      //   0,
      //   0,
      //   0
      // );
      debugger;
      if (
        formatDate(d, "yyyy MMM dd", "en") == this.holidayDateStr[i]

      ) {

        return false;
      }
    }
    return day !== 0;
  };

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
    this.data = await this.GetParams();
    this.holidayDate = new Array<Date>();
    if (this.data.type == "AKK") {
      this.checkAKK = true;
    } else if (this.data.type == "MTO") {
      this.checkMTO = true;
    } else if (this.data.type == "SK") {
      this.checkSK = true;
    } else if (this.data.type == "BS") {
      this.checkBS = true;
    } else this.checkAKK = true;

    this.obsUserSession = await this.configManager.GetUser();
    debugger;
    if (
      "Admin;Admin1;Admin2;Admin3;Admin12;Admin123".includes(
        this.obsUserSession.Member_Type + ";"
      )
    ) {
      this.chkWalkIn = true;
      this.chkPhoneIn = false;
      this.chkWholesales = false;
      this.chkGrab = false;
      this.chkShopee = false;

      this.obsTimes = this.deliveryTimes;
    } else {
      this.chkWalkIn = false;
      this.chkPhoneIn = false;
      this.chkWholesales = false;
      this.chkGrab = false;
      this.chkShopee = false;

      this.obsTimes = this.deliveryTimes.filter((t) => t.visible === true);
    }

    this.obs = new DeliveryInfo();
    this.timeselection();
    this.bindData();


  }

  timeselection() {
    if (
      "Admin;Admin1;Admin2;Admin3;Admin12;Admin123".includes(
        this.obsUserSession.Member_Type + ";"
      )
    ) {
      if (this.chkWholesales == false && this.chkWalkIn == false) {
        if (this.checkSelf == true) {
          this.obsTimes = this.deliveryTimes.filter((t) => t.self === true);
        } else {
          this.obsTimes = this.deliveryTimes.filter((t) => t.delivery === true);
        }
      } else {
        this.obsTimes = this.deliveryTimes;
      }
    } else {
      if (this.checkSelf == true) {
        this.obsTimes = this.deliveryTimes.filter((t) => t.self === true);
      } else {
        this.obsTimes = this.deliveryTimes.filter((t) => t.delivery === true);
      }
    }
  }
  public countDay = 0;
  holiday() {
    debugger;
   
    let dtNow = new Date();
    this.minWTMinDay = new Date();
    let dtNew = new Date();

    dtNew = new Date(dtNew.setDate(dtNew.getDate() + this.minDay));
    debugger;
    this.countdate(dtNew);
    // alert(this.countDay);

    // let dt = new Date(dtNew.setDate(dtNew.getDate() + this.minDay));
    if (this.countDay > 0) {
      dtNew = new Date(dtNew.setDate(dtNew.getDate() + this.countDay));
    }

    this.min = new Date(
      dtNew.getFullYear(),
      dtNew.getMonth(),
      dtNew.getDate(),
      0,
      0,
      0
    );
    // this.min = new Date(formatDate(dtNew, "yyyy MMM dd", "en"));

    let datestr = new Date(new Date().setMonth(dtNew.getMonth() + 2));
    let newdate = new Date(datestr);
    let maxStr = formatDate(newdate, "yyyy MMM dd", "en");

    this.max = new Date(
      newdate.getFullYear(),
      newdate.getMonth(),
      newdate.getDate(),
      0,
      0,
      0
    );
    debugger;
    this.selectedMoment = null; //new Date(dtNew);

    if (this.chkWalkIn == true) {

      this.minDay = 0;

      let dt = new Date();

      this.min = new Date(
        dt.getFullYear(),
        dt.getMonth(),
        dt.getDate(),
        0,
        0,
        0
      );


      this.selectedMoment = null; //new Date(this.min);
      if (this.minWTMinDay > dtNow) {
        this.obs.Delivery_Date = "";
      } else {
        this.obs.Delivery_Date = formatDate(new Date(), "dd MMM yyyy", "en");
      }


      let selectedTime = formatDate(new Date(), "HH", "en");
      let exist = this.obsTimes.filter((t) => t.delivery === selectedTime);
      if (exist.length < 1) {
        this.obs.Delivery_Time = "";
      } else {
        this.obs.Delivery_Time = formatDate(new Date(), "HH", "en");
      }
    }
  }

  countdate(dtNew){
    this.countDay = 0;
    debugger;
    let d = new Date();
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    while (d <= dtNew) {
      if (d.getDay() == 0) {
        this.countDay = this.countDay + 1;
      }else{
        for (let i = 0; i < this.holidayDate.length; i++) {
          if(this.holidayDate[i].getDay() != 0){
          if (this.holidayDate[i].getTime() == d.getTime()) {
            this.countDay = this.countDay + 1;
          }
          }
        }
      }

      d.setDate(d.getDate() + 1);
      d.setHours(0);
      d.setMinutes(0);
      d.setSeconds(0);
      d.setMilliseconds(0);
    }

    // alert(this.countDay);
  }
  async bindData() {
    this.isLoaded = true;
    let data = { User_ID: this.obsUserSession.User_ID }
    this.loading.present();
    if (this.obsUserSession.User_ID != undefined) {
      let serv = forkJoin([
        await this.holidayService.getholiday({ Exlcude_Prev_Date: 1 }),
        await this.userServices.getUser(data),
      ]).subscribe((resp) => {
        debugger;
        this.loading.dismiss();
        let res = resp[0];
        let res1 = resp[1];
        serv.unsubscribe();

        if (res[0].Result_Code == 1) {
          res[0].Result.forEach((holiday, index) => {
            this.holidayDate.push(new Date(holiday.Holiday_Date));
            this.holidayDateStr.push(holiday.Holiday_Date_Format);
          });
          // debugger;
          // const a = res[0].Result;
          debugger;
          this.holiday();
          // this.performshipping();
        } else {
          // this.alertService.showOkay("Please use Google Chrome or Safari to verify your email with this url.");
          // this.alertService.showOkay(res[0].Message);
          this.holiday();
        }

        debugger;
        if (res1[0].Result_Code == 1) {
          // this.obs = Object.assign(new User(), res1[0].Result[0]);
          this.configManager.SetUser(JSON.stringify(res1[0].Result[0]));
        } else {
          this.alertService.showOkay(res1[0].Message);
        }
      });
    } else {
      let serv = (await this.holidayService.getholiday({ Exlcude_Prev_Date: 1 })).subscribe((res) => {
        serv.unsubscribe();

        if (res[0].Result_Code == 1) {
          res[0].Result.forEach((holiday, index) => {
            this.holidayDate.push(new Date(holiday.Holiday_Date));
          });
          // debugger;
          // const a = res[0].Result;
          debugger;
          this.holiday();
          // this.performshipping();
        } else {
          // this.alertService.showOkay("Please use Google Chrome or Safari to verify your email with this url.");
          // this.alertService.showOkay(res[0].Message);
          this.holiday();
        }
        this.loading.dismiss();
      });

    }

  }

  onChange(data) {
    console.log("Triggered", data);
  }

  onChange1(data) {
    debugger;
    if(data._selected==null){
      this.obs.Delivery_Date = "";
    }else{
      this.obs.Delivery_Date = formatDate(data._selected, "dd MMM yyyy", "en");
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

  onKeyUp() {
    if (this.obs.Customise_Packaging > 99) {
      this.obs.Customise_Packaging = 99;
    }
    if (this.obs.Customise_Packaging < 2) {
      this.obs.Customise_Packaging = 2;
    }
  }

  async tapNext() {
    if (
      this.checkAKK == false &&
      this.checkMTO == false &&
      this.checkBS == false &&
      this.checkSK == false
    ) {
      Swal.fire("Error", "Please select at least one of the kueh.", "error");
      return;
    }

    if (
      "Admin;Admin1;Admin2;Admin3;Admin12;Admin123".includes(
        this.obsUserSession.Member_Type + ";"
      )
    ) {
      if (
        this.chkPhoneIn == false &&
        this.chkWalkIn == false &&
        this.chkWholesales == false &&
        this.chkGrab == false &&
        this.chkShopee == false
      ) {
        Swal.fire("Error", "Please select sales type.", "error");
        return;
      }
    }

    if (this.chkCusPackYes) {
      this.obs.Is_Customise_Packaging = true;
      if (this.obs.Customise_Packaging == undefined) {
        Swal.fire(
          "Error",
          "Please enter the number of customise packaging.",
          "error"
        );
        return;
      }
    } else {
      this.obs.Customise_Packaging = 1;
      this.obs.Is_Customise_Packaging = false;
    }

    if (this.obs.Delivery_Date == undefined || this.obs.Delivery_Date === "") {
      Swal.fire("Error", "Please select the delivery date.", "error");
      return;
    }

    let date = new Date(this.obs.Delivery_Date);
    if (isNaN(date.valueOf())) {
      Swal.fire("Error", "Invalid date.", "error");
      this.obs.Delivery_Date = "";
      return;
    }

    if (this.obs.Delivery_Time == undefined || this.obs.Delivery_Time === "") {
      Swal.fire("Error", "Please select the delivery time.", "error");
      return;
    }

    this.obsDeliveryInfo = await this.configManager.GetDeliveryInfo();

    if (this.obsDeliveryInfo.Cart != undefined) {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to discard your cart?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((okay) => {
        if (okay.isConfirmed) {
          this.doDelivery();
        } else {
          // Swal.fire("s");
        }
      });
    } else {
      this.doDelivery();
    }

    // this.doDelivery();
  }

  doDelivery() {
    this.eventService.notificationRefresh(0);
    let obsCart: Cart;
    this.obs.Cart = new Array<Cart>();
    this.obs.Cart_Total = 0;
    // this.obs.Cart = Object.assign(new Cart(), null);

    for (var i = 0; i < this.obs.Customise_Packaging; i++) {
      obsCart = new Cart();
      obsCart.Packaging_ID = "Packaging " + (i + 1);
      obsCart.Packaging_Name = "";
      this.obs.Cart.push(obsCart);
    }

    if (this.checkDelivery == true) {
      this.obs.Delivery_Type = "Delivery";
    } else {
      this.obs.Delivery_Type = "Self Pickup";
    }
    debugger;

    if (
      "Admin;Admin1;Admin2;Admin3;Admin12;Admin123".includes(
        this.obsUserSession.Member_Type + ";"
      )
    ) {
      if (this.chkPhoneIn == true) {
        this.obs.Sales_Type = "Pre-Order";
      } else if (this.chkWalkIn == true) {
        this.obs.Sales_Type = "Walk-In";
      } else if (this.chkWholesales == true) {
        this.obs.Sales_Type = "Wholesales";
      } else if (this.chkShopee == true) {
        this.obs.Sales_Type = "Shopee";
      } else if (this.chkGrab == true) {
        this.obs.Sales_Type = "Grab";
      }
    } else {
      this.obs.Sales_Type = "Pre-Order";
    }
    debugger;
    if (this.obsUserSession.Sales_Type == "Whole-Sales") {
      this.obs.Sales_Type = "Whole-Sales";
    }


    this.obs.Category = new Array<Category>();
    let obsCategory: Category;

    if (this.checkAKK) {
      obsCategory = new Category();
      obsCategory.Category_Code = "Ang Ku Kueh";
      this.obs.Category.push(obsCategory);
    }
    if (this.checkMTO) {
      obsCategory = new Category();
      obsCategory.Category_Code = "Made To Order";
      this.obs.Category.push(obsCategory);
    }
    if (this.checkBS) {
      obsCategory = new Category();
      obsCategory.Category_Code = "Baby Shower";
      this.obs.Category.push(obsCategory);
    }
    if (this.checkSK) {
      obsCategory = new Category();
      obsCategory.Category_Code = "Seasonal Kueh";
      this.obs.Category.push(obsCategory);
    }
    debugger;

    this.obs.Extra_Bag = 0;

    this.obs.Created_Date = formatDate(new Date(), "yyyy MMM dd", "en");
    this.configManager.SetDeliveryInfo(JSON.stringify(this.obs));

    if (this.chkCusPackNo == true) {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          id: 0,
        },
      };
      this.router.navigate(["orderonline"], navigationExtras);
    } else {
      this.router.navigate(["packaging"]);
    }
  }

  clickDelivery() {
    if (this.checkDelivery == true) {
      this.checkDelivery = false;
      this.checkSelf = true;
    } else {
      this.checkDelivery = true;
      this.checkSelf = false;
    }
    this.obs.Delivery_Time = "";
    this.timeselection();
  }

  check_AKK() {
    if (this.checkAKK == true) {
      this.checkAKK = false;
    } else {
      this.checkAKK = true;
    }
    this.checkMinDate();
  }

  check_MTO() {
    if (this.checkMTO == true) {
      this.checkMTO = false;
    } else {
      this.checkMTO = true;
    }
    this.checkMinDate();
  }

  check_BS() {
    if (this.checkBS == true) {
      this.checkBS = false;
    } else {
      this.checkBS = true;
    }
    this.checkMinDate();
    this.chkCusPackYes = false;
    this.chkCusPackNo = true;
  }

  check_SK() {
    if (this.checkSK == true) {
      this.checkSK = false;
    } else {
      this.checkSK = true;
    }
    this.checkMinDate();
  }

  checkMinDate() {
    debugger;
    if (this.chkWalkIn == true) {
      this.minDay = 0;
      let dt = new Date();
      this.min = new Date(
        dt.getFullYear(),
        dt.getMonth(),
        dt.getDate(),
        0,
        0,
        0
      );
      this.selectedMoment = null; //new Date(this.min);
    } else if (this.chkWholesales == true || this.chkGrab == true || this.chkShopee == true) {
      this.minDay = 0;
      let dt = new Date();
      this.min = new Date(
        dt.getFullYear(),
        dt.getMonth(),
        dt.getDate(),
        0,
        0,
        0
      );
      this.selectedMoment = null; //new Date(this.min);
    } else {
      if (this.checkSK == true || this.checkBS == true) {
        this.minDay = 5;
        let x = new Date(); //this.minWTMinDay
        let dt = new Date(x.setDate(x.getDate() + this.minDay));
        debugger;



        this.countdate(dt);

        if (this.countDay > 0) {
          dt = new Date(dt.setDate(dt.getDate() + this.countDay));
        }

        // this.min = new Date(new Date().setDate(this.minWTMinDay.getDate()+this.minDay));
        this.min = new Date(
          dt.getFullYear(),
          dt.getMonth(),
          dt.getDate(),
          0,
          0,
          0
        );
        this.selectedMoment = null; // new Date(this.min);
      } else {
        this.minDay = 2;
        let x = new Date(); //this.minWTMinDay
        let dt = new Date(x.setDate(x.getDate() + this.minDay));
        debugger;

        this.countdate(dt);


        if (this.countDay > 0) {
          dt = new Date(dt.setDate(dt.getDate() + this.countDay));
        }

        this.min = new Date(
          dt.getFullYear(),
          dt.getMonth(),
          dt.getDate(),
          0,
          0,
          0
        );
        this.selectedMoment = null; //new Date(this.min);
      }
      // if (new Date(this.obs.Delivery_Date) < this.min) {
      //   this.selectedMoment = null; //new Date(this.min);
      // }

    }


    this.obs.Delivery_Date = "";
  }

  chkPlastic_Yes() {
    if (this.chkPlasticYes == true) {
      this.chkPlasticYes = false;
      this.chkPlasticNo = true;
    } else {
      this.chkPlasticYes = true;
      this.chkPlasticNo = false;
    }
  }

  chkCusPack_Yes() {
    if (this.chkCusPackYes == true) {
      this.chkCusPackYes = false;
      this.chkCusPackNo = true;
    } else {
      this.chkCusPackYes = true;
      this.chkCusPackNo = false;
    }
  }

  chkSalesType(type) {
    // this.chkPhoneIn = false;
    // this.chkWalkIn = false;
    // this.chkWholesales = false;
    if (type == "PhoneIn") {
      if (this.chkPhoneIn == true) {
        this.chkPhoneIn = false;
        return;
      }
      this.chkPhoneIn = true;
      this.chkWalkIn = false;
      this.chkWholesales = false;
      this.chkShopee = false;
      this.chkGrab = false;
    } else if (type == "WalkIn") {
      if (this.chkWalkIn == true) {
        this.chkWalkIn = false;
        return;
      }
      this.chkPhoneIn = false;
      this.chkWalkIn = true;
      this.chkWholesales = false;
      this.chkShopee = false;
      this.chkGrab = false;

      this.checkSelf = true;
      this.checkDelivery = false;


    } else if (type == "WholeSales") {
      if (this.chkWholesales == true) {
        this.chkWholesales = false;
        return;
      }
      this.chkPhoneIn = false;
      this.chkWalkIn = false;
      this.chkWholesales = true;
      this.chkShopee = false;
      this.chkGrab = false;
    } else if (type == "Grab") {
      if (this.chkGrab == true) {
        this.chkGrab = false;
        return;
      }
      this.chkPhoneIn = false;
      this.chkWalkIn = false;
      this.chkGrab = true;
      this.chkShopee = false;
      this.chkWholesales = false;
    } else if (type == "Shopee") {
      if (this.chkShopee == true) {
        this.chkShopee = false;
        return;
      }
      this.chkPhoneIn = false;
      this.chkWalkIn = false;
      this.chkShopee = true;
      this.chkWholesales = false;
      this.chkGrab = false;
    }
    this.checkMinDate();
    this.timeselection();
    this.obs.Delivery_Time = "";

    if (this.chkWalkIn == true) {
      if (this.minWTMinDay > new Date()) {
        this.obs.Delivery_Date = "";
      } else {
        this.obs.Delivery_Date = formatDate(new Date(), "dd MMM yyyy", "en");
      }
      // this.obs.Delivery_Date = formatDate(new Date(), "dd MMM yyyy", "en");
      let selectedTime = formatDate(new Date(), "HH", "en");
      let exist = this.obsTimes.filter((t) => t.delivery === selectedTime);
      if (exist.length < 1) {
        this.obs.Delivery_Time = "";
      } else {
        this.obs.Delivery_Time = formatDate(new Date(), "HH", "en");
      }


    }
  }

  async settingsPopover(ev: any) {
    // let popover1 = this.popoverController.create(CalendarPage);
    // popover1.present({
    //   ev: myEvent
    // });

    const siteInfo = { id: 1, name: "edupala" };
    let ev1 = {
      target: {
        getBoundingClientRect: () => {
          return {
            top: 100,
          };
        },
      },
    };

    const popover = await this.popoverController.create({
      component: CalendarPage,
      event: ev,
      // cssClass: 'popover_setting',
      componentProps: {
        site: siteInfo,
      },
      // translucent: true
    });

    popover.onDidDismiss().then((result) => {
      if (result.data == "delete") {
        this.alertService
          .show(
            "Delete Chat?",
            "This will remove the chat. You cannot undo this, but your chat history will reappear if the other user messages you on the same listing.",
            ["Close", "Yes, Delete"]
          )
          .pipe(
            switchMap((reply) => {
              if (reply == "Yes, Delete") {
                return of(true);
              } else {
                return of(false);
              }
            })
          )
          .subscribe((reply) => {
            if (reply) {
              // this.deleteMessage();
            }
          });
      }
      // this.deleteMessage();

      // console.log(result.data);
    });

    return await popover.present();
    /** Sync event from popover component */
  }
}
//(click)="settingsPopover($event)"
