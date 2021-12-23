import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { UserSession } from '../entity/UserSession';
import { ConfigManager } from './config.service';

@Injectable({
  providedIn: "root"
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router,
    public obsUserSession: UserSession,
    private configManager: ConfigManager) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {

     
    this.obsUserSession = await this.configManager.GetUser();
    if (this.obsUserSession.User_ID == undefined) {
      this.router.navigate(["home"]);
      return false;
    }
    if (this.obsUserSession.Display_Name == '') {
      this.router.navigate(["home"]);
      return false;
    }
    return true;
  }
}