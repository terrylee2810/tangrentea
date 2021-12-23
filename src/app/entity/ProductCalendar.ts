import { Injectable } from "@angular/core";
@Injectable()
export class ProductCalendar {
   Product_Calendar_ID: number;
   Name : string;
   Start_Date_From: string;
   End_Date_To : string;
   Delivery_Amount : number;
   Product_Calendar_Detail:ProductCalendarDetail[];
   Seq : number;
}

export class ProductCalendarDetail {
   Product_ID: number;
}

