import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { PopoverController } from "@ionic/angular";
import { NgForm } from "@angular/forms";
@Component({
  selector: "app-popproduct",
  templateUrl: "./popproduct.page.html",
  styleUrls: ["./popproduct.page.scss"],
})
export class PopproductPage implements OnInit {
  @ViewChild("f") f: NgForm;
  @ViewChild("Delivery_Time", { read: ElementRef }) Delivery_Time: ElementRef;
  obsDelivery_Time: string;
  obsTimes = [
    {
      Code: 8,
      Name: "8.00AM-9.00AM",
      visible: false,
      self: false,
      delivery: false,
    },
    {
      Code: 9,
      Name: "9.00AM-10.00AM",
      visible: false,
      self: false,
      delivery: false,
    },
    {
      Code: 10,
      Name: "10.00AM-11.00AM",
      visible: true,
      self: false,
      delivery: false,
    },
    {
      Code: 11,
      Name: "11.00AM-12.00PM",
      visible: true,
      self: true,
      delivery: false,
    },
    {
      Code: 12,
      Name: "12.00PM-1.00PM",
      visible: true,
      self: true,
      delivery: false,
    },
    {
      Code: 13,
      Name: "1.00PM-2.00PM",
      visible: true,
      self: true,
      delivery: false,
    },
    {
      Code: 14,
      Name: "2.00PM-3.00PM",
      visible: true,
      self: true,
      delivery: true,
    },
    {
      Code: 15,
      Name: "3.00PM-4.00PM",
      visible: true,
      self: true,
      delivery: true,
    },
    {
      Code: 16,
      Name: "4.00PM-5.00PM",
      visible: true,
      self: false,
      delivery: true,
    },
  ];
  @Input("rowProduct") rowProduct;

  private icons = [
    "american-football",
    "baseball",
    "basketball",
    "football",
    "tennisball",
  ];

   objProduct = [
    {Category_Code:"Ang Ku Kueh", Product_ID:"CT_01", Product_Name:"Red Bean"},
    {Category_Code:"Ang Ku Kueh", Product_ID:"CT_02", Product_Name:"Sweet Bean"},
    {Category_Code:"Ang Ku Kueh", Product_ID:"CT_03", Product_Name:"Red Bun"},
  ];

  allItems = [];
  // public items: Array<{ title: string; icon: string }> = [];
  // public allItems: Array<{ title: string; icon: string }> = [];

  constructor(private popoverController: PopoverController) {
    // for (let i = 0; i < this.icons.length; i++) {
    //   this.items.push({
    //     title: this.icons[i].charAt(0).toUpperCase() + this.icons[i].slice(1),
    //     icon: this.icons[i],
    //   });
    // }
    debugger;
    this.allItems = this.rowProduct;
  }

  async ionViewWillEnter() {
    // this.obs = new DeliveryInfo();
  
    // await this.onEnter();
    this.allItems = this.rowProduct;
  }


  ngOnInit() {
    // this.rowProduct = this.navParams.get('rowProduct');
    debugger;
    console.log(this.rowProduct);
  }

  savechanges() {
    debugger;
    // alert(this.Delivery_Time.nativeElement.value + "");
    // code for setting wifi option in apps
    this.popoverController.dismiss(this.Delivery_Time.nativeElement.value);
  }

  dismiss1(eve){
    debugger;
    // alert(eve.title + "");
    // code for setting wifi option in apps
    this.popoverController.dismiss(eve);
  }

  checkout() {
    // code for setting wifi option in apps
    this.popoverController.dismiss("checkout");
  }
  onSearchTerm(ev: CustomEvent) {
    this.allItems = this.rowProduct;
    const val = ev.detail.value;

    if (val && val.trim() !== "") {
      this.allItems = this.allItems.filter((term) => {
        return term.Product_Name.toLowerCase().indexOf(val.trim().toLowerCase()) > -1 ||  term.Category_Code.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
      });
    }
  }
}
