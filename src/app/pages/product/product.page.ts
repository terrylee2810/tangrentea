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
import { User } from "src/app/entity/User";
import { UserService } from 'src/app/services/user.service';
import { ProductService } from "src/app/services/product.service";
import { ConfigManager } from "src/app/services/config.service";
import { ProductseqPage } from 'src/app/pages/productseq/productseq.page';
import { formatDate } from "@angular/common";

@Component({
  selector: "app-product",
  templateUrl: "./product.page.html",
  styleUrls: ["./product.page.scss"],
})
export class ProductPage implements OnInit, OnDestroy {
  @ViewChild("f") f: NgForm;
  private subscription: Subscription;
  private gridApi;
  private gridColumnApi;
  
  columnDefs = [
    {
      field: 'Product_ID',
      headerName: '#',
      cellRenderer: function (params) { 
        let newLink = `<a [routerLink]="[]" style="cursor: pointer;text-decoration: underline;">View</a>`;
        return newLink;
      },
      minWidth: 100,
      width: 100,
      onCellClicked: (params) => {
        this.productview(params.data.Product_ID); 
      }, 
    },
    {
      headerName: 'Category Name',
      field: 'Category_Name',   
      minWidth: 150,
      width: 150,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      sortable: true, 
      resizable: true,
    },
    {
      headerName: 'Product Name',
      field: 'Product_Name', 
      minWidth: 150,
      width: 150,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      sortable: true, 
      resizable: true,
    },
    {
      headerName: 'Normal Price',
      field: 'Price', 
      minWidth: 150,
      width: 150,
    },
    {
      headerName: 'Wholesales Price',
      field: 'Wholesales_Price',   
      minWidth: 150,
      width: 150,
    },
    {
      headerName: 'Start Date #',
      field: 'Start_List_Date_Display',
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
      field: 'End_List_Date_Display',
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
      headerName: 'Monday',
      field: 'Is_Mon',  
      minWidth: 100,
      width: 100,
      cellRenderer: params => {
        return `<input type='checkbox' ${params.value ? 'checked' : ''} />`;
      }
    },
    {
      headerName: 'Tuesday',
      field: 'Is_Tue',  
      minWidth: 100,
      width: 100,
      cellRenderer: params => {
        return `<input type='checkbox' ${params.value ? 'checked' : ''} />`;
      }
    },
    {
      headerName: 'Wednesday',
      field: 'Is_Wed',  
      minWidth: 100,
      width: 100,
      cellRenderer: params => {
        return `<input type='checkbox' ${params.value ? 'checked' : ''} />`;
      }
    },
    {
      headerName: 'Thursday',
      field: 'Is_Thu',  
      minWidth: 100,
      width: 100,
      cellRenderer: params => {
        return `<input type='checkbox' ${params.value ? 'checked' : ''} />`;
      }
    },
    {
      headerName: 'Friday',
      field: 'Is_Fri', 
      minWidth: 100,
      width: 100, 
      cellRenderer: params => {
        return `<input type='checkbox' ${params.value ? 'checked' : ''} />`;
      }
    },
    {
      headerName: 'Saturday',
      field: 'Is_Sat',  
      minWidth: 100,
      width: 100,
      cellRenderer: params => {
        return `<input type='checkbox' ${params.value ? 'checked' : ''} />`;
      }
    },
    {
      field: 'Product_ID',
      headerName: 'Action',
      minWidth: 100,
      width: 100,
      cellRenderer: function (params) { 
        let newLink = `<a [routerLink]="[]" style="cursor: pointer;text-decoration: underline;">Delete</a>`;
        return newLink;
      },
      onCellClicked: (params) => {
        this.productdelete(params.data.Product_ID, params.data.Product_Name); 
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
    private router: Router,
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public productService: ProductService,
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
        event.url.includes("/product")
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
    let idx = tempMenu.findIndex((x) => x.idx === 15);

    tempMenu[idx].bold = true;
 this.obsMenu =tempMenu.filter((x)=> x.role.includes("*")||x.role.includes(this.obsUserSession.Member_Type+';')).sort();
  }

  isLoaded: boolean = false; 
  async bindData() {

    let obj = {
      Created_User: this.obsUserSession.User_ID
    };

    this.loading.dismiss();
    this.loading.present();

    let serv = (await this.productService.getProductLists(obj)).subscribe(
      (res) => {
        serv.unsubscribe();
        this.loading.dismiss();
        
        if (res[0].Result_Code == 1) { 
          this.rowData = res[0].Result;
        } else {
          this.rowData =[]; 
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

  productview(refId) {

    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: refId,
      },
    };
    this.router.navigate(["productview"], navigationExtras);
  }

  back() {
    this.router.navigate(['dashboard']);
  }

  productadd() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
      },
    };
    this.router.navigate(["productview"], navigationExtras);
  }

  async productdelete(refId, zonename) {

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
        this.deleteproduct(refId);
      }
    });

  }

  async deleteproduct(refId) {
    this.loading.present();
    let obj = {
      Product_ID: refId
    };
    let serv = (await this.productService.delete(obj)).subscribe(
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

  async productseq(){
    let navigationExtras: NavigationExtras = {
      queryParams: {
      },
    };
    this.router.navigate(["productseq"], navigationExtras);
  }
}


 
 

   