import { Injectable } from "@angular/core";
import { HttpsServices } from "../services/https.service";
import { UrlService } from "./url";

@Injectable()
export class UserService {
  constructor(private httpsServices: HttpsServices, private url: UrlService) {}

  logoutUser(obj) {
    return this.httpsServices.httpPost$(this.url.LogoutUser, obj);
  }

  loginUser(obj) {
    let objlogin = {
      User_Email: obj.User_Email,
      Password: obj.Password,
      Firebase_Token: obj.Firebase_Token,
    };

    return this.httpsServices.httpPost$(this.url.LoginUser, objlogin);
  }

  changePassword(obj) {
     
    let objlogin = {
      User_ID: obj.User_ID,
      New_Password: obj.Password,
      Old_Password: obj.Old_Password,
    };

    return this.httpsServices.httpPost$(this.url.ChangePassword, objlogin);
  }

  updateUser(obj) {
     
    let objReq = {
      User_ID: obj.User_ID,
      First_Name: obj.First_Name,
      Last_Name: obj.Last_Name,
      User_Email: obj.User_Email,
    };

    return this.httpsServices.httpPost$(this.url.UpdateUser, objReq);
  }

  updateBillingAddress(obj) {
     
    let objReq = {
      User_ID: obj.User_ID,
      Billing_First_Name: obj.Billing_First_Name,
      Billing_Last_Name: obj.Billing_Last_Name,
      Billing_Company_Name: obj.Billing_Company_Name,
      Billing_Street_Address1: obj.Billing_Street_Address1,
      Billing_Street_Address2: obj.Billing_Street_Address2,
      Billing_City: obj.Billing_City,
      Billing_Postcode: obj.Billing_Postcode,
      Billing_Phone: obj.Billing_Phone,
      Billing_Email: obj.Billing_Email,
      Billing_Country: obj.Billing_Country,
    };

    return this.httpsServices.httpPost$(this.url.UpdateUser, objReq);
  }

  updateShippingAddress(obj) {
     
    let objReq = {
      User_ID: obj.User_ID,
      Shipping_First_Name: obj.Shipping_First_Name,
      Shipping_Last_Name: obj.Shipping_Last_Name,
      Shipping_Company_Name: obj.Shipping_Company_Name,
      Shipping_Street_Address1: obj.Shipping_Street_Address1,
      Shipping_Street_Address2: obj.Shipping_Street_Address2,
      Shipping_City: obj.Shipping_City,
      Shipping_Postcode: obj.Shipping_Postcode,
      Shipping_Phone: obj.Shipping_Phone,
      Shipping_Email: obj.Shipping_Email,
      Shipping_Country: obj.Shipping_Country,
    };

    return this.httpsServices.httpPost$(this.url.UpdateUser, objReq);
  }

  resendConfirmationEmail(obj) {
    return this.httpsServices.httpPost$(this.url.ResendConfirmationEmail, obj);
  }

  getUser(obj) {
    let objReq = {
      User_ID: obj.User_ID,
    };

    return this.httpsServices.httpPost$(this.url.GetUserData, objReq);
  }

  addUser(obj) {
    console.log(obj);

    return this.httpsServices.httpPost$(this.url.InsertUser, obj);
  }

  emailValidation(obj) {
    return this.httpsServices.httpPost$(this.url.EmailValidation, obj);
  }

  resetPassword(obj) {
    return this.httpsServices.httpPost$(this.url.ResetPassword, obj);
  }

  getuserslist(obj){
    return this.httpsServices.httpPost$(this.url.GetUserList,obj);
  }

  delete(obj){
    return this.httpsServices.httpPost$(this.url.DeleteUser,obj);
  }

  insert(obj){
    return this.httpsServices.httpPost$(this.url.InsertJxUser,obj);
  }

  edit(obj){
    return this.httpsServices.httpPost$(this.url.EditUser,obj);
  }

  getUserbyid(obj) {
    let objReq = {
      User_ID: obj.User_ID,
    };

    return this.httpsServices.httpPost$(this.url.GetUserById, objReq);
  }

}
