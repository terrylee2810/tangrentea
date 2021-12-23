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
import { UserService } from 'src/app/services/user.service';
import { ConfigManager } from "src/app/services/config.service";

@Component({
  selector: 'app-jxuserlist',
  templateUrl: './jxuserlist.page.html',
  styleUrls: ['./jxuserlist.page.scss'],
})
export class JxuserlistPage implements OnInit, OnDestroy {
  @ViewChild("f") f: NgForm;
  private subscription: Subscription;
  private gridApi;
  private gridColumnApi;

  columnDefs = [
    {
      field: 'User_ID',
      headerName: '#',
      minWidth: 100,
      width: 100,
      cellRenderer: function (params) {
        // let keyData = params.data.Order_No;
        let newLink = `<a [routerLink]="[]" style="cursor: pointer;text-decoration: underline;">View</a>`;
        return newLink;
      },
      onCellClicked: (params) => {
        this.postcodeview(params.data.User_ID); 
      }, 
    },
    {
      headerName: 'Role',
      field: 'Member_Type_Desc', 
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      sortable: true,
      resizable: true,
    },
   
    {
      headerName: 'First Name',
      field: 'First_Name', 
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      sortable: true,
      resizable: true,
    },
    {
      headerName: 'Last Name',
      field: 'Last_Name', 
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      sortable: true,
      resizable: true,
    },
    {
      headerName: 'Email',
      field: 'User_Email', 
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      sortable: true,
      resizable: true,
    },
    {
      field: 'User_ID',
      headerName: 'Action',
      minWidth: 100,
      width: 100,
      cellRenderer: function (params) {
        // let keyData = params.data.Order_No;
        let newLink = `<a [routerLink]="[]" style="cursor: pointer;text-decoration: underline;">Delete</a>`;
        return newLink;
      },
      onCellClicked: (params) => {
        this.delete(params.data.User_ID,params.data.User_Email); 
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
    public userService: UserService,
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
    let idx = tempMenu.findIndex((x) => x.idx === 17);

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

    let serv = (await this.userService.getuserslist(obj)).subscribe(
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

  postcodeview(refId) {

    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: refId,
      },
    };
    this.router.navigate(["jxuserview"], navigationExtras);
  }

  back() {
    this.router.navigate(['dashboard']);
  }

  add() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
      },
    };
    this.router.navigate(["jxuserview"], navigationExtras);
  }

  async delete(refId, zonename) {

    Swal.fire({
      title: "Are you sure want to delete " + zonename + " ?",
      text: "Once deleted, you will not be able to recover this record!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((willDelete) => {
      console.log(willDelete.isConfirmed);
      if (willDelete.isConfirmed) {
        this.deletepostcode(refId);
      }
    });

  }

  async deletepostcode(refId) {
    this.loading.present();
    let obj = {
      User_ID: refId
    };
    let serv = (await this.userService.delete(obj)).subscribe(
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

