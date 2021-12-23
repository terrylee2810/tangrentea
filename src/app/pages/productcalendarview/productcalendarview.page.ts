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
import {
  NavController,
  ModalController,
  AlertController,
  PopoverController,
} from "@ionic/angular";
import { NgForm } from "@angular/forms";
import { UserService } from "src/app/services/user.service";
import { ConfigManager } from "src/app/services/config.service";
import Swal from 'sweetalert2';
import { ProductCalendarService } from "src/app/services/productcalendar.service";
import { ProductCalendar, ProductCalendarDetail } from "src/app/entity/ProductCalendar";
import { formatDate } from "@angular/common";
import { switchMap } from "rxjs/operators";
import { PopproductPage } from "src/app/modal/popproduct/popproduct.page";
import { ProductService } from "src/app/services/product.service";
@Component({
  selector: "app-productcalendarview",
  templateUrl: "./productcalendarview.page.html",
  styleUrls: ["./productcalendarview.page.scss"],
})
export class ProductcalendarviewPage implements OnInit, OnDestroy {
  @ViewChild("f") f: NgForm;

  private gridApi;
  private gridColumnApi;

  columnDefs = [
    {
      headerName: "Category",
      field: "Category_Code",
      filter: "agTextColumnFilter",
      floatingFilter: true,
    },
    {
      headerName: "Product",
      field: "Product_Name",
      filter: "agTextColumnFilter",
      floatingFilter: true,
    },
    {
      field: "Product_ID",
      headerName: "Action",
      minWidth: 100,
      width: 100,
      cellRenderer: function (params) {
        // let keyData = params.data.Order_No;
        let newLink = `<a [routerLink]="[]" style="cursor: pointer;text-decoration: underline;">Delete</a>`;
        return newLink;
      },
      onCellClicked: (params) => {
        this.removeRowData(params.data.Product_ID);
        // this.productcalendardelete(params.data.Product_Calendar_ID, params.data.Name);
      },
    },
  ];

  defaultColDef: {
    flex: 1;
    sortable: true;
    filter: true;
    floatingFilter: true;
  };

  rowSelection = "multiple";

  rowData = [];
  rowProduct: any;

  private subscription: Subscription;
  public isedit = false;
  error_messages = {
    Name: { required: "cannot be blank." },
    Start_Date_From: { required: "cannot be blank." },
    End_Date_To: { required: "cannot be blank." },
    Seq: { required: "cannot be blank." },
  };

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
    private configManager: ConfigManager,
    private productCalendarService: ProductCalendarService,
    public obsProductCalendar: ProductCalendar,
    public popoverController: PopoverController,
    public modalController: ModalController,
    public productService: ProductService
  ) {}

  async ionViewWillEnter() {
    this.obsProductCalendar = new ProductCalendar();
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
        event.url.includes("/productcalendarview")
      ) {
      }
    });
  }
  data: any;
  public async onEnter(): Promise<void> {
    this.global.clearAllNgFormFields(this.f);
    this.obsUserSession = await this.configManager.GetUser();
    this.data = await this.GetParams();
    this.refreshmenu();
    this.bindData();
  }

  public obsMenu: any[];

  async refreshmenu() {
    let tempMenu: any[];
    tempMenu = this.configManager.GetMenu();
    let idx;
    idx = tempMenu.findIndex((x) => x.idx === 16);

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
    // let newRowData = this.rowData.slice();
    // let newData = {Product_ID: 1, Product_Name:"Test"};
    // this.rowData.push(newData);

    this.obsProductCalendar = new ProductCalendar();
    console.log("this.data : " + JSON.stringify(this.data));
    if (this.data.id) {
      console.log("edit");
      this.isedit = true;
      let obj = {
        Product_Calendar_ID: this.data.id,
        Created_User: this.obsUserSession.User_ID,
      };

      this.loading.present();

      let serv = forkJoin([
        await this.productCalendarService.getproductcalendarbyid(obj),
        await this.productService.getProductLists(obj),
      ]).subscribe((resp) => {
        debugger;
        let res = resp[0];
        this.rowProduct = resp[1][0].Result;
        serv.unsubscribe();
        if (res[0].Result_Code == 1) {
          var result = res[0].Result[0];
          result.Start_Date_From = formatDate(
            result.Start_Date_From,
            "dd MMM yyyy",
            "en"
          );
          result.End_Date_To = formatDate(
            result.End_Date_To,
            "dd MMM yyyy",
            "en"
          );
          this.obsProductCalendar = result;
          debugger;
          this.rowData = result.Product_Calendar_Detail;
        } else {
          this.alertService.showOkay(res[0].Message);
        }
        this.loading.dismiss();
      });
    } else {
      this.obsProductCalendar.Seq=999;
      let obj = {
        Product_Calendar_ID: this.data.id,
        Created_User: this.obsUserSession.User_ID,
      };
      let serv = (await this.productService.getProductLists(obj)).subscribe(
        (res) => {
          serv.unsubscribe();
          this.loading.dismiss();

          if (res[0].Result_Code == 1) {
            this.rowProduct = res[0].Result;
          }
        }
      );
      console.log("insert");
    }
  }

  back() {
    this.router.navigate(["productcalendar"]);
  }

  async onSubmit() {
    this.data = await this.GetParams();
    this.global.validateAllNgFormFields(this.f);

    if (!this.global.validNgFormFields(this.f)) {
      return;
    }
    if (!this.f.valid) {
      return;
    }
    var form = this.obsProductCalendar;
    let arrProductCalendarDetail =Array<ProductCalendarDetail>();

    debugger;
    this.rowData.forEach((rowData, index) => {
      debugger;
      let newrow : ProductCalendarDetail = new ProductCalendarDetail();
      newrow.Product_ID = rowData.Product_ID;
      arrProductCalendarDetail.push(newrow);
    })

    let obj = {
      Product_Calendar_ID: this.data.id,
      Name: form.Name,
      Start_Date_From: form.Start_Date_From,
      End_Date_To: form.End_Date_To,
      Created_User: this.obsUserSession.User_ID,
      Product_Calendar_Detail : arrProductCalendarDetail,
      Seq: form.Seq,
    };

    debugger;
    console.log(obj);
    this.loading.present();
    debugger;
    if (this.isedit) {
      let serv = (await this.productCalendarService.edit(obj)).subscribe(
        (res) => {
          this.loading.dismiss();
          serv.unsubscribe();
          if (res[0].Result_Code == 1) {
            Swal.fire("Successful", res[0].Message, "success");
            // this.alertService.showOkay(res[0].Message);
            //this.obsPostcode = res[0].Result[0];
          } else {
            this.alertService.showOkay(res[0].Message);
          }
        }
      );
    } else {
      let serv = (await this.productCalendarService.insert(obj)).subscribe(
        async (res) => {
          this.loading.dismiss();
          serv.unsubscribe();
          if (res[0].Result_Code == 1) {
            //this.obsPostcode = res[0].Result[0];
            debugger;

            Swal.fire("Successful", res[0].Message, "success");

            let navigationExtras: NavigationExtras = {
              queryParams: {
                id: res[0].IdentityKey,
              },
            };
            this.router.navigate(["productcalendarview"], navigationExtras);
            this.data = {
              queryParams: {
                id: res[0].IdentityKey,
              },
            };
            this.isedit = true;
          } else {
            this.alertService.showOkay(res[0].Message);
          }
        }
      );
    }
  }
 

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }

  removeRowData = (productID) => {
    debugger;
    // let focusedNode = this.gridApi.getSelectedRows()[0];
    let newRowData = this.rowData.filter((row) => {
      return row.Product_ID !== productID;
    });
    this.rowData = newRowData;
  };

  async settingsPopover() {
    //$event
    let ev: any;
    //async settingsPopover(ev: any) 
    // const modal = await this.modalController.create({
    //   component: PopproductPage,
    //   cssClass: 'my-custom-class',
    //   componentProps: {
    //     'firstName': 'Douglas',
    //     'lastName': 'Adams',
    //     'middleInitial': 'N'
    //   }
    // });
    // return await modal.present();

    // const siteInfo = { id: 1, name: 'edupala' };
    debugger;
    const popover = await this.popoverController.create({
      component: PopproductPage,
      event: ev,
      componentProps: {
        rowProduct: this.rowProduct,
      },
      cssClass:'my-custom-class',
      translucent: false,
    });

    popover.onDidDismiss().then((result) => {
      debugger;
      //  alert(result.data.Product_Code);
      if (result.data != undefined) {
        const exist = this.rowData.findIndex(
          (x) => x.Product_ID === result.data.Product_ID
        );

        if (exist < 0) {
          let newRowData = this.rowData.slice();
          let newRow = {
            Product_ID: result.data.Product_ID,
            Category_Code: result.data.Category_Code,
            Product_Name: result.data.Product_Name,
          };
          newRowData.push(newRow);
          this.rowData = newRowData;
        }
      }

      if (this.data.id) {
        let navigationExtras: NavigationExtras = {
          queryParams: {
            id: this.data.id,
          },
        };
        this.router.navigate(["productcalendarview"], navigationExtras);
        this.isedit = true;
      }
     
      // this.isedit = true;
      // // this.data = {
      // //   queryParams: {
      // //     id: res[0].IdentityKey,
      // //   },
      // // };
      // this.isedit = true;
      // //  if(result.data != undefined){
      //   let data1 ={Product_ID:1, Product_Name:"Test"};

      //   this.rowData.push({Product_ID:1, Product_Name:"Test"});
      // //  }
    });

    return await popover.present();
    /** Sync event from popover component */
  }

  onChange1(data) {
    if (data._selected)
      this.obsProductCalendar.Start_Date_From = formatDate(
        data._selected,
        "dd MMM yyyy",
        "en"
      );
  }
  onChangeTo(data) {
    if (data._selected)
      this.obsProductCalendar.End_Date_To = formatDate(
        data._selected,
        "dd MMM yyyy",
        "en"
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

  onKeyUp(item) {
    if (parseInt(item) > 999) {
      item.Qty = 999;
    }
  }
}
