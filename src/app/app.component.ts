import {
  Component,
  OnInit,
  NgZone,
  HostListener,
  ViewChild,
} from "@angular/core";

import {
  Platform,
  MenuController,
  NavController,
  ToastController,
  PopoverController,
} from "@ionic/angular";
// import { SplashScreen } from "@awesome-cordova-plugins/splash-screen/ngx";
// import { StatusBar } from "@awesome-cordova-plugins/status-bar/ngx";
import { tap, switchMap } from "rxjs/operators";
import { ConfigManager } from "./services/config.service";
// import { FcmService } from "./services/fcm";
import { fromEvent, Observable, of, Subscription } from "rxjs";
import { ToastService } from "./services/toast.service";
import { NavigationExtras, Router } from "@angular/router";
import { UserSession } from "./entity/UserSession";
import { EventService } from "./services/event";
import { AlertService } from "./services/alert.service";
import { UserService } from "./services/user.service";
import { LoadingService } from "./services/loading.service";
import { environment } from "src/environments/environment";
import Pusher from "pusher-js";
import { PrivateMsgService } from "./services/privatemsg.service";
import { ScreensizeService } from "./services/screensize.service";

import { DeliveryInfo } from "./entity/Cart";
// import { SwPush } from '@angular/service-worker';
import Swal from 'sweetalert2';
import { AnnouncementService } from "./services/announcement.service";
import { formatDate } from "@angular/common";
@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit {
  @ViewChild("content") private content: any;

  public selectedIndex = 0;
  private subscription: Subscription;
  public selectedMainIndex = undefined;
  public selectedSubIndex = undefined;

  public labels = ["Family", "Friends", "Notes", "Work", "Travel", "Reminders"];
  public firebasetoken: string;
  public appPages = [];
  public arrMenu = [
    {
      name: "Home",
      title: "Home",
      url: "home",
      icon: "home",
      visible: true,
    },
    {
      name: "About Us",
      title: "About Us",
      url: "about",
      icon: "info-circle",
      visible: true,
    },
    {
      name: "Order Online",
      title: "Order Online",
      url: "delivery",
      icon: "file-alt",
      visible: true,
      badge: true,
    },
    {
      name: "FAQ",
      title: "FAQ",
      url: "faq",
      icon: "question-circle",
      visible: true,
    },
    {
      name: "My Account",
      title: "My Account",
      url: "dashboard",
      icon: "user",
      visible: true,
    },
    {
      name: "Cart",
      title: "Cart",
      url: "Cart",
      icon: "shopping-cart",
      visible: true,
    },
    {
      name: "Sign Up",
      title: "Sign Up",
      url: "registermember",
      icon: "user-plus",
      visible: true,
    },
    {
      name: "Login",
      title: "Login",
      url: "login",
      icon: "sign-in-alt",
      visible: true,
    },
    {
      name: "Logout",
      title: "Logout",
      url: "home",
      icon: "sign-out-alt",
      visible: true,
    },
    // {
    //   name: "DeliveryListReport",
    //   title: "Delivery List Report",
    //   url: "rptdelivery",
    //   icon: "sign-out-alt",
    //   visible: true,
    // },
    
  ];
  numberbadges: number = 0;
  loginName: string = "";
  private onfocus;
  private onblur;
  private pusher;
  private isLoading: boolean = false;
  channelname: string;
  popControl;

  isDesktop: boolean;
  obsDeliveryInfo: DeliveryInfo;
  constructor(
    private platform: Platform,
    // private splashScreen: SplashScreen,
    // private statusBar: StatusBar,
    private configManager: ConfigManager,
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    // private fcmService: FcmService,
    private toastService: ToastService,
    private router: Router,
    public obsUserSession: UserSession,
    private eventService: EventService,
    private zone: NgZone,
    private alertService: AlertService,
    public loading: LoadingService,
    private userServices: UserService,
    private pmService: PrivateMsgService,
    private screensizeService: ScreensizeService,
    private popoverController: PopoverController,
    private announcementService: AnnouncementService,
    
  ) // private swpush: SwPush
  {
    debugger;
    this.initializeApp();
    debugger;
    this.eventService.logoutSource$.subscribe(async (islogout: boolean) => {
      
      this.checkLogin();
    
    });
    debugger;
    this.eventService.notificationSource$.subscribe((data: number) => {
      this.numberbadges = data;
    });
    debugger;
    this.screensizeService.isDesktopView().subscribe((isDesktop) => {
      if (this.isDesktop && !isDesktop) {
        // Reload because our routing is out of place
        // window.location.reload();
      }

      this.isDesktop = isDesktop;
    });
    // this.checkLogin();
  }

  async checkLogin(){
     
    this.obsUserSession = await this.configManager.GetUser();
    if (this.obsUserSession.Display_Name != undefined) {
      this.loginName = this.obsUserSession.Display_Name;
      this.isLogin = true;
    }else{
      this.loginName = "";
      this.isLogin = false;
     
    }
    this.menuRefresh();
  }
  onReceiveMsg(event) {
     
    if (event.data && event.data["isFirebaseMessaging"]) {
      this.toastService.show(
        "sforegroundddsss3asdasd3",
        "bottom",
        5000,
        "danger"
      );
    }
  }

  initializeApp() {
    debugger;
    this.screensizeService.onResize(this.platform.width());
    this.platform.ready().then(() => {
      if (this.platform.is("cordova")) {
        // this.statusBar.styleDefault();
        // this.splashScreen.hide();
      }
    });
  }
  @HostListener("window:resize", ["$event"])
  private onResize(event) {
    this.screensizeService.onResize(event.target.innerWidth);
  }
  // public selectedMainIndex = 0;
  // public selectedSubIndex = 0;
  selectedMenu: any;

  mainPage(page, index) {
    this.selectedSubIndex = undefined;
    if (this.selectedMainIndex === index) {
      this.selectedMainIndex = undefined;
    } else {
      this.selectedMainIndex = index;
    }
    if (page.url !== "") {
      if (page.name === "Logout") {
        let result = this.alertService
          .show("Logout", "Do you want to logout?", ["No", "Yes"])
          .pipe(
            switchMap((reply) => {
              if (reply == "Yes") {
                return of(true);
              } else {
                 
                return of(false);
              }
            })
          )
          .subscribe((reply) => {
            if (reply) {
              this.tapLogout(page.url);
            }
          });
      } else if (page.name === "Cart") {
        this.tapCheckout();
      }
      else {
        this.router.navigate([page.url]);
        this.menuCtrl.toggle();
      }
    } else {
    }
  }

  async ionViewWillEnter() {}

  isLogin: boolean = false;
  async ngOnInit() {
   let total: number = 0;

   this.checkLogin();

    this.obsDeliveryInfo = await this.configManager.GetDeliveryInfo();

debugger;
    let strCreatedDate = formatDate(new Date(), "yyyy MMM dd", "en");
    if (this.obsDeliveryInfo.Created_Date != strCreatedDate) {
      this.configManager.RemoveDeliveryInfo();
      this.numberbadges = 0;
    }
    else{
      if (this.obsDeliveryInfo.Cart != undefined) {
        this.obsDeliveryInfo.Cart.forEach((cart, index) => {
          total += cart.Qty;
        });
      }
      this.numberbadges = total;
    }



    if (environment.production) {
      if (location.protocol === "http:") {
        window.location.href = location.href.replace("http", "https");
      }
    }

    this.obsUserSession = await this.configManager.GetUser();



    debugger;
    // this.configManager.RemoveAnnouncement();
    let objAnnouncement = await this.configManager.GetAnnouncement();
    // if (objAnnouncement != null) {
      let strFilterDate = formatDate(new Date(), "yyyy MMM dd", "en");
      // if (objAnnouncement.Filter_Date != strFilterDate) {
        let obj = { Filter_Date: strFilterDate };
        this.configManager.SetAnnouncement(JSON.stringify(obj));
        let serv = (
          await this.announcementService.getannouncementmsg(obj)
        ).subscribe((res) => {
          debugger;
          serv.unsubscribe();
          debugger;
          if (res[0].Result_Code == 1) {
            Swal.fire(res[0].AltMessage, res[0].Message);
          }
        });
      // }
    // }
  
    await this.userRefresh();
    this.menuRefresh();
  }

  async userRefresh() {
    this.obsUserSession = await this.configManager.GetUser();
    console.log("User_Name : " + this.obsUserSession.User_Name);
    if (this.obsUserSession.User_Name === undefined) {
      this.obsUserSession.User_Name = "Guest";
    }
  }

  menuRefresh() {
    let indHome,indAboutUs,indOrderOnline,indFAQ,indMyAccount,indCart,indLogin,indLogout,indSignUp
    indHome = this.arrMenu.findIndex((x) => x.title === "Home");
    indAboutUs = this.arrMenu.findIndex((x) => x.title === "About Us");
    indOrderOnline = this.arrMenu.findIndex((x) => x.title === "Order Online");
    indFAQ = this.arrMenu.findIndex((x) => x.title === "FAQ");
    indMyAccount = this.arrMenu.findIndex((x) => x.title === "My Account");
    indCart = this.arrMenu.findIndex((x) => x.title === "Cart");
    indLogin = this.arrMenu.findIndex((x) => x.title === "Login");
    indLogout = this.arrMenu.findIndex((x) => x.title === "Logout");
    indSignUp = this.arrMenu.findIndex((x) => x.title === "Sign Up");

    if (this.obsUserSession.User_ID === undefined) {
      this.arrMenu[indMyAccount].visible = false;
      this.arrMenu[indLogout].visible = false;
      this.arrMenu[indLogin].visible = true;
    } else {
      this.arrMenu[indLogin].visible = false;
      this.arrMenu[indLogout].visible = true;
      this.arrMenu[indMyAccount].visible = true;
    }

    this.appPages = this.arrMenu.filter((t) => t.visible === true);
  }

  async tapLogout(url: string, redirect: boolean = true) {
 
    this.configManager.RemoveUser();
    this.eventService.logoutRefresh(true);
    this.router.navigate(['home']);
  }

  async test() {
     
    await this.popoverController.dismiss();
    // this.popControl.dismiss();
    //this.popoverController.dismiss();
  }

  async tapCheckout() {
     
    this.obsDeliveryInfo = await this.configManager.GetDeliveryInfo();
    if (this.obsDeliveryInfo.Cart == undefined) {
      this.router.navigate(["delivery"]);
    } else {
      if (this.obsDeliveryInfo.Is_Customise_Packaging == false) {
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
  }
  async tapUser() {
    this.router.navigate(["dashboard"]);
  }
}

