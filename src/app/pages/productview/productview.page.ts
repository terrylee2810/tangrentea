import { Component, OnInit, OnDestroy, ElementRef, ViewChild, } from "@angular/core";
import { Validators, FormGroup, AbstractControl, Form, NgModel, } from "@angular/forms";
import { LoadingService } from "src/app/services/loading.service";
import { AlertService } from "src/app/services/alert.service";
import { GlobalService } from "src/app/services/global.service";
import { UserSession } from "src/app/entity/UserSession";
import { Subscription, of } from "rxjs";
import { Router, NavigationEnd, ActivatedRoute, NavigationExtras } from "@angular/router";
import { NavController, ModalController, AlertController, } from "@ionic/angular";
import { NgForm } from "@angular/forms";
import { User } from "src/app/entity/User";
import { UserService } from 'src/app/services/user.service';
import { EventService } from "src/app/services/event";
import { ConfigManager } from "src/app/services/config.service";
import { ProductService } from "src/app/services/product.service";
import { Product } from "src/app/entity/Product";
import Swal from 'sweetalert2'
import { formatDate } from "@angular/common";
import { _ } from "ag-grid-community";

@Component({
  selector: 'app-productview',
  templateUrl: './productview.page.html',
  styleUrls: ['./productview.page.scss'],
})
export class ProductviewPage implements OnInit, OnDestroy {
  @ViewChild("f") f: NgForm;
  @ViewChild("hiddenfileinputsingle") hiddenfileinputsingle: ElementRef;

  private subscription: Subscription;
  public isedit = false;
  private img_Path = "";
  private img_Base64 = "";
  public min = new Date();
  public selectedMomentStart: Date;
  public selectedMomentEnd: Date;
  public  obsCategorys = []; 

  error_messages = {
    End_List_Date: { required: "cannot be blank." },
    Start_List_Date: { required: "cannot be blank." },
    Wholesales_Price: { required: "cannot be blank." },
    Internal_Name: { required: "cannot be blank." },
    Description: { required: "cannot be blank." },
    Price: { required: "cannot be blank." },
    Product_Name2: { required: "cannot be blank." },
    Product_Name: { required: "cannot be blank." },
    Category_Code: { required: "cannot be blank." }, 
    Min_Qty: { required: "cannot be blank." }, 
    Daily_Qty: { required: "cannot be blank." }, 
    Seq: { required: "cannot be blank." }, 
    Disabled_Message: { required: "cannot be blank." }, 
  };

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
    public obsProduct: Product
  ) {

  }

  async ionViewWillEnter() {
    this.obsProduct = new Product();
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
        event.url.includes("/productview")
      ) {
      }
    });
  }

  data: any;
  public async onEnter(): Promise<void> {
    this.global.clearAllNgFormFields(this.f);
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
    idx = tempMenu.findIndex((x) => x.idx === 15);

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

    this.obsProduct = new Product();
    this.min.setDate(this.min.getDate() + 1);
 
    if (this.data.id) {
      console.log("edit");
      this.isedit = true;
      let obj = {
        Product_ID: this.data.id,
        Created_User: this.obsUserSession.User_ID
      };
      this.loading.present();
      await this.getcategory();
      let serv = (await this.productService.getproductbyid(obj)).subscribe((res) => {
        console.log(res);
        serv.unsubscribe();
        if (res[0].Result_Code == 1) {
          var result = res[0].Result[0];
          console.log(result);
          result.Start_List_Date = result.Start_List_Date != null ? formatDate(result.Start_List_Date, "dd MMM yyyy", "en") : ""; 
          result.End_List_Date = result.End_List_Date != null ? formatDate(result.End_List_Date, "dd MMM yyyy", "en"): "";  
          
          this.obsProduct = result;
          
        } else {
          this.alertService.showOkay(res[0].Message);
        }
        this.loading.dismiss();
      });
    } else {
      this.obsProduct.Is_Mon = true;
      this.obsProduct.Is_Tue = true;
      this.obsProduct.Is_Wed = true;
      this.obsProduct.Is_Thu = true;
      this.obsProduct.Is_Fri = true;
      this.obsProduct.Is_Sat = true;
      this.obsProduct.Min_Qty = 1;
      this.obsProduct.Seq = 0;
      this.getcategory();
    }
  }  

  // compareById(o1, o2) {
  //   console.log( "o1 : " + o1);
  //   return o1.Category_Code === o2.Category_Code;
  // }

  async getcategory(){
    let obj = { 
      Created_User: this.obsUserSession.User_ID
    };

    let serv = (await this.productService.getallcategory(obj)).subscribe((res) => {
     
      serv.unsubscribe();
     
      if (res[0].Result_Code == 1) {
        
        var result = res[0].Result;
        for(var  i=0 ; i < result.length ; i++){
          var resulti = result[i];
          this.obsCategorys.push({
            Name: resulti.Name,
            Code : resulti.Code
          });
        }
        
      } else {
        this.alertService.showOkay(res[0].Message);
      }
    });
  }
  
  tapupload() {
    this.hiddenfileinputsingle.nativeElement.click();
  }

  async resizeImage(
    img,
    MAX_WIDTH: number = 700,
    MAX_HEIGHT: number = 700,
    quality: number = 1
  ) {
    let promise = new Promise((resolve, reject) => {
      var canvas: any = document.createElement("canvas");
      var image = new Image();

      image.onload = () => {
        var width = image.width;
        var height = image.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");

        ctx.drawImage(image, 0, 0, width, height);

        // IMPORTANT: 'jpeg' NOT 'jpg'
        var dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        resolve(dataUrl);
        // callback(dataUrl)
      };
      image.src = img;
    });

    return await promise; // wait until the promise resolves (*)
  }

  edit(files) { 
    for (let file of files) {

      var reader = new FileReader();
    
      reader.readAsDataURL(file);
      reader.onload = async (_event: any) => {
        var picFile = _event.target;
        var image = new Image();
        image.src = picFile.result;
       
        var img = await this.resizeImage(image.src, 1000, 1000, 0.5);
        this.obsProduct.Image_Path = img;
        this.obsProduct.Image_Base64 = img;

      };


      file.value = "";
    }
    this.hiddenfileinputsingle.nativeElement.value = null;
  }

  onChange1(data) { 
    if(data._selected)
      this.obsProduct.Start_List_Date = formatDate(data._selected, "dd MMM yyyy", "en"); 
  }

  onChange2(data) { 
    if(data._selected)
      this.obsProduct.End_List_Date = formatDate(data._selected, "dd MMM yyyy", "en"); 
  }

  async onSubmit() {
    debugger;
    
    this.data = await this.GetParams();
    this.global.validateAllNgFormFields(this.f);
     
    if (!this.global.validNgFormFields(this.f)) {
      return;
    }
    if (!this.f.valid) {
      return;
    }

 
    var form = this.obsProduct;

    let internalname :string =""
    if(form.Internal_Name ==undefined || form.Internal_Name ==""){
      internalname = form.Product_Name;
    }else{
      internalname = form.Internal_Name;
    }

    let startDate : string;
    let endDate : string;

    if(form.Start_List_Date ==''|| form.Start_List_Date== undefined){
      startDate= null;
    }else{
      startDate= form.Start_List_Date ;
    }
    if(form.End_List_Date ==''|| form.End_List_Date== undefined){
      endDate= null;
    }else{
      endDate= form.End_List_Date;
    }
    let obj = {
      Product_ID: this.data.id,
      Product_Name: form.Product_Name,
      Product_Name2: form.Product_Name2,
      Price: form.Price,
      Description: form.Description,
      Image_Base64: form.Image_Base64,
      Start_List_Date: startDate,
      End_List_Date: endDate,
      Category_Code: form.Category_Code,
      Internal_Name: internalname,
      Wholesales_Price: form.Wholesales_Price,
      Is_Mon: form.Is_Mon,
      Is_Tue: form.Is_Tue,
      Is_Wed: form.Is_Wed,
      Is_Thu: form.Is_Thu,
      Is_Fri: form.Is_Fri,
      Is_Sat: form.Is_Sat,
      Disabled_Product: form.Disabled_Product,
      Daily_Qty: form.Daily_Qty,
      Min_Qty: form.Min_Qty,
      Seq: form.Seq,
      Disabled_Message: form.Disabled_Message,
      Created_User: this.obsUserSession.User_ID
    };
    console.log(obj);
   
    debugger;
    if (this.isedit) {
      this.loading.present();
      let serv = (await this.productService.edit(obj)).subscribe((res) => {
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

    } else {
      if(this.obsProduct.Image_Base64 == undefined){
        Swal.fire('Error',
        "Please upload product image.",
        "error");
        return
      }
      this.loading.present();
      let serv = (await this.productService.insert(obj)).subscribe(async (res) => {
        this.loading.dismiss();
        serv.unsubscribe();
        if (res[0].Result_Code == 1) {
          Swal.fire('Successful',
            res[0].Message,
            "success");

          let navigationExtras: NavigationExtras = {
            queryParams: {
              id: res[0].IdentityKey,
            },
          };
          this.router.navigate(["productview"], navigationExtras);
          this.data = {
            queryParams: {
              id: res[0].IdentityKey,
            },
          };
          this.isedit = true;

        } else {
          this.alertService.showOkay(res[0].Message);
        }

      });
    }
  } 
  onInput(event: any) {
    const pattern = /[0-9]/; // without ., for integer only
    let inputChar = String.fromCharCode(
      event.which ? event.which : event.keyCode
    );

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
      return false;
    }
    return true;
  }

  onKeyUp(item) {
    if (parseInt(item) > 999) {
      item.Qty = 999;
    }
  }
}