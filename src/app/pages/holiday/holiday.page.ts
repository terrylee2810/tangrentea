import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
} from "@angular/core";
import { LoadingService } from "src/app/services/loading.service";
import { AlertService } from "src/app/services/alert.service";
import { UserSession } from "src/app/entity/UserSession";
import { Subscription } from "rxjs";
import { Router, NavigationEnd, ActivatedRoute, NavigationExtras } from "@angular/router";
import Swal from 'sweetalert2'
import {
  NavController,
  ModalController,
  AlertController,
} from "@ionic/angular";
import { NgForm } from "@angular/forms";
import { ConfigManager } from "src/app/services/config.service";
import { faMonument } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "@angular/common";
import { OffdayService } from "src/app/services/offday.service";

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.page.html',
  styleUrls: ['./holiday.page.scss'],
})
export class HolidayPage implements OnInit, OnDestroy {
  @ViewChild("f") f: NgForm;
  private subscription: Subscription;
  private gridApi;

  columnDefs = [
    {
      field: 'Offday_ID',
      headerName: '#',
      minWidth: 100,
      width: 100,
      cellRenderer: function (params) {
        // let keyData = params.data.Order_No;
        let newLink = `<a [routerLink]="[]" style="cursor: pointer;text-decoration: underline;">View</a>`;
        return newLink;
      },
      onCellClicked: (params) => {
        this.holidayview(params.data.Offday_ID);
      },
    },
    {
      headerName: 'Name',
      field: 'Name',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    },
    {
      headerName: 'Holiday Date From',
      field: 'Holiday_Date_From',
      valueFormatter:function(param){ 
        return formatDate(param.value,"yyyy MMM dd","en");
      },
    },
    {
      headerName: 'Holiday Date To',
      field: 'Holiday_Date_To',
      valueFormatter:function(param){ 
        return formatDate(param.value,"yyyy MMM dd","en");
      },
    },
    {
      field: 'Offday_ID',
      headerName: 'Action',
      minWidth: 100,
      width: 100,
      cellRenderer: function (params) {
        // let keyData = params.data.Order_No;
        let newLink = `<a [routerLink]="[]" style="cursor: pointer;text-decoration: underline;">Delete</a>`;
        return newLink;
      },
      onCellClicked: (params) => {
        this.holidaydelete(params.data.Offday_ID, params.data.Name);
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
    public offdayService: OffdayService,
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
        event.url.includes("/holiday")
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
    let idx = tempMenu.findIndex((x) => x.idx === 12);

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

    let serv = (await this.offdayService.getoffday(obj)).subscribe(
      (res) => {
        serv.unsubscribe();
        this.loading.dismiss();

        if (res[0].Result_Code == 1) {
          this.rowData = res[0].Result;
        }else{
          this.rowData =[];
        }
        this.isLoaded = true;
      }
    );
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  holidayview(refId) {

    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: refId,
      },
    };
    this.router.navigate(["holidayview"], navigationExtras);
  }

  back() {
    this.router.navigate(['dashboard']);
  }

  holidayadd() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
      },
    };
    this.router.navigate(["holidayview"], navigationExtras);
  }

  async holidaydelete(refId, zonename) {

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
        this.deleteholiday(refId);
      }
    });
  }

  async deleteholiday(refId) {
    this.loading.present();
    let obj = {
      Offday_ID: refId
    };
    let serv = (await this.offdayService.delete(obj)).subscribe(
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

