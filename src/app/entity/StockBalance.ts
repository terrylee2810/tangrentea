import { Injectable } from "@angular/core";
@Injectable()
export class StockBalance {
   Stock_Date:string;
   Operated_By:number;
   Stock_Balance_Detail:StockBalanceDet[];
}

export class StockBalanceDet {
   Stock_Date:string;
   Product_ID:number;
   Stock_Qty:number;
   WalkIn_Qty:number;
}
