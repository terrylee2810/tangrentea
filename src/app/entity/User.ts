import { Injectable } from "@angular/core";
@Injectable()
export class User {
   User_ID: number;
   Is_Admin: number;
   Member_Type:string;
   User_Name: string;
   First_Name: string;
   Last_Name: string;
   Mobile_No: string;
   User_Email: string;
   Password: string;
   Confirm_Password: string;
   Old_Password: string;
   Country_Code: string;
   Firebase_Token: string;
   Profile_Image_Path: any;
   Profile_Image_Base64: any;
   FB_ID: string;
   Profile_Image_Url: string;
   User_Token: string;
   Is_Checked: boolean;
   Sales_Type: string;
   User_Location: string;

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

