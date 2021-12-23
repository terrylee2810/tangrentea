import { Injectable} from "@angular/core";
import { HttpsServices } from '../services/https.service';
import { UrlService } from './url';

@Injectable()
export class HolidayService {

  constructor(
    private httpsServices: HttpsServices,
    private url: UrlService
  ) { 

  }
  getholiday(obj){
    return this.httpsServices.httpPost$(this.url.GetHoliday,obj);
  }

  getholidaybyid(obj){
    return this.httpsServices.httpPost$(this.url.GetHolidayById,obj);
  }

  insert(obj){
    return this.httpsServices.httpPost$(this.url.InsertHoliday,obj);
  }

  edit(obj){
    return this.httpsServices.httpPost$(this.url.EditHoliday,obj);
  }

  delete(obj){
    return this.httpsServices.httpPost$(this.url.DeleteHoliday,obj);
  }
}
