import { Injectable} from "@angular/core";
import { HttpsServices } from '../services/https.service';
import { UrlService } from './url';

@Injectable()
export class StockBalanceService {

  constructor(
    private httpsServices: HttpsServices,
    private url: UrlService
  ) { 

  }

  getstockbalance(obj){
    return this.httpsServices.httpPost$(this.url.GetStockBalance,obj);
  }

  insert(obj){
    return this.httpsServices.httpPost$(this.url.InsertStockBalance,obj);
  }
}
