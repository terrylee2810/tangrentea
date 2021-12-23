import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, OnDestroy, ElementRef, ViewChild, } from "@angular/core";
import { LoadingService } from "src/app/services/loading.service";
import { AlertService } from "src/app/services/alert.service";
import { GlobalService } from "src/app/services/global.service";
import { UserSession } from "src/app/entity/UserSession";
import { Subscription, of } from "rxjs";
import { Router, NavigationEnd, ActivatedRoute, NavigationExtras } from "@angular/router";
import { NavController, ModalController, AlertController, } from "@ionic/angular";
import { UserService } from 'src/app/services/user.service';
import { ConfigManager } from "src/app/services/config.service";
import { ProductService } from "src/app/services/product.service";
import Swal from 'sweetalert2'

@Component({
  selector: 'app-productseq',
  templateUrl: './productseq.page.html',
  styleUrls: ['./productseq.page.scss'],
})
export class ProductseqPage implements OnInit {

  private subscription: Subscription;
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
    private configManager: ConfigManager,
    private productService: ProductService,
  ) {

  }
  async ionViewWillEnter() {
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
        event.url.includes("/productseq")
      ) {
      }
    });
  }

  data: any;
  public async onEnter(): Promise<void> {
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
    idx = tempMenu.findIndex((x) => x.idx === 11);

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

    console.log("edit");
    let obj = {
      Created_User: this.obsUserSession.User_ID
    };
    this.loading.present();

    let serv = (await this.productService.getProductLists(obj)).subscribe(
      (res) => {
        serv.unsubscribe();
        this.loading.dismiss();

        if (res[0].Result_Code == 1) {
          this.rowData = res[0].Result;
        } else {
          this.rowData = [];
        }
      }
    );
  }

  async onSubmit() {
    this.data = await this.GetParams();
    var data = [];
    console.log(this.rowData);
    for (var i = 0; i < this.rowData.length; i++) {
      var row = this.rowData[i];
      data.push({
        Product_ID: row.Product_ID,
        Seq: i + 1
      });
    }
    let obj = {
      Seq_Arrange: JSON.stringify(data),
      Created_User: this.obsUserSession.User_ID
    };
    console.log(obj); 
    this.loading.present();
    let serv = (await this.productService.updateseq(obj)).subscribe((res) => {
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


  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.rowData, event.previousIndex, event.currentIndex);
  }
}