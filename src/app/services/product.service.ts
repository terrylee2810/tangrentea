import { Injectable} from "@angular/core";
import { HttpsServices } from '../services/https.service';
import { UrlService } from './url';

@Injectable()
export class ProductService {

  constructor(
    private httpsServices: HttpsServices,
    private url: UrlService
  ) { 

  } 

  getProductLists(obj){
    return this.httpsServices.httpPost$(this.url.GetProduct,obj);
  }

  getNumberNotification(obj){
    return this.httpsServices.httpPost$(this.url.GetNumberNotification,obj);
  }


  getUserProductLists(userid, currentpage, currentdate){
    let obj = { 
      Created_User : userid,
      Current_Page : currentpage,
      Current_DateTime : currentdate,
      Is_Deleted: 0,
     };
    return this.httpsServices.httpPost$(this.url.GetProductList,obj);
  }

  getProductData(userid, productid){
    let obj = { 
      Created_User : userid,
      Product_ID : productid };
    return this.httpsServices.httpPost$(this.url.GetProductData,obj);
  }

  //Backend use
  getproduct(obj){
    return this.httpsServices.httpPost$(this.url.GetProduct,obj);
  }

  getproductbyid(obj){
    return this.httpsServices.httpPost$(this.url.GetProductById,obj);
  }

  updateseq(obj){
    return this.httpsServices.httpPost$(this.url.UpdateSeq,obj);
  }

  insert(obj){
    return this.httpsServices.httpPost$(this.url.InsertProduct,obj);
  }

  edit(obj){
    return this.httpsServices.httpPost$(this.url.EditProduct,obj);
  }

  delete(obj){
    return this.httpsServices.httpPost$(this.url.DeleteProduct,obj);
  }

  getallcategory(obj){
    return this.httpsServices.httpPost$(this.url.GetAllCategory,obj);
  } 
  GetProductOnlineList(obj){
    return this.httpsServices.httpPost$(this.url.GetProductOnlineList,obj);
  }
}
