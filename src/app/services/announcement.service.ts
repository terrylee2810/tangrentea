import { Injectable} from "@angular/core";
import { HttpsServices } from '../services/https.service';
import { UrlService } from './url';

@Injectable()
export class AnnouncementService {

  constructor(
    private httpsServices: HttpsServices,
    private url: UrlService
  ) { 

  }
  getannouncement(obj){
    return this.httpsServices.httpPost$(this.url.GetAnnouncement,obj);
  }

  getannouncementbyid(obj){
    return this.httpsServices.httpPost$(this.url.GetAnnouncementById,obj);
  }

  insert(obj){
    return this.httpsServices.httpPost$(this.url.InsertAnnouncement,obj);
  }

  edit(obj){
    return this.httpsServices.httpPost$(this.url.EditAnnouncement,obj);
  }

  delete(obj){
    return this.httpsServices.httpPost$(this.url.DeleteAnnouncement,obj);
  }

  getannouncementmsg(obj){
    return this.httpsServices.httpPost$(this.url.GetAnnouncementmsg,obj);
  }


  
}
