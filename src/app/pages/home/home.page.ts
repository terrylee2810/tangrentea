import { Component, OnInit, OnDestroy } from "@angular/core";
import { LoadingService } from "src/app/services/loading.service";
import { AlertService } from "src/app/services/alert.service";
import { UserSession } from "src/app/entity/UserSession";
import { Subscription, of } from "rxjs";
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
} from "@ionic/angular";
import { DeliveryInfo } from "src/app/entity/Cart";
import { ConfigManager } from "src/app/services/config.service";
import { EventService } from "src/app/services/event";
import { AnnouncementService } from "src/app/services/announcement.service";

import Swal from 'sweetalert2';
import { formatDate } from "@angular/common";
@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit, OnDestroy {
  private subscription: Subscription;
  slideOpts = {
    initialSlide: 2,
    speed: 500,
    autoplay: true,
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
  };

  slideOpts2 = {
    initialSlide: 2,
    speed: 1250,
    autoplay: true,
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
  };


  slideOpts3 = {
    initialSlide: 2,
    speed: 500,
    autoplay: true,
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
  };


  slideOpts4 = {
    initialSlide: 2,
    speed: 1250,
    autoplay: true,
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
  };

  isLoaded:boolean=false;
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

  constructor(
    public obsUserSession: UserSession,
    public loading: LoadingService,
    public alertService: AlertService,
    private router: Router,
    public navCtrl: NavController,
    private route: ActivatedRoute,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public configManager: ConfigManager,
    public eventService: EventService,
    public announcementService: AnnouncementService
  ) {}
  obsDeliveryInfo: DeliveryInfo;
  async ionViewWillEnter() {
    //
    // let total:number=0;
    // this.obsDeliveryInfo = await this.configManager.GetDeliveryInfo();
    // this.obsDeliveryInfo.Cart.forEach((cart, index) => {
    //   total += cart.Qty
    // });
    // this.eventService.notificationRefresh(total);
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
      if (event instanceof NavigationEnd && event.url.includes("/home")) {
      }
    });
  }

  public async onEnter(): Promise<void> {
    // setTimeout(() => {
    //   this.bindData();
    // }, 5000);
   
  }

  async bindData() {
   this.isLoaded =true;
  }



  tapordernow() {
    this.ordernow("");
  }

  ordernow(refType) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        type: refType,
      },
    };
    if (refType == "") {
      this.router.navigate(["delivery"]);
    } else {
      this.router.navigate(["delivery"], navigationExtras);
    }
  }
}
