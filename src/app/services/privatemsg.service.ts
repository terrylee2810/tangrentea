import { Injectable} from "@angular/core";
import { HttpsServices } from './https.service';
import { UrlService } from './url';

@Injectable()
export class PrivateMsgService {

  constructor(
    private httpsServices: HttpsServices,
    private url: UrlService
  ) { 

  }


  acceptOrder(obj){
    let objlogin = {
      // Sender_ID: obj.Sender_ID
    };
    
    return this.httpsServices.httpPost$(this.url.AcceptOrder,obj);
  }



  getMessageList(obj){
   
    
    return this.httpsServices.httpPost$(this.url.GetMessageList,obj);
  }


  getPrivateMessage(obj){
    let objlogin = {
      Sender_ID: obj.Sender_ID
    };
    
    return this.httpsServices.httpPost$(this.url.GetPrivateMessageList,obj);
  }

  updateReadStatus(obj){
    return this.httpsServices.httpPost$(this.url.UpdateReadStatus,obj);
  }

  sendMessage(obj){  
    return this.httpsServices.httpPost$(this.url.SendMessage,obj);
  }

  
  deleteMessage(obj){  
    return this.httpsServices.httpPost$(this.url.DeleteMessage,obj);
  }

  makeOffer(obj){  
    return this.httpsServices.httpPost$(this.url.MakeOffer,obj);
  }

  getNumberNotification(obj){
  
    return this.httpsServices.httpPost$(this.url.GetNumberNotification,obj);
  }

  contactUs(obj){  
    return this.httpsServices.httpPost$(this.url.ContactUs,obj);
  }
}
