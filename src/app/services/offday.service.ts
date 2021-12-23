import { Injectable} from "@angular/core";
import { HttpsServices } from '../services/https.service';
import { UrlService } from './url';

@Injectable()
export class OffdayService {

  constructor(
    private httpsServices: HttpsServices,
    private url: UrlService
  ) { 

  }
  getoffday(obj){
    return this.httpsServices.httpPost$(this.url.GetOffday,obj);
  }

  getoffdaybyid(obj){
    return this.httpsServices.httpPost$(this.url.GetOffdayById,obj);
  }

  insert(obj){
    return this.httpsServices.httpPost$(this.url.InsertOffday,obj);
  }

  edit(obj){
    return this.httpsServices.httpPost$(this.url.EditOffday,obj);
  }

  delete(obj){
    return this.httpsServices.httpPost$(this.url.DeleteOffday,obj);
  }
}
