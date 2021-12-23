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
import Swal from 'sweetalert2'
import {
  NavController,
  ModalController,
  AlertController,
} from "@ionic/angular";
import { NgForm } from "@angular/forms";
import { ConfigManager } from "src/app/services/config.service";
import { ProductCalendarService } from "src/app/services/productcalendar.service";

@Component({
  selector: 'app-productcalendar',
  templateUrl: './productcalendar.page.html',
  styleUrls: ['./productcalendar.page.scss'],
})
export class ProductcalendarPage implements OnInit, OnDestroy {
  @ViewChild("f") f: NgForm;
  private subscription: Subscription;
  private gridApi;
  private gridColumnApi;

  columnDefs = [
    {
      field: 'View',
      headerName: '#',
      minWidth: 100,
      width: 100,
      cellRenderer: function (params) {
        // let keyData = params.data.Order_No;
        let newLink = `<a [routerLink]="[]" style="cursor: pointer;text-decoration: underline;">View</a>`;
        return newLink;
      },
      onCellClicked: (params) => {
        this.productcalendarview(params.data.Product_Calendar_ID); 
      }, 
    },
    {
      headerName: 'Name',
      field: 'Name', 
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    },
    {
      headerName: 'Start Date #',
      field: 'Start_Date_Display',
      minWidth: 210,
      width: 210,
      sortable: true,
      resizable: true,
      filter: 'agDateColumnFilter',
      floatingFilter: true,
      filterParams: {
        // provide comparator function
        comparator: (filter, val) => {
          debugger;
          const dateAsString = val;

          if (dateAsString == null) {
            return 0;
          }

          // In the example application, dates are stored as dd/mm/yyyy
          // We create a Date object for comparison against the filter date
          const dateParts = dateAsString.split('/');
          const day = Number(dateParts[0]);
          const month = Number(dateParts[1]) - 1;
          const year = Number(dateParts[2]);
          const cellDate = new Date(year, month, day);

          // Now that both parameters are Date objects, we can compare
          if (cellDate < filter) {
            return -1;
          } else if (cellDate > filter) {
            return 1;
          }
          return 0;
        }
      }
    },
    {
      headerName: 'End Date #',
      field: 'End_Date_Display',
      minWidth: 210,
      width: 210,
      sortable: true,
      resizable: true,
      filter: 'agDateColumnFilter',
      floatingFilter: true,
      filterParams: {
        // provide comparator function
        comparator: (filter, val) => {
          debugger;
          const dateAsString = val;

          if (dateAsString == null) {
            return 0;
          }

          // In the example application, dates are stored as dd/mm/yyyy
          // We create a Date object for comparison against the filter date
          const dateParts = dateAsString.split('/');
          const day = Number(dateParts[0]);
          const month = Number(dateParts[1]) - 1;
          const year = Number(dateParts[2]);
          const cellDate = new Date(year, month, day);

          // Now that both parameters are Date objects, we can compare
          if (cellDate < filter) {
            return -1;
          } else if (cellDate > filter) {
            return 1;
          }
          return 0;
        }
      }
    }, 
    {
      headerName: 'Seq',
      field: 'Seq', 
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    },
    {
      field: 'Product_Calendar_ID',
      headerName: 'Action',
      minWidth: 100,
      width: 100,
      cellRenderer: function (params) {
        // let keyData = params.data.Order_No;
        let newLink = `<a [routerLink]="[]" style="cursor: pointer;text-decoration: underline;">Delete</a>`;
        return newLink;
      },
      onCellClicked: (params) => {
        this.productcalendardelete(params.data.Product_Calendar_ID, params.data.Name); 
      }, 
    }
  ];

  defaultColDef: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: true
  }
  rowSelection = 'multiple';

  rowData = [];

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
    public productCalendarService: ProductCalendarService,
    private configManager: ConfigManager
  ) {

  }

  async ionViewWillEnter() {
    this.obsUserSession = await this.configManager.GetUser();
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
        event.url.includes("/orderlist")
      ) {
      }
    });
  }

  public async onEnter(): Promise<void> {
    this.obsUserSession = await this.configManager.GetUser();
    this.bindData();
    this.refreshmenu();
  }

  public obsMenu: any[];

  async refreshmenu() {
    let tempMenu: any[];
    tempMenu = this.configManager.GetMenu();
    let idx = tempMenu.findIndex((x) => x.idx === 16);

    tempMenu[idx].bold = true;
    this.obsMenu =tempMenu.filter((x)=> x.role.includes("*")||x.role.includes(this.obsUserSession.Member_Type+';')).sort();
  }

  isLoaded: boolean = false;
  //obsPostcodeList: any;
  async bindData() {

    let obj = {
      Created_User: this.obsUserSession.User_ID
    };

    this.loading.dismiss();
    this.loading.present();

    let serv = (await this.productCalendarService.getproductcalendar(obj)).subscribe(
      (res) => {
        serv.unsubscribe();
        this.loading.dismiss();
        
        if (res[0].Result_Code == 1) {
          //this.obsPostcodeList = res[0].Result;
          this.rowData = res[0].Result;
        } else {
          this.rowData =[];
          // if(res[0].Message =="no record"){
          //   this.rowData = null;
          // }
          // this.alertService.showOkay(res[0].Message);
          // this.BoolUserList =false;
        }
        this.isLoaded = true;
      }
    );
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi; 
    this.gridApi.sizeColumnsToFit();
  } 

  productcalendarview(refId) {

    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: refId,
      },
    };
    this.router.navigate(["productcalendarview"], navigationExtras);
  }

  back() {
    this.router.navigate(['dashboard']);
  }

  productcalendaradd() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
      },
    };
    this.router.navigate(["productcalendarview"], navigationExtras);
  }

  async productcalendardelete(refId, zonename) {

    Swal.fire({
      title: "Are you sure want to delete " + zonename + " ?",
      text: "Once deleted, you will not be able to recover this record!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((willDelete) => {
      console.log(willDelete);
      if (willDelete.isConfirmed) {
        this.deletecalendarservice(refId);
      }
    });

  }

  async deletecalendarservice(refId) {
    this.loading.present();
    let obj = {
      Product_Calendar_ID: refId
    };
    let serv = (await this.productCalendarService.delete(obj)).subscribe(
      (res) => {
        serv.unsubscribe();
        this.loading.dismiss();
        this.bindData();
        if (res[0].Result_Code == 1) {
          Swal.fire('Successful',
            "Record deleted.",
            "success");
        } else {
          Swal.fire('Failed',
            res[0].Message,
            "error");
        }
      }
    );
  }
}

