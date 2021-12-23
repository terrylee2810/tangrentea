import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
// import { StatusBar } from "@awesome-cordova-plugins/status-bar/ngx";

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faTimesCircle,faInfoCircle,faUser,faPlus,faPhoneAlt,faTimes,faShoppingCart,faCartPlus,faStethoscope,faClipboard,faEllipsisH,faExclamationTriangle,faRedo,faCog,faUserCircle,faKey,faHome,faTags,faCommentAlt,faTag,faUserPlus,faSignInAlt,
faSignOutAlt,faEnvelope,faFileAlt,faPlusCircle,faGamepad,faRunning,faPaw,faSeedling,faChair,faVideo,
faMobileAlt,faTshirt,faBars,faList,faArrowCircleLeft,faUpload,faPaperPlane,faEllipsisV,faEdit,
faCheckCircle,
faQuestionCircle
 } from '@fortawesome/free-solid-svg-icons'

//Perfecct Scrollbar
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import {   
  LocationStrategy,  
  HashLocationStrategy,
} from '@angular/common'; 
import { AgmCoreModule } from '@agm/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AnnouncementService } from './services/announcement.service';



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserAnimationsModule,FontAwesomeModule, 
    PerfectScrollbarModule, 
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAUxghld9Qm7EoIh3nCc6KOznYEVlCTjN4'
    }),
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule],
  providers: [
    AnnouncementService,
    // StatusBar,
    // SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
    // ,
    // {provide: LocationStrategy, useClass: HashLocationStrategy,}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) { 
    library.addIcons(faTimesCircle,faInfoCircle,faQuestionCircle,faUser,faPlus,faPhoneAlt,faTimes,faShoppingCart,faCartPlus,faStethoscope,faExclamationTriangle,faRedo,faCheckCircle,faCog,faUserCircle,faKey,faHome,faTags,faCommentAlt,faTag,faUserPlus,faSignInAlt,
      faClipboard,faEllipsisH,faSignOutAlt,faEnvelope,faFileAlt,faPlusCircle,faGamepad,faRunning,faPaw,faSeedling,faChair,faVideo,
      faMobileAlt,faTshirt,faBars,faList,faArrowCircleLeft,faUpload,faPaperPlane,faEllipsisV,faEdit)
		// library.addIconPacks(fas, fab, far);
	}
}
