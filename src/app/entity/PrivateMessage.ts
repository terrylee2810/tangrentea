import { Injectable } from "@angular/core";

export class PrivateMessageHeader {
   Display_Offer: number;
   Sender_ID: number;
   Giver_Name: string;   
   Sender_Profile_Image_Path: string;
   Sender_Name:string;
   Giver_Profile_Image_Path:string;
   Message_Details:[];
}



@Injectable()
export class PrivateMessage {
   Log_Detail_ID: number;
   Title: string;
   Message: string;
   Response: string;
   Log_ID: number;
   Receiver_ID: number;
   Item_ID: number;
   Sender_ID: number;
   Sender_Name: string;
   Sender_Updated_DateTime: string;
   Sender_Profile_Image_Name: string;
   Sender_Profile_Image_Url: string;
   Sender_Profile_Image_Path: string;
   Last_Created_Ago: string;
}

export class PrivateMessageDet {
   Message: string;
   Sender_ID: number;
}

export class Message {
   Log_ID: number;
   Title: string;
   Message: string;
}
