import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot, ActivatedRoute } from "@angular/router";
import { DeliveryInfo } from "../entity/Cart";
import { UserSession } from '../entity/UserSession';
import { ConfigManager } from './config.service';

@Injectable({
  providedIn: "root"
})
export class CartGuardService implements CanActivate {
  constructor(private router: Router,
    public obsUserSession: UserSession,
    public obsDeliveryInfo: DeliveryInfo,
    public obsOrderInfo: DeliveryInfo,
    private configManager: ConfigManager,
    private route: ActivatedRoute) {}

    async GetParams() {
      let promise = new Promise((resolve, reject) => {
        this.route.queryParams.subscribe((params) => {
          if (params) {
            resolve(params);
          }
        });
      });
  
      return await promise; // wait until the promise resolves (*)
    }

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    debugger;
    // const data = await this.GetParams();
    // const usePreviousData = route.queryParamMap.has(usePreviousDataParam);

    this.obsOrderInfo = await this.configManager.GetOrderInfo();
    this.obsDeliveryInfo = await this.configManager.GetDeliveryInfo();
    if (this.obsOrderInfo.Cart == undefined && this.obsDeliveryInfo.Cart == undefined) {
      this.router.navigate(["delivery"]);
      return false;
    }



  
 
//     this.obsUserSession = await this.configManager.GetUser();
// console.log('auth ' + this.obsUserSession.User_ID );
//     if (this.obsUserSession.User_ID == undefined) {
//       this.router.navigate(["login"]);
//       return false;
//     }

    return true;
  }
}