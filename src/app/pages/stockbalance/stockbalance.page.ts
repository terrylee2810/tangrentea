import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { LoadingService } from "src/app/services/loading.service";
import { AlertService } from "src/app/services/alert.service";
import { GlobalService } from "src/app/services/global.service";
import { UserSession } from "src/app/entity/UserSession";
import { Subscription, of } from "rxjs";
import { Router, NavigationEnd, ActivatedRoute, NavigationExtras } from "@angular/router";
import Swal from 'sweetalert2'
import {
  NavController,
  ModalController,
  AlertController,
} from "@ionic/angular";
import { NgForm } from "@angular/forms";
import { ConfigManager } from "src/app/services/config.service";
import { StockBalanceService } from "src/app/services/stockbalance.service";
import { formatDate } from "@angular/common";
import { StockBalance, StockBalanceDet } from "src/app/entity/StockBalance";

@Component({
  selector: 'app-stockbalance',
  templateUrl: './stockbalance.page.html',
  styleUrls: ['./stockbalance.page.scss'],
})
export class StockbalancePage implements OnInit, OnDestroy {
  @ViewChild("f") f: NgForm;
  private subscription: Subscription;
  private gridApi;
  private gridColumnApi;
  Delivery_Date:string;
  columnDefs = [
    // {
    //   headerName: 'Date',
    //   field: 'Stock_Date', 
    //   filter: 'agTextColumnFilter',
    //   floatingFilter: true,
    // },
    {
      headerName: 'Category',
      field: 'Category_Code', 
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      minWidth: 180,
      width: 180 ,
      resizable: true, 
     
    },
    {
      headerName: 'Product',
      field: 'Product_Name', 
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      minWidth: 180,
      width: 180 ,
      resizable: true, 
    },
    {
      headerName: 'Walk-In Qty',
      field: 'WalkIn_Qty', 
      minWidth: 80,
      width: 120 ,
      resizable: true, 
      editable:true,
      cellRenderer: function (params) {
        let WalkIn_Qty : number =0;
         if(params.data.WalkIn_Qty !=undefined){
          WalkIn_Qty = params.data.WalkIn_Qty;
         }
         return WalkIn_Qty;
       },
     cellStyle: {'background-color': '#90EE90'}
    },
    {
      headerName: 'Pre-Order Qty',
      field: 'Pre_Order_Qty', 
      minWidth: 80,
      width: 120 ,
      resizable: true, 
      cellRenderer: function (params) {
       let Pre_Order_Qty : number =0;
        if(params.data.Pre_Order_Qty !=undefined){
          Pre_Order_Qty = params.data.Pre_Order_Qty;
        }
        return Pre_Order_Qty;
      },
    },
    {
      headerName: 'Wholesales Qty',
      field: 'Wholesales_Qty', 
      minWidth: 80,
      width: 120 ,
      resizable: true, 
      cellRenderer: function (params) {
        let Wholesales_Qty : number =0;
        if(params.data.Wholesales_Qty !=undefined){
          Wholesales_Qty = params.data.Wholesales_Qty;
        }
        return Wholesales_Qty;
      },
    },

    {
      headerName: 'Shopee Qty',
      field: 'Shopee_Qty', 
      minWidth: 80,
      width: 120 ,
      resizable: true, 
      cellRenderer: function (params) {
        let Shopee_Qty : number =0;
        if(params.data.Shopee_Qty !=undefined){
          Shopee_Qty = params.data.Shopee_Qty;
        }
        return Shopee_Qty;
      },
    },

    {
      headerName: 'Grab Qty',
      field: 'Grab_Qty', 
      minWidth: 80,
      width: 120 ,
      resizable: true, 
      cellRenderer: function (params) {
        let Grab_Qty : number =0;
        if(params.data.Grab_Qty !=undefined){
          Grab_Qty = params.data.Grab_Qty;
        }
        return Grab_Qty;
      },
    },
    {
      headerName: 'Total Plan Qty',
      minWidth: 80,
      width: 120 ,
      resizable: true, 
      // field: 'Wholesales_Qty', 
      valueGetter:(params => {
        debugger;
        let WalkIn_Qty: number=0;
        let Pre_Order_Qty : number=0;
        let Wholesales_Qty : number=0;
        let Shopee_Qty : number=0;
        let Grab_Qty : number=0;
        if(params.data.Wholesales_Qty!=undefined){
          Wholesales_Qty = parseInt(params.data.Wholesales_Qty);
        }
        if(params.data.Pre_Order_Qty!=undefined){
          Pre_Order_Qty = parseInt(params.data.Pre_Order_Qty);
        }
        if(params.data.WalkIn_Qty!=undefined){
          WalkIn_Qty = parseInt(params.data.WalkIn_Qty);
        }
        if(params.data.Shopee_Qty!=undefined){
          Shopee_Qty = parseInt(params.data.Shopee_Qty);
        }
        if(params.data.Grab_Qty!=undefined){
          Grab_Qty = parseInt(params.data.Grab_Qty);
        }
        
        
   
        return Wholesales_Qty+Pre_Order_Qty+ WalkIn_Qty + Shopee_Qty + Grab_Qty;
      })
    },
    {
      headerName: 'To Be Produce Total Qty',
      field: 'Stock_Qty', 
      editable:true,
      minWidth: 80,
      width: 120 ,
      resizable: true, 
      cellRenderer: function (params) {
        let Stock_Qty : number =0;
         if(params.data.Stock_Qty !=undefined){
          Stock_Qty = params.data.Stock_Qty;
         }
         return Stock_Qty;
       },
       cellStyle: {'background-color': '#90EE90'}
    },
  ];

  defaultColDef: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: true,
   
  }
  rowSelection = 'multiple';

  rowData = [];

  public selectedMoment = new Date();

  // totalplan(params) {
  //   return params.data.b * 137;
  // }

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
    public stockBalanceService: StockBalanceService,
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
        event.url.includes("/stockbalance")
      ) {
      }
    });
  }

  public async onEnter(): Promise<void> {
    debugger;
    this.obsUserSession = await this.configManager.GetUser();
    // this.bindData();
    this.isLoaded = true;
    this.refreshmenu();
  }

  public obsMenu: any[];

  async refreshmenu() {
    let tempMenu: any[];
    tempMenu = this.configManager.GetMenu();
    let idx = tempMenu.findIndex((x) => x.idx === 18);

    tempMenu[idx].bold = true;
    this.obsMenu =tempMenu.filter((x)=> x.role.includes("*")||x.role.includes(this.obsUserSession.Member_Type+';')).sort();
  }

  isLoaded: boolean = false;
  //obsPostcodeList: any;
  async bindData(fromSearch:boolean=false) {
    if(fromSearch==true){
      if(this.Delivery_Date == undefined || this.Delivery_Date=='' ){
        Swal.fire('Error',"Please select the date.", "error");
        return
      }
    }

    let obj = {
      Created_User: this.obsUserSession.User_ID,
      Stock_Date: this.Delivery_Date
    };

    this.loading.dismiss();
    this.loading.present();

    let serv = (await this.stockBalanceService.getstockbalance(obj)).subscribe(
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



  back() {
    this.router.navigate(['dashboard']);
  }


  onChangeDate(data) {
    this.Delivery_Date = formatDate(data._selected, "dd MMM yyyy", "en");
    this.rowData =[];
  }
  
  async onSubmit(){
    if(this.Delivery_Date == undefined || this.Delivery_Date=='' ){
      Swal.fire('Error',"Please select the date.", "error");
      return
    }
   
    if(this.rowData.length < 1 ){
      Swal.fire('Error',"No record.", "error");
      return
    }
  
    debugger;
    let objStockBalance : StockBalance;
    objStockBalance = new StockBalance;
    objStockBalance.Operated_By = this.obsUserSession.User_ID;
    objStockBalance.Stock_Date = this.Delivery_Date;
    objStockBalance.Stock_Balance_Detail = Array<StockBalanceDet>(); 
    
    let objStockBalanceDet : StockBalanceDet;
    this.rowData.forEach((gridData, index) => {
      if(!isNaN(+gridData.Stock_Qty)){
        if(gridData.Stock_Qty>0){
          objStockBalanceDet= new StockBalanceDet;
          objStockBalanceDet.Product_ID = gridData.Product_ID;
          objStockBalanceDet.Stock_Qty = gridData.Stock_Qty;
          objStockBalanceDet.WalkIn_Qty = gridData.WalkIn_Qty;
          objStockBalance.Stock_Balance_Detail.push(objStockBalanceDet);
        }
      }
    });

    if(objStockBalance.Stock_Balance_Detail.length < 1 ){
      Swal.fire('Error',"No changes.", "error");
      return
    }

    this.loading.present();
    debugger;
    
      let serv = (await this.stockBalanceService.insert(objStockBalance)).subscribe( async (res) => {
        this.loading.dismiss();
        serv.unsubscribe();
        if (res[0].Result_Code == 1) {
          Swal.fire('Successful',
          res[0].Message,
           "success");
        } else {
          this.alertService.showOkay(res[0].Message);
        }
      });
  }

  searchList(){

    this.bindData(true);
  }
}

