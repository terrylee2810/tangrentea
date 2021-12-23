import { Injectable} from "@angular/core";
import { HttpsServices } from '../services/https.service';
import { UrlService } from './url';

@Injectable()
export class ProductCalendarService {

  constructor(
    private httpsServices: HttpsServices,
    private url: UrlService
  ) { 

  }
  getproductcalendar(obj){
    return this.httpsServices.httpPost$(this.url.GetProductcalendar,obj);
  }

  getproductcalendarbyid(obj){
    return this.httpsServices.httpPost$(this.url.GetProductcalendarById,obj);
  }

  insert(obj){
    return this.httpsServices.httpPost$(this.url.InsertProductcalendar,obj);
  }

  edit(obj){
    return this.httpsServices.httpPost$(this.url.EditProductcalendar,obj);
  }

  delete(obj){
    return this.httpsServices.httpPost$(this.url.DeleteProductcalendar,obj);
  }
}
