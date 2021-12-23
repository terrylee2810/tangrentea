// import {MatDatepickerModule} from '@angular/material/datepicker';
import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
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
import { base64StringToBlob } from 'blob-util';
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
import { HttpClient } from "@angular/common/http";
import { Grid } from "ag-grid-community";
import { OrderService } from "src/app/services/order.service";
import { formatDate } from "@angular/common";



// import Datepicker from 'path/to/node_modules/vanillajs-datepicker/js/Datepicker.js';
@Component({
  selector: "app-jxorderlist",
  templateUrl: "./jxorderlist.page.html",
  styleUrls: ["./jxorderlist.page.scss"],
})
export class JxorderlistPage implements OnInit, OnDestroy {
  @ViewChild("f") f: NgForm;
  // @ViewChild("myGrid") ngGrid: HTMLElement;
  private subscription: Subscription;


  columnDefs = [
    {
      headerName: 'Delivery Date #',
      field: 'Delivery_Date_Dt',
      // cellRenderer: (data) => {
      //   debugger;
      //   return new Date("2021 Apr 01")
      //  },
      minWidth: 130,
      width: 130,
      sortable: true,
      resizable: true,
      filter: 'agDateColumnFilter',
      floatingFilter: true,
      filterParams: {
        // provide comparator function
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          debugger;
          const dateAsString = cellValue;

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
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          } else if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
          return 0;
        }
      }
    },
    {
      headerName: '',
      field: 'selected',
      minWidth: 60,
      width: 60,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
    },
    {
      field: 'Order_ID',
      headerName: 'Order Detail',
      cellRenderer: function (params) {
        // let keyData = params.data.Order_No;
        let newLink = `<a [routerLink]="[]" style="cursor: pointer;text-decoration: underline;">View</a>`;
        return newLink;
      },
      onCellClicked: (params) => {
        debugger;
        let navigationExtras: NavigationExtras = {
          queryParams: {
            id: params.data.Order_ID,
            act: "jx"
          },
        };
        this.router.navigate(["orderview"], navigationExtras);
        // if (params.colDef.field === '') {
        //    // do your stuff
        // }
      },
      width: 100,
      resizable: true,
    },
    {
      headerName: 'Sales Type',
      field: 'Sales_Type',
      minWidth: 80,
      width: 100,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    },
  
    {
      headerName: 'Order #',
      field: 'Order_No',
      minWidth: 80,
      width: 100,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      sortable: true,
      resizable: true,
    },
    {
      headerName: 'Phone #',
      field: 'Billing_Phone',
      minWidth: 80,
      width: 100,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      sortable: true,
      resizable: true,
    },
    {
      headerName: 'Shipping Type',
      field: 'Shipping_Type',
      minWidth: 100,
      width: 100,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      sortable: true,
      resizable: true,
    },
    
    {
      headerName: 'Delivery Time #',
      field: 'Delivery_Time',
      minWidth: 80,
      width: 100,
      sortable: true,
      resizable: true,    
      cellRenderer: function (params) {
        // let keyData = params.data.Order_No;
        let newLink =params.data.Delivery_Time_Format;
        return newLink;
      },
    },
   
    {
      headerName: 'Payment Status',
      field: 'Payment_Status',
      minWidth: 100,
      width: 100,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      sortable: true,
      resizable: true,
    },
    
    {
      headerName: 'Pay_Upon_Collection_Desc',
      field: 'Pay_Upon_Collection_Desc',
      minWidth: 100,
      width: 100,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      sortable: true,
      resizable: true,
    },
    {
      headerName: 'Extra_Bag_Desc',
      field: 'Extra_Bag_Desc',
      minWidth: 100,
      width: 100,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      sortable: true,
      resizable: true,
    },
 
   
    
    {
      headerName: 'Packaging Status',
      field: 'Packaging_Status',
      minWidth: 100,
      width: 100,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      sortable: true,
      resizable: true,
    },
    {
      headerName: 'Delivery Status',
      field: 'Delivery_Status',
      minWidth: 100,
      width: 100,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      sortable: true,
      resizable: true,
    },
    {
      headerName: 'Email',
      field: 'Billing_Email',
      minWidth: 80,
      width: 100,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      sortable: true,
      resizable: true,
    },
    {
      headerName: 'Order Status',
      field: 'Order_Status',
      minWidth: 100,
      width: 100,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      sortable: true,
      resizable: true,
    },
    {
      field: 'Order_ID',
      headerName: 'Print Invoice',
      cellRenderer: function (params) {
        // let keyData = params.data.Order_No;
        let newLink = `<a [routerLink]="[]" style="cursor: pointer;text-decoration: underline;" >Print Invoice</a>`;
        return newLink;
      },
      onCellClicked: (params) => {
        debugger;
        this.downloadinvoice(params.data.Order_ID);
      },
      width: 130
    },
    {
      field: 'Order_ID',
      headerName: 'Print Customise Form',
      cellRenderer: function (params) {
        // let keyData = params.data.Order_No;
        let newLink = `<a [routerLink]="[]" style="cursor: pointer;text-decoration: underline;">Print Customise Form</a>`;
        return newLink;
      },
      onCellClicked: (params) => {
        debugger;
        this.downloadcustomise(params.data.Order_ID);
      },
      width: 180
    },
    {
      field: 'Order_ID',
      headerName: 'Print Delivery List',
      cellRenderer: function (params) {
        // let keyData = params.data.Order_No;
        let newLink = `<a [routerLink]="[]" style="cursor: pointer;text-decoration: underline;">Print Delivery List</a>`;
        return newLink;
      },
      onCellClicked: (params) => {
        this.downloaddelivery(params.data.Order_ID,params.data.Order_No);
      },
      width: 180
    },
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
    public userServices: UserService,
    public obs: User,
    public eventService: EventService,
    private configManager: ConfigManager,
    private orderService: OrderService
  ) {

    // let eGridDiv = document.querySelector('#myGrid');

    // this.ngGrid

  }

  async ionViewWillEnter() {
    // new Grid(this.ngGrid, this.gridOptions);
    this.obs = new User();
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
        event.url.includes("/login")
      ) {
      }
    });
  }

  public async onEnter(): Promise<void> {
    this.global.clearAllNgFormFields(this.f);
    this.obs = new User();
    this.obsUserSession = await this.configManager.GetUser();
    this.refreshmenu();
    this.bindData();
  }

  public obsMenu: any[];

  async refreshmenu() {
    let tempMenu: any[];
    tempMenu = this.configManager.GetMenu();
    let idx = tempMenu.findIndex((x) => x.idx === 10);

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

    let serv = (await this.orderService.getPagingOrder(obj)).subscribe(
      (res) => {
        debugger;
        serv.unsubscribe();
        this.loading.dismiss();

        if (res[0].Result_Code == 1) {
          this.rowData = res[0].Result;

        } else {
          // this.alertService.showOkay(res[0].Message);
          // this.BoolUserList =false;
        }
        this.isLoaded = true;
      }
    );
  }

  private gridApi;
  private gridColumnApi;

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // this.http
    //   .get(
    //     'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinnersSmall.json'
    //   )
    //   .subscribe(data => {
    //     this.rowData = data;
    //   });
  }

  rowclicked() {

  }



  async paymentreceived() {
    debugger;
    let selectedNodes = this.gridApi.getSelectedNodes();
    let selectedData = selectedNodes.map(node => node.data);
    // alert(`Selected Nodes:\n${JSON.stringify(selectedData)}`);
    let inum: number;
    let order_ids = new Array();

    if (selectedData.length < 1) {
      Swal.fire('Error', "Please select the order.", "error");
      return
    }



    for (inum = 0; inum < selectedData.length; inum++) {
      order_ids.push(selectedData[inum].Order_ID);
      // alert( selectedData[inum].Order_ID);
    }


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
        Swal.fire('Successful', "Payment status updated successfully.", "success");
        // this.router.navigate(["home"]);
        // this.configManager.SetUser(JSON.stringify(res[0].Result[0]));
        // this.eventService.publishFormRefresh();
      } else {
        this.alertService.showOkay(res[0].Message);
      }

    });
  }

  async deliverycompleted() {
    debugger;
    let selectedNodes = this.gridApi.getSelectedNodes();
    let selectedData = selectedNodes.map(node => node.data);
    // alert(`Selected Nodes:\n${JSON.stringify(selectedData)}`);
    let inum: number;
    let order_ids = new Array();

    if (selectedData.length < 1) {
      Swal.fire('Error', "Please select the order.", "error");
      return
    }



    for (inum = 0; inum < selectedData.length; inum++) {
      order_ids.push(selectedData[inum].Order_ID);
      // alert( selectedData[inum].Order_ID);
    }


    let obj = {
      Authorizer_User: this.obsUserSession.User_ID,
      Order_Ids: order_ids,
    };

    this.loading.present();
    let serv = (await this.orderService.deliverycompleted(obj)).subscribe((res) => {
      serv.unsubscribe();
      this.loading.dismiss();
      if (res[0].Result_Code == 1) {
        this.bindData();
        Swal.fire('Successful', "Delivery status updated successfully.", "success");
        // this.router.navigate(["home"]);
        // this.configManager.SetUser(JSON.stringify(res[0].Result[0]));
        // this.eventService.publishFormRefresh();
      } else {
        this.alertService.showOkay(res[0].Message);
      }

    });
  }

  async ordersuspended() {
    debugger;
    let selectedNodes = this.gridApi.getSelectedNodes();
    let selectedData = selectedNodes.map(node => node.data);
    // alert(`Selected Nodes:\n${JSON.stringify(selectedData)}`);
    let inum: number;
    let order_ids = new Array();

    if (selectedData.length < 1) {
      Swal.fire('Error', "Please select the order.", "error");
      return
    }



    for (inum = 0; inum < selectedData.length; inum++) {
      order_ids.push(selectedData[inum].Order_ID);
      // alert( selectedData[inum].Order_ID);
    }


    let obj = {
      Authorizer_User: this.obsUserSession.User_ID,
      Order_Ids: order_ids,
    };

    this.loading.present();
    let serv = (await this.orderService.ordersuspended(obj)).subscribe((res) => {
      serv.unsubscribe();
      this.loading.dismiss();
      if (res[0].Result_Code == 1) {
        this.bindData();
        Swal.fire('Successful', "Orded suspended updated successfully.", "success");
        // this.router.navigate(["home"]);
        // this.configManager.SetUser(JSON.stringify(res[0].Result[0]));
        // this.eventService.publishFormRefresh();
      } else {
        this.alertService.showOkay(res[0].Message);
      }

    });
  }

  async packagingcompleted() {
    debugger;
    let selectedNodes = this.gridApi.getSelectedNodes();
    let selectedData = selectedNodes.map(node => node.data);
    // alert(`Selected Nodes:\n${JSON.stringify(selectedData)}`);
    let inum: number;
    let order_ids = new Array();

    if (selectedData.length < 1) {
      Swal.fire('Error', "Please select the order.", "error");
      return
    }



    for (inum = 0; inum < selectedData.length; inum++) {
      order_ids.push(selectedData[inum].Order_ID);
      // alert( selectedData[inum].Order_ID);
    }


    let obj = {
      Authorizer_User: this.obsUserSession.User_ID,
      Order_Ids: order_ids,
    };

    this.loading.present();
    let serv = (await this.orderService.packagingcompleted(obj)).subscribe((res) => {
      serv.unsubscribe();
      this.loading.dismiss();
      if (res[0].Result_Code == 1) {
        this.bindData();
        Swal.fire('Successful', "Pacakaging status updated successfully.", "success");
        // this.router.navigate(["home"]);
        // this.configManager.SetUser(JSON.stringify(res[0].Result[0]));
        // this.eventService.publishFormRefresh();
      } else {
        this.alertService.showOkay(res[0].Message);
      }

    });
  }

  async downloadinvoice(orderId){
    debugger;
    let obj ={
      Delivery_Date : null,
      Order_ID:orderId
    };
    this.loading.present();
    let serv = (await this.orderService.downloadinvoicewithid(obj)).subscribe((res) => {
      debugger;
      serv.unsubscribe();
      this.loading.dismiss();
      if (res[0].Result_Code == 1) {
        const file = base64StringToBlob(res[0].Data, "application/pdf");
        var ua = navigator.userAgent.toLowerCase(); 
        if (ua.indexOf('safari') != -1) { 
          if (ua.indexOf('chrome') > -1) {
            let fileURL = URL.createObjectURL(file);
            window.open(fileURL,'_blank');
          } else {
            const data = window.URL.createObjectURL(file);
            var link = document.createElement('a');
            link.href = data;
            link.download="file.pdf";
            link.click();
            setTimeout(function(){
              // For Firefox it is necessary to delay revoking the ObjectURL
              window.URL.revokeObjectURL(data);
            }, 100);
          }
        }
      
      } else {
        Swal.fire('Error',res[0].Message, "error");
      }
     
    });
  }

  async downloadcustomise(orderId){
    debugger;
    let obj ={
      Delivery_Date : null,
      Order_ID:orderId
    };
    this.loading.present();
    let serv = (await this.orderService.downloadcustomisepackagingwithid(obj)).subscribe((res) => {
      debugger;
      serv.unsubscribe();
      this.loading.dismiss();
      if (res[0].Result_Code == 1) {
        const file = base64StringToBlob(res[0].Data, "application/pdf");
        var ua = navigator.userAgent.toLowerCase(); 
        if (ua.indexOf('safari') != -1) { 
          if (ua.indexOf('chrome') > -1) {
            let fileURL = URL.createObjectURL(file);
            window.open(fileURL,'_blank');
          } else {
            const data = window.URL.createObjectURL(file);
            var link = document.createElement('a');
            link.href = data;
            link.download="file.pdf";
            link.click();
            setTimeout(function(){
              // For Firefox it is necessary to delay revoking the ObjectURL
              window.URL.revokeObjectURL(data);
            }, 100);
          }
        }
      } else {
        Swal.fire('Error',res[0].Message, "error");
      }
     
    });
  }

  async downloaddelivery(orderId,orderNo){
    debugger;
    let obj ={
      Delivery_Date : null,
      Order_ID:orderId,
      Order_No:orderNo,
    };
    this.loading.present();
    let serv = (await this.orderService.downloaddeliverylistwithid(obj)).subscribe((res) => {
      debugger;
      serv.unsubscribe();
      this.loading.dismiss();
      if (res[0].Result_Code == 1) {
        const file = base64StringToBlob(res[0].Data, "application/pdf");
        var ua = navigator.userAgent.toLowerCase(); 
        if (ua.indexOf('safari') != -1) { 
          if (ua.indexOf('chrome') > -1) {
            let fileURL = URL.createObjectURL(file);
            window.open(fileURL,'_blank');
          } else {
            const data = window.URL.createObjectURL(file);
            var link = document.createElement('a');
            link.href = data;
            link.download="file.pdf";
            link.click();
            setTimeout(function(){
              // For Firefox it is necessary to delay revoking the ObjectURL
              window.URL.revokeObjectURL(data);
            }, 100);
          }
        }
      } else {
        Swal.fire('Error',res[0].Message, "error");
      }
     
    });
  }
}
