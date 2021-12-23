import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  Validators,
  AbstractControl,
} from "@angular/forms";

import { LoadingService } from "src/app/services/loading.service";
import { AlertService } from "src/app/services/alert.service";
import { UserSession } from "src/app/entity/UserSession";
import { Subscription, of } from "rxjs";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import {
  NavController,
  ModalController,
  AlertController,
} from "@ionic/angular";

import { SwiperComponent, SwiperConfigInterface } from "ngx-swiper-wrapper";


@Component({
  selector: "app-about",
  templateUrl: "./about.page.html",
  styleUrls: ["./about.page.scss"],
})
export class AboutPage implements OnInit, OnDestroy {
  @ViewChild("myCanvas") canvasEl: ElementRef;
  @ViewChild("slidetop") swipertop: SwiperComponent;
  public configtop: SwiperConfigInterface = {};
  slideOpts = {
    initialSlide: 0,
    speed: 500,
    autoplay: true,
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
  };
  lat = 1.277469;
  lng = 103.839994;

  private subscription: Subscription;
  public act: string;
  public id: number;

  public DisplayUpload: boolean = true;
  public Count: number = 0;
  public editIndex: number = 0;
  public slideindex : number = 0;
  public slideinterval;

  
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
  ngAfterViewInit() {
    console.log("in heresss");
    this.configtop = {
      observer: true,
      observeParents: true,
      loop: true,
      autoplay: true,
      speed: 1000,
      spaceBetween: 10,
      loopedSlides: 5, //looped slides should be the same
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        type: "bullets",
      },
    };
  }

  constructor(
    public formBuilder: FormBuilder,
    public obsUserSession: UserSession,
    public loading: LoadingService,
    public alertService: AlertService,
    private router: Router,
    public navCtrl: NavController,
    private route: ActivatedRoute,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private element: ElementRef
  ) {
  
  }

  async ionViewWillEnter() {
    // this.showSlides(4);
    // this.slideinterval = setInterval(x=>{this.minusSlides()}, 6000);
    await this.onEnter();
  }

  ionViewWillLeave() {
    // clearInterval(this.slideinterval);
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
      if (event instanceof NavigationEnd && event.url.includes("/about")) {
      }
    });
  }

  public async onEnter(): Promise<void> {
    // this.data = await this.GetParams();
    // this.showSlides(4);
    // this.slideinterval = setInterval(x=>{this.minusSlides()}, 6000);
    this.bindData();
  }

  async bindData() {
    
  }

  // plusSlides(){
     
  //   this.slideindex--;
  //   this.showSlides(this.slideindex--)
  // }
  // minusSlides(){
  //   this.slideindex++;
  //   this.showSlides(this.slideindex++)
  // }

  // showSlides(index) {
  //    debugger;
  //   let slide = this.element.nativeElement.getElementsByClassName("mySlides");
  //   let dots = this.element.nativeElement.getElementsByClassName("dot");
  //   let inum:number =0;

   

  //   for (inum = 0; inum < slide.length; inum++) {
  //     slide[inum].style = "display:none";  
  //   }

   
    
  //   this.slideindex++;
  //   if (this.slideindex > slide.length) {this.slideindex  = 1}    
  //   for (inum = 0; inum < dots.length; inum++) {
  //     dots[inum].className = dots[inum].className.replace(" active", "");
  //   }

  //   if(index>0){
  //     this.slideindex = index;
  //   }

  //   if (index > slide.length) {
  //     this.slideindex = 1;
  //   }   
  //   if (index < 1) {
  //     this.slideindex = slide.length;
  //   }
  //   slide[this.slideindex-1].style = "display:block";  
  //   // slides[slideindex].style.display = "block";
  //   // dots[slideIndex-1].className += " active";
  

  // }
  
}
