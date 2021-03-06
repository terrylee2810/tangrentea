import { Injectable, Inject, Injector, NgModule } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, timer, of } from "rxjs";
import {
  retryWhen,
  delayWhen,
  tap,
  take,
  delay,
  catchError,
  map, switchMap,
  timeout
} from "rxjs/operators";
import {
  Response,
  PageErrorResponse,
  MESSAGETYPE,
} from "src/app/entity/HttpResponse";
import { ToastService } from "./toast.service";
import { NavigationExtras, Router } from '@angular/router';
import { AlertService } from './alert.service';
import { EventService } from './event';

import { UserSession } from '../entity/UserSession';
import { ConfigManager } from './config.service';

import sign from 'jwt-encode';

@Injectable()
export class HttpsServices {
  constructor(
    private httpClient: HttpClient,
    private toastService: ToastService,
    private router: Router,
    private alertService : AlertService,
    private eventService: EventService,
    // private jwt:Jwt2,
    private obsUserSession: UserSession,
    private configManager: ConfigManager,
  ) {
   
 
  }

  jwt_encode( custid: string = null) {
    var strRole = ""
    if(custid){
      strRole = "AppUser";
    }else{
      custid = "Guest"
      strRole = "Guest";
    }

    var current_time = Number(new Date().getTime() / 1000);
    var obj = {
    nbf: current_time,
    exp: current_time +3600,
    iat: current_time,
    nameid: custid,
    unique_name: custid,
    role: strRole
    }

    var jwt_token = sign(obj, 'bXlhd2Vzb21la2V5');
    return "Bearer " + jwt_token;
  }

  jwt_payload_encode(payload, custid: string = null) {
    var strRole = ""
    if(custid){
      strRole = "AppUser";
    }else{
      custid = "Guest"
      strRole = "Guest";
    }

    var current_time = Number(new Date().getTime() / 1000);
    var obj = {
    nbf: current_time,
    exp: current_time +3600,
    iat: current_time,
    nameid: custid,
    unique_name: custid,
    role: strRole,
    userdata: payload }

    var jwt_token = sign(obj, 'bXlhd2Vzb21la2V5');
    return jwt_token;
  }

  async httpPost$(
    url: string,
    obj: object | any,
    responseType : string ='json'
  ): Promise<Observable<any>> {
debugger;
    this.obsUserSession = await this.configManager.GetUser();    
    var user_id;
  
    if (this.obsUserSession.User_ID !== undefined){
      user_id = this.obsUserSession.User_ID + "";
    }else{
      user_id = 1+ "";
    }
    var jwttoken = this.jwt_encode(user_id);
    var jwt_payload_encode = this.jwt_payload_encode(obj, user_id);
    
    const httpheaders = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin" : '*',
        "Access-Control-Allow-Headers": "Content-Type",
        // 'X-Requested-With' : 'XMLHttpRequest',
        Authorization: jwttoken,
        responseType: responseType
      }),
    };
    return this.httpClient.post(url, jwt_payload_encode, httpheaders).pipe(
      retryWhen((errors) =>
        errors.pipe(
          // log error message
          tap((err) => {
           
            console.warn("httpClient GET error:", err);
            throw err;
           
          }),
          delay(1000),
          take(2) // retry another 2 times
        )
      ),
      catchError((res) => {
        if(res.statusText =='Expired token'){
          let result = this.alertService
          .show("Session Expired", "Please re-login to renew your session.", ["Ok"])
          .pipe(
            switchMap((reply) => {
              if (reply == "Ok") {
                return of(true);
              } else {
                return of(false);
              }
            })
          ).subscribe(
            (reply) => {
              if (reply) {
              
                this.eventService.logoutRefresh(true);
                return of(res);
              }
            }
          );
        } else{
          // this.router.navigate(['login']);
          this.toastService.show(
            "There was an error. Please try again later.",
            "bottom",
            5000,
            "danger"
          );

          
          //  return of(res);
        }
        return of(res);
      
      })
    );
  }

  handleError(res: any): Observable<any> {
    if (res.error.Errors !== undefined) {
      return this.handleResponseError(res.error as Response);
    } else if (res.error.StackTrace !== undefined) {
      return this.handlePageError(res.error as PageErrorResponse);
    } else {
      return this.handleAnyError(res as any);
    }
  }

  private handleResponseError(res: Response): Observable<Response> {
    if (res == null) {
      return;
    }
    if (!!res.Exception) {
      this.showHttpResponseMessage(
        MESSAGETYPE.Exception,
        JSON.stringify(res.Exception, null, 2)
      );
    } else if (!!res.Errors && !res.ProcessingStatus) {
      if (Array.isArray(res.Data)) {
        res.Errors.map((s) =>
          this.showHttpResponseMessage(MESSAGETYPE.Error, s.Description)
        );
      } else if (Array.isArray(res.Errors)) {
        res.Errors.map((s) =>
          this.showHttpResponseMessage(MESSAGETYPE.Error, s.Description, s.Code)
        );
      } else {
        this.showHttpResponseMessage(MESSAGETYPE.Warning, res.Errors[0]);
      }
    } else if (!!res.Warnings && res.ProcessingStatus) {
      if (Array.isArray(res.Warnings)) {
        res.Warnings.map((s) =>
          this.showHttpResponseMessage(
            MESSAGETYPE.Warning,
            s.Description,
            s.Code
          )
        );
      } else {
        this.showHttpResponseMessage(MESSAGETYPE.Warning, res.Warnings[0]);
      }
    }
    return of(res);
  }

  private handlePageError(
    res: PageErrorResponse
  ): Observable<PageErrorResponse | any> {
    if (res == null) {
      return of([]);
    }
    if (!!res.StackTrace) {
      this.showHttpResponseMessage(MESSAGETYPE.Exception, res.ExceptionMessage);
    }
    return of(res);
  }

  private handleAnyError(err: any): Observable<any> {
    console.log(err);
    this.showHttpResponseMessage(MESSAGETYPE.Error, err);
    return of(err);
  }

  public showHttpResponseMessage(
    type: MESSAGETYPE,
    message: string,
    header: string = null
  ) {
    switch (type) {
      case MESSAGETYPE.Success:
        this.toastService.show(message, "bottom", 3000, "success", header);
        break;
      case MESSAGETYPE.Error:
      case MESSAGETYPE.Exception:
        this.toastService.show(
          "There was an error. Please try again later.",
          "bottom",
          5000,
          "danger",
          header
        );
        break;
      case MESSAGETYPE.Warning:
        this.toastService.show(message, "bottom", 3000, "warning", header);
        break;
    }
  }
}
