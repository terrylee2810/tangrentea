import { Injectable} from "@angular/core";
import { HttpsServices } from '../services/https.service';
import { UrlService } from './url';

@Injectable()
export class EmailService {

  constructor(
    private httpsServices: HttpsServices,
    private url: UrlService
  ) { 

  }
  getemails(obj){
    return this.httpsServices.httpPost$(this.url.GetEmails,obj);
  }

  getemailbyid(obj){
    return this.httpsServices.httpPost$(this.url.GetEmailById,obj);
  }

  edit(obj){
    return this.httpsServices.httpPost$(this.url.EditEmails,obj);
  }
}
