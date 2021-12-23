import { Injectable} from "@angular/core";
import { Storage } from '@capacitor/storage';
import { AnnoucementInfo, DeliveryInfo, OrderKey } from "../entity/Cart";
import { UserSession } from '../entity/UserSession';

@Injectable()
export class ConfigManager {
  constructor(
  ) { }

  // GetToken(){
  //   let data = Storage.get({key: 'Token'}).then(data =>{
  //     return data.value;});
  //   return data;
  // }

  async GetFirebaseToken(){
    const item = await Storage.get({key: 'FirebaseToken'});
    return item.value;
  }

  SetFirebaseToken(data: string){
    Storage.set({key: 'FirebaseToken', value: data});
  }

  async GetToken(){
    const item = await Storage.get({key: 'Token'});
    return item.value;
  }

  SetToken(data: string){
    Storage.set({key: 'Token', value: "Bearer " + data});
  }

  async GetUserToken(){
    const item = await Storage.get({key: 'Token'});
    return item.value;
  }

  SetUserToken(data: string){
    Storage.set({key: 'Token', value: "Bearer " + data});
  }

  async GetUser<UserSession>() {
    const item = await Storage.get({key: 'User'});
    return Object.assign(
      new UserSession(),
      JSON.parse(item.value)
    );
  }

  async RemoveUser() {
    await Storage.remove({ key: 'User' });
  }

  SetUser(data: string){
    Storage.set({key: 'User', value: data});
  }

  SetDeliveryInfo(data: string){
    Storage.set({key: 'DeliveryInfo', value: data});
  }

  async GetDeliveryInfo<DeliveryInfo>() {
    const item = await Storage.get({key: 'DeliveryInfo'});
    return Object.assign(
      new DeliveryInfo,
      JSON.parse(item.value)
    );
  }

  async RemoveDeliveryInfo() {
    await Storage.remove({ key: 'DeliveryInfo' });
  }

  SetCart(data: string){
    Storage.set({key: 'Cart', value: data});
  }

  async GetCart(){
    const item = await Storage.get({key: 'Cart'});
    return item.value;
  }




  SetOrderKey(data: string){
    Storage.set({key: 'OrderKey', value: data});
  }

  async GetOrderKey<OrderKey>() {
    const item = await Storage.get({key: 'OrderKey'});
    return Object.assign(
      new OrderKey,
      JSON.parse(item.value)
    );
  }



  async RemoveOrderKey() {
    await Storage.remove({ key: 'OrderKey' });
  }

 GetMenu() {
  let data = [];
  data = [
    {url:"#/dashboard", title:"Account Dashboard", bold: false,  idx: 1, seq: 1, role: "*"},
    {url:"#/memberprofile", title:"Account Information", bold: false, idx: 2,seq: 2, role: "*"},
    {url:"#/announcement", title:"Announcement", bold: false, idx: 20,seq: 3, role: "Admin;"},
    {url:"#/changepassword", title:"Change Password", bold: false, idx: 3,seq: 4, role: "*"},

    {url:"#/deliverylist", title:"Delivery List", bold: false, idx: 6,seq: 5, role: "Admin;Admin2;Admin12;Admin3;"},
    {url:"#/postcode", title:"Delivery Charges", bold: false, idx: 11,seq: 6, role: "Admin;"},

    {url:"#/email", title:"Email Template", bold: false, idx: 19,seq: 7, role: "Admin;"},

    {url:"#/address", title:"My Address", bold: false, idx: 4,seq: 8, role: "*"},
    {url:"#/orderlist", title:"My Orders", bold: false, idx: 5,seq: 9, role: "*"},
    {url:"#/jxorderlist", title:"Order List", bold: false, idx: 10,seq: 10, role: "Admin;Admin1;Admin2;Admin3;Admin123;"},

    {url:"#/holiday", title:"Public Holidays", bold: false, idx: 12,seq: 11, role: "Admin;"},
    {url:"#/product", title:"Product", bold: false, idx: 15,seq: 12, role: "Admin;"},
    {url:"#/productcalendar", title:"Product Calendar", bold: false, idx: 16,seq: 13, role: "Admin;"},
    {url:"#/stockbalance", title:"Production Plan", bold: false, idx: 18,seq: 14, role: "Admin;Admin3;"},
    {url:"#/invoice", title:"Print Invoices", bold: false, idx:7, seq: 15, role: "Admin;Admin2;Admin3;"},
    {url:"#/rptcustomisepackaging", title:"Print Customise P", bold: false, idx: 8,seq: 16, role: "Admin;Admin2;Admin3;Admin123;"},
    {url:"#/rptdelivery", title:"Print Delivery List", bold: false, idx: 9,seq: 17, role: "Admin;Admin2;Admin3;Admin123;"},
    {url:"#/rptdeliverysummary", title:"Print Delivery Summary", bold: false, idx: 13,seq: 18, role: "Admin;Admin3;Admin123;"},
    {url:"#/rptdeliverybreakdown", title:"Print Delivery Breakdown", bold: false, idx: 14,seq: 19, role: "Admin;Admin3;Admin123;"},
    {url:"#/rptstockbal", title:"Print Product Plan", bold: false, idx: 14,seq: 19, role: "Admin;Admin3;Admin123;"},
    
    {url:"#/jxuserlist", title:"User", bold: false, idx: 17,seq: 20, role: "Admin;"},

    
    // {url:"#/orderedit", title:"Order Edit", bold: false, idx: 12,seq: 11, role: "Admin"},
    
    // {url:"#/postcode", title:"Postcode", bold: false, idx: 11,seq: 10, role: "Admin"},
    // {url:"#/holiday", title:"Holiday", bold: false, idx: 12,seq: 11, role: "Admin"},
    // {url:"#/product", title:"Product", bold: false, idx: 13,seq: 12, role: "Admin"}
  ]
    
    return data;
  }






  SetOrderInfo(data: string){
    Storage.set({key: 'OrderInfo', value: data});
  }

  async GetOrderInfo<DeliveryInfo>() {
    const item = await Storage.get({key: 'OrderInfo'});
    return Object.assign(
      new DeliveryInfo,
      JSON.parse(item.value)
    );
  }

  async RemoveOrderInfo() {
    await Storage.remove({ key: 'OrderInfo' });
  }



  SetAnnouncement(data: string){
    Storage.set({key: 'Announcement', value: data});
  }

  async GetAnnouncement<AnnoucementInfo>() {
    const item = await Storage.get({key: 'Announcement'});
    return Object.assign(
      new AnnoucementInfo,
      JSON.parse(item.value)
    );
  }

  async RemoveAnnouncement() {
    await Storage.remove({ key: 'Announcement' });
  }


}
