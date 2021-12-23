import { Injectable } from "@angular/core";
import { BooleanValueAccessor } from "@ionic/angular";
@Injectable()
export class Product {
   Disabled_Message:string;
   Daily_Qty:number;
   Disabled_Product: boolean;
   Product_ID: number;
   Product_Name: string;
   Product_Name2: string;
   Price: number;
   Description: string;   
   Image_Path: any;
   Image_Base64: any; 
   Category_Code:string;
   Location_Code:string;
   Meetup:string;
   Category_Name:string;
   Location_Name:string;
   Product_Image:Product_Image[];
   Created_User: number;
   Creator_Profile_Image_Path:string;
   Creator_Name: string; 
   Is_New: number; 
   Qty: number;
   Is_Mon: boolean;
   Is_Tue: boolean;
   Is_Wed: boolean;
   Is_Thu: boolean;
   Is_Fri: boolean;
   Is_Sat: boolean;
   Internal_Name : string;
   Seq : number;
   Format_Price: string;
   Start_List_Date : string;
   End_List_Date : string;
   Wholesales_Price: string;
   Min_Qty : number;
   Internal_Code : string;
}

export class Product_Image {
   Product_ID: number;
   Image_Index: number;
   Image_Base64: any; 
   Image_Path: string;
   Is_Url: boolean;
   Is_Change: boolean;
   imgURL: any;
   Image_Url: string; 
   Image_Name: string; 
}

export class Categories_Product {
   Category_Product:Category_Product[];
}


export class Category_Product {
   Category_Code:string;
   Description:string;
   Total_Qty:number;
   Total:number;
   Format_Total: string;
   Product:Product[];
}
