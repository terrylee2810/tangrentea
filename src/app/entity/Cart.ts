import { Injectable } from "@angular/core";
@Injectable()
export class Cart {
   Packaging_ID: string;
   Packaging_Name : string;
   Qty : number;
   Cart_Detail:Cart_Detail[];
   
}

export class Category {
   Category_Code :string;
}

export class Cart_Detail {
   Packaging_ID: string;
   Packaging_Name : string;
   Product_ID: number;
   Category_Code :string;
   Image_Path: string;
   Product_Name: string;
   Product_Name2: string;
   Qty : number;
   Before_Qty : number;
   Price : number;
   Format_Price: string;
}

export class DeliveryInfo {
   Created_Date: string;
   Customise_Packaging: number;
   Delivery_Date: string;
   Delivery_Time: string;
   Sales_Type: string;
   Delivery_Type: string;
   Extra_Bag: number;
   Is_Customise_Packaging: boolean;
   Pay_Upon_Collection:boolean;
   Cart_Total: number;
   Cart:Cart[];
   Category: Category[];
   Order_ID: number=0;
   Order_No: string;
   Order_Status: string;
   Payment_Status: string;
   Delivery_Status: string;
   Packaging_Status: string;

   Billing_Order_Note: string;
   Billing_First_Name: string;
   Billing_Last_Name: string;
   Billing_Company_Name: string;
   Billing_Street_Address1: string;
   Billing_Street_Address2: string;
   Billing_City: string;
   Billing_Postcode: string;
   Billing_Phone: string;
   Billing_Email: string;
   Billing_Country: string;

   Shipping_Order_Note: string;
   Shipping_First_Name: string;
   Shipping_Last_Name: string;
   Shipping_Company_Name: string;
   Shipping_Street_Address1: string;
   Shipping_Street_Address2: string;
   Shipping_City: string;
   Shipping_Postcode: string;
   Shipping_Phone: string;
   Shipping_Email: string;
   Shipping_Country: string;
}

export class Order {
   Order_ID: number=0;
   Order_No: string="";

   Due_Amount: number;
   Format_Due_Amount: string;
   Payment_Status: string="";
   Order_Status: string="";
   Order_Date: string="";
   Total: number;
   Format_Total: string;
   Sub_Total: number;
   Format_Sub_Total: string;
   Shipping_Amount: number;
   Format_Shipping_Amount: string;
   Shipping_Type: string;
   Temp_Order_Detail:Order_Detail[];
   Order_Detail:Order_Detail[];
   Order_Detail_Categories: Order_Detail_Category[];


   Delivery_DateTime: string;
   Billing_First_Name: string;
   Billing_Last_Name: string;
   Billing_Company_Name: string;
   Billing_Street_Address1: string;
   Billing_Street_Address2: string;
   Billing_City: string;
   Billing_Postcode: string;
   Billing_Phone: string;
   Billing_Email: string;
   Billing_Order_Note: string;
   Billing_Country: string;

   Shipping_First_Name: string;
   Shipping_Last_Name: string;
   Shipping_Company_Name: string;
   Shipping_Street_Address1: string;
   Shipping_Street_Address2: string;
   Shipping_City: string;
   Shipping_Postcode: string;
   Shipping_Phone: string;
   Shipping_Email: string;
   Shipping_Order_Note: string;
   Shipping_Country: string;
   

   Receipt_Base64: any;
   Receipt_Path: any;


   Receipt1_Base64: any;
   Receipt_Path1: any;

   Created_User: number;

   Extra_Bag: number;
   Sales_Type:string;
   Packaging_Status:string;
   Delivery_Status:string;
   Delivery_Date:string;
   Delivery_Time:number;
   Delivery_TimeS:string;


   Pay_Upon_Collection: number;
   Is_Payment: number;
   Is_Customised: number;
   Num_Customised: number;
   Extra_Bag_Int: number;
}

export class Order_Detail {
   Product_ID: number;
   Packaging_ID: string;
   Packaging_Name: string;
   Product_Name: string;
   Product_Name2: string;
   Category_Code: string;
   Qty : number;;
   Price : number;
   Sub_Total : number;
   Format_Sub_Total : string;
   Image_Path : string;
   Format_Price: string;
}

export class Order_Detail_Category {
   Category_Code : string;
   Sub_Total : number;
   Format_Sub_Total : string;
   Order_Detail:Order_Detail[];
}

export class OrderKey {
   Order_ID : number;
   Shipping_Email : string;
}

export class AnnoucementInfo {
   Filter_Date :string;
}