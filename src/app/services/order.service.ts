import { Injectable} from "@angular/core";
import { HttpsServices } from '../services/https.service';
import { UrlService } from './url';

@Injectable()
export class OrderService {

  constructor(
    private httpsServices: HttpsServices,
    private url: UrlService
  ) { 

  }
  addOrder(obj){
    return this.httpsServices.httpPost$(this.url.InsertOrder,obj);
  }

  getPagingOrder(obj){
    return this.httpsServices.httpPost$(this.url.GetPagingOrderList,obj);
  }

  getOrder(obj){
    return this.httpsServices.httpPost$(this.url.GetOrder,obj);
  }

  uploadreceipt(obj){
    return this.httpsServices.httpPost$(this.url.UploadReceipt,obj);
  }

  uploadreceipt1(obj){
    return this.httpsServices.httpPost$(this.url.UploadReceipt1,obj);
  }

  uploadreceiptbyuser(obj){
    return this.httpsServices.httpPost$(this.url.UploadReceiptByUser,obj);
  }

  uploadreceiptbyuser1(obj){
    return this.httpsServices.httpPost$(this.url.UploadReceiptByUser1,obj);
  }
  
  getOrderLists(obj){
    return this.httpsServices.httpPost$(this.url.GetOrderList,obj);
  }

  getOrderByUser(obj){
    return this.httpsServices.httpPost$(this.url.GetOrderByUser,obj);
  }

  paymentcompleted(obj){
    return this.httpsServices.httpPost$(this.url.PaymentReceived,obj);
  }

  paymentcompleted1(obj){
    return this.httpsServices.httpPost$(this.url.PaymentReceived1,obj);
  }
  deliverycompleted(obj){
    return this.httpsServices.httpPost$(this.url.DeliveryCompleted,obj);
  }
  packagingcompleted(obj){
    return this.httpsServices.httpPost$(this.url.PackagingCompleted,obj);
  }
  ordersuspended(obj){
    return this.httpsServices.httpPost$(this.url.OrderSuspended,obj);
  }
  orderedit(obj){
    return this.httpsServices.httpPost$(this.url.UpdateOrder,obj);
  }
  downloadinvoice(obj){
    return this.httpsServices.httpPost$(this.url.DownloadInvoice,obj);
  }
  downloadinvoicewithid(obj){
    return this.httpsServices.httpPost$(this.url.DownloadInvoiceWithId,obj);
  }
  downloadcustomisepackaging(obj){
    return this.httpsServices.httpPost$(this.url.DownloadCustomisePackaging,obj);
  }
  downloadcustomisepackagingwithid(obj){
    return this.httpsServices.httpPost$(this.url.DownloadCustomisePackagingWithId,obj);
  }
  downloaddeliverylist(obj){
    return this.httpsServices.httpPost$(this.url.DownloadDeliveryList,obj);
  }
  downloaddeliverylistwithid(obj){
    return this.httpsServices.httpPost$(this.url.DownloadDeliveryListWithId,obj);
  }

  downloaddeliverybreakdown(obj){
    return this.httpsServices.httpPost$(this.url.DownloadDeliveryBreakdown,obj);
  }

  downloaddeliverysummary(obj){
    return this.httpsServices.httpPost$(this.url.DownloadDeliverySummary,obj);
  }

  downloadproductpPlan(obj){
    return this.httpsServices.httpPost$(this.url.DownloadProductPlan,obj);
  }

  

}
