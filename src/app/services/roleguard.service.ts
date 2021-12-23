import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { UserSession } from '../entity/UserSession';
import { ConfigManager } from './config.service';

@Injectable({
  providedIn: "root"
})
export class RoleGuardService implements CanActivate {
  constructor(private router: Router,
    public obsUserSession: UserSession,
    private configManager: ConfigManager) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {

     
    this.obsUserSession = await this.configManager.GetUser();
    
    if(!'Admin;Admin1;Admin12;Admin2;Admin3;Admin123;'.includes(this.obsUserSession.Member_Type+';')){
      this.router.navigate(["home"]);
      return false;
    }
 
    return true;
  }
}