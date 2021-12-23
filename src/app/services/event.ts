import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class EventService{
  private formRefreshAnnouncedSource = new Subject();
  formRefreshSource$ = this.formRefreshAnnouncedSource.asObservable();

  publishFormRefresh(){
    this.formRefreshAnnouncedSource.next()
  }

  private notificationSource = new Subject();
  notificationSource$ = this.notificationSource.asObservable();

  notificationRefresh(data:number){
    this.notificationSource.next(data)
  }


  private messagelistSource = new Subject();
  messagelistSource$ = this.messagelistSource.asObservable();

  messagelistRefresh(){
    this.messagelistSource.next()
  }


  private logoutSource = new Subject();
  logoutSource$ = this.logoutSource.asObservable();

  logoutRefresh(redirectlogin:boolean){
    this.logoutSource.next(redirectlogin)
  }


  private dashboardSource = new Subject();
  dashboardSource$ = this.dashboardSource.asObservable();

  dashboardRefresh(data:number){
    this.dashboardSource.next(data)
  }

  private productSource = new Subject();
  productSource$ = this.productSource.asObservable();

  productRefresh(){
    this.productSource.next()
  }
}