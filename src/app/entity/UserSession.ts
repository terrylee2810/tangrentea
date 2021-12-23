import { Injectable } from "@angular/core";
@Injectable({
   providedIn: "root"
 })
export class UserSession {
   User_ID: number;
   User_Name: string;
   Is_Admin: number;
   Password: string;
   User_Email: string;
   First_Name: string;
   Last_Name: string;
   Display_Name: string;
   Profile_Image_Path: string;
   Token: string;
   FB_ID: string;
   User_Token: string;
   Member_Type: string;
   Sales_Type: string;
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
