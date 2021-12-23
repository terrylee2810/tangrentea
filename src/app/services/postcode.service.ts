import { Injectable} from "@angular/core";
import { HttpsServices } from '../services/https.service';
import { UrlService } from './url';

@Injectable()
export class PostcodeService {

  constructor(
    private httpsServices: HttpsServices,
    private url: UrlService
  ) { 

  }
  getpostcodes(obj){
    return this.httpsServices.httpPost$(this.url.GetPostcodes,obj);
  }

  getpostcodesbyid(obj){
    return this.httpsServices.httpPost$(this.url.GetPostcodeById,obj);
  }

  insert(obj){
    return this.httpsServices.httpPost$(this.url.InsertPostcodes,obj);
  }

  edit(obj){
    return this.httpsServices.httpPost$(this.url.EditPostcodes,obj);
  }

  delete(obj){
    return this.httpsServices.httpPost$(this.url.DeletePostcodes,obj);
  }
}
